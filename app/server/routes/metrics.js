import { Router } from "express";
import os from "os";
import { query } from "../db/index.js";

const router = Router();

function getSystemMetrics() {
  const cpus = os.cpus();
  const cpuUsage = cpus.reduce((acc, cpu) => {
    const total = Object.values(cpu.times).reduce((a, b) => a + b, 0);
    const idle = cpu.times.idle;
    return acc + ((total - idle) / total) * 100;
  }, 0) / cpus.length;

  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const usedMem = totalMem - freeMem;

  return {
    cpu_percent: Math.round(cpuUsage * 100) / 100,
    memory_percent: Math.round((usedMem / totalMem) * 10000) / 100,
    memory_used_mb: Math.round(usedMem / 1024 / 1024),
    uptime_seconds: os.uptime(),
    hostname: os.hostname(),
    platform: os.platform(),
    arch: os.arch(),
    node_version: process.version,
    process_uptime: process.uptime(),
    process_memory: process.memoryUsage(),
  };
}

// GET /api/metrics — real-time system metrics
router.get("/", (req, res) => {
  res.json({ success: true, data: getSystemMetrics() });
});

// GET /api/metrics/history — last 50 snapshots from DB
router.get("/history", async (req, res) => {
  try {
    const result = await query(
      "SELECT * FROM metrics_snapshots ORDER BY recorded_at DESC LIMIT 50"
    );
    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error("Failed to fetch metrics history:", err.message);
    res.status(500).json({ success: false, error: "Failed to fetch metrics history" });
  }
});

// POST /api/metrics/snapshot — save current metrics to DB
router.post("/snapshot", async (req, res) => {
  try {
    const metrics = getSystemMetrics();
    const result = await query(
      `INSERT INTO metrics_snapshots (cpu_percent, memory_percent, memory_used_mb, uptime_seconds, container_count)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [
        metrics.cpu_percent,
        metrics.memory_percent,
        metrics.memory_used_mb,
        metrics.uptime_seconds,
        0,
      ]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error("Failed to save metrics snapshot:", err.message);
    res.status(500).json({ success: false, error: "Failed to save metrics snapshot" });
  }
});

export default router;
