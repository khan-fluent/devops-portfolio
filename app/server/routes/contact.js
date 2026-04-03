import { Router } from "express";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { query } from "../db/index.js";

const router = Router();

const CONTACT_EMAIL = process.env.CONTACT_EMAIL;
const ses = new SESClient({ region: process.env.AWS_SES_REGION || "us-east-1" });

async function sendNotificationEmail(name, email, message) {
  if (!CONTACT_EMAIL) return;

  const command = new SendEmailCommand({
    Source: CONTACT_EMAIL,
    Destination: { ToAddresses: [CONTACT_EMAIL] },
    Message: {
      Subject: { Data: `Portfolio Contact: ${name}` },
      Body: {
        Text: {
          Data: [
            `New contact form submission`,
            ``,
            `Name:    ${name}`,
            `Email:   ${email}`,
            ``,
            `Message:`,
            message,
            ``,
            `---`,
            `Sent from your DevOps Portfolio`,
          ].join("\n"),
        },
      },
    },
  });

  try {
    await ses.send(command);
    console.log(`Contact notification sent to ${CONTACT_EMAIL}`);
  } catch (err) {
    console.error("SES send failed:", err.message);
  }
}

// POST /api/contact — submit contact form
router.post("/", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      error: "name, email, and message are required",
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      error: "Invalid email address",
    });
  }

  if (message.length > 5000) {
    return res.status(400).json({
      success: false,
      error: "Message must be under 5000 characters",
    });
  }

  try {
    const result = await query(
      "INSERT INTO contacts (name, email, message) VALUES ($1, $2, $3) RETURNING id, created_at",
      [name.trim(), email.trim().toLowerCase(), message.trim()]
    );

    // Send email notification (async, don't block response)
    sendNotificationEmail(name.trim(), email.trim(), message.trim());

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error("Failed to save contact:", err.message);
    res.status(500).json({ success: false, error: "Failed to save contact submission" });
  }
});

export default router;
