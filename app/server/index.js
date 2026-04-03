import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

import pool from "./db/index.js";
import visitorLogger from "./middleware/visitor.js";
import healthRouter from "./routes/health.js";
import metricsRouter from "./routes/metrics.js";
import deploymentsRouter from "./routes/deployments.js";
import contactRouter from "./routes/contact.js";
import statusRouter from "./routes/status.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);
app.use(cors());
app.use(compression());
app.use(express.json());

// Log visitors on API routes
app.use("/api", visitorLogger);

// API routes
app.use("/api/health", healthRouter);
app.use("/api/metrics", metricsRouter);
app.use("/api/deployments", deploymentsRouter);
app.use("/api/contact", contactRouter);
app.use("/api/status", statusRouter);

// Serve static files in production
if (process.env.NODE_ENV === "production") {
  // In Docker: built files at ./public; local: ../client/dist
  const clientDist = join(__dirname, "public");
  app.use(express.static(clientDist));
  app.get("*", (req, res) => {
    res.sendFile(join(clientDist, "index.html"));
  });
}

// Auto-initialize schema and start server
async function start() {
  try {
    await pool.query("SELECT 1");
    console.log("Database connected");
  } catch (err) {
    console.error("Database connection failed:", err.message);
    process.exit(1);
  }

  // Auto-run schema (IF NOT EXISTS makes this safe)
  try {
    const { readFileSync } = await import("fs");
    const schema = readFileSync(join(__dirname, "db", "schema.sql"), "utf-8");
    await pool.query(schema);
    console.log("Database schema verified");
  } catch (err) {
    console.error("Schema init warning:", err.message);
  }

  const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  // Graceful shutdown
  const shutdown = async (signal) => {
    console.log(`\n${signal} received — shutting down`);
    server.close(async () => {
      await pool.end();
      console.log("Server closed");
      process.exit(0);
    });
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
}

start();
