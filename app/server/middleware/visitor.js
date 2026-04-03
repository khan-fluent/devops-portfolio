import { query } from "../db/index.js";

export default function visitorLogger(req, res, next) {
  // Fire and forget — don't block the response
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  const path = req.originalUrl;
  const userAgent = req.headers["user-agent"] || null;

  query(
    "INSERT INTO visitors (ip, path, user_agent) VALUES ($1, $2, $3)",
    [ip, path, userAgent]
  ).catch((err) => {
    console.error("Failed to log visitor:", err.message);
  });

  next();
}
