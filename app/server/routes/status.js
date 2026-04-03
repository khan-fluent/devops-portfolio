import { Router } from "express";
import os from "os";
import pool from "../db/index.js";

const router = Router();

async function checkDatabase() {
  const start = Date.now();
  try {
    await pool.query("SELECT 1");
    return { name: "database", status: "pass", latency_ms: Date.now() - start };
  } catch (err) {
    return { name: "database", status: "fail", latency_ms: Date.now() - start, error: err.message };
  }
}

function checkMemory() {
  const start = Date.now();
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const usedPercent = ((totalMem - freeMem) / totalMem) * 100;
  const threshold = 95;
  return {
    name: "memory",
    status: usedPercent < threshold ? "pass" : "warn",
    latency_ms: Date.now() - start,
    detail: { used_percent: Math.round(usedPercent * 100) / 100, threshold },
  };
}

function checkUptime() {
  const start = Date.now();
  const uptime = process.uptime();
  return {
    name: "uptime",
    status: uptime > 5 ? "pass" : "starting",
    latency_ms: Date.now() - start,
    detail: { uptime_seconds: Math.round(uptime) },
  };
}

// GET /api/status — service health checks
router.get("/", async (req, res) => {
  const checks = await Promise.all([
    checkDatabase(),
    Promise.resolve(checkMemory()),
    Promise.resolve(checkUptime()),
  ]);

  const overall = checks.every((c) => c.status === "pass") ? "healthy" : "degraded";
  const httpStatus = checks.some((c) => c.status === "fail") ? 503 : 200;

  res.status(httpStatus).json({
    success: true,
    data: {
      status: overall,
      timestamp: new Date().toISOString(),
      checks,
    },
  });
});

export default router;
