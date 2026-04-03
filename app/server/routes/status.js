import { Router } from "express";
import pool from "../db/index.js";

const router = Router();

const ECS_METADATA_URI = process.env.ECS_CONTAINER_METADATA_URI_V4;

async function checkDatabase() {
  const start = Date.now();
  try {
    await pool.query("SELECT 1");
    return { name: "database", status: "pass", latency_ms: Date.now() - start };
  } catch (err) {
    return { name: "database", status: "fail", latency_ms: Date.now() - start, error: err.message };
  }
}

async function checkMemory() {
  const start = Date.now();

  // Use real container memory from ECS metadata if available
  if (ECS_METADATA_URI) {
    try {
      const res = await fetch(`${ECS_METADATA_URI}/task/stats`);
      const stats = await res.json();
      const containers = Object.values(stats);
      let totalUsed = 0;
      let totalLimit = 0;
      for (const c of containers) {
        if (c.memory_stats) {
          totalUsed += c.memory_stats.usage - (c.memory_stats.stats?.cache || 0);
          totalLimit += c.memory_stats.limit;
        }
      }
      const usedPercent = totalLimit > 0 ? (totalUsed / totalLimit) * 100 : 0;
      return {
        name: "memory",
        status: usedPercent < 90 ? "pass" : "warn",
        latency_ms: Date.now() - start,
        detail: {
          used_percent: Math.round(usedPercent * 100) / 100,
          used_mb: Math.round(totalUsed / 1024 / 1024),
          limit_mb: Math.round(totalLimit / 1024 / 1024),
          threshold: 90,
          source: "ecs-metadata",
        },
      };
    } catch {
      // fall through to process-level check
    }
  }

  // Fallback: process memory
  const mem = process.memoryUsage();
  const usedPercent = (mem.rss / (512 * 1024 * 1024)) * 100; // assume 512MB limit
  return {
    name: "memory",
    status: usedPercent < 90 ? "pass" : "warn",
    latency_ms: Date.now() - start,
    detail: {
      used_percent: Math.round(usedPercent * 100) / 100,
      used_mb: Math.round(mem.rss / 1024 / 1024),
      threshold: 90,
      source: "process",
    },
  };
}

function checkUptime() {
  const start = Date.now();
  const uptime = process.uptime();
  return {
    name: "uptime",
    status: uptime > 5 ? "pass" : "starting",
    latency_ms: Date.now() - start,
    detail: { process_uptime_seconds: Math.round(uptime) },
  };
}

// GET /api/status — service health checks
router.get("/", async (req, res) => {
  const checks = await Promise.all([
    checkDatabase(),
    checkMemory(),
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
