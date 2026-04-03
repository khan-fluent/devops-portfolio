import { Router } from "express";
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";
import { query } from "../db/index.js";

const router = Router();

const SNS_TOPIC_ARN = process.env.SNS_TOPIC_ARN;
const sns = new SNSClient({ region: process.env.AWS_SES_REGION || "us-east-1" });

async function sendNotification(name, email, message) {
  if (!SNS_TOPIC_ARN) {
    console.warn("SNS_TOPIC_ARN not set — skipping notification");
    return;
  }

  const command = new PublishCommand({
    TopicArn: SNS_TOPIC_ARN,
    Subject: `Portfolio Contact: ${name}`,
    Message: [
      `New contact form submission`,
      ``,
      `Name:    ${name}`,
      `Email:   ${email}`,
      ``,
      `Message:`,
      message,
      ``,
      `---`,
      `Sent from khanfluent.digital`,
    ].join("\n"),
  });

  try {
    await sns.send(command);
    console.log("Contact notification sent via SNS");
  } catch (err) {
    console.error("SNS publish failed:", err.message);
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

    // Send notification (async, don't block response)
    sendNotification(name.trim(), email.trim(), message.trim());

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error("Failed to save contact:", err.message);
    res.status(500).json({ success: false, error: "Failed to save contact submission" });
  }
});

export default router;
