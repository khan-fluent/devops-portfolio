import { Router } from "express";
import os from "os";
import { query } from "../db/index.js";

const router = Router();

const ECS_METADATA_URI = process.env.ECS_CONTAINER_METADATA_URI_V4;

// Cache for ECS stats (refresh every 3 seconds)
let cachedStats = null;
let lastFetch = 0;

async function fetchEcsStats() {
  if (!ECS_METADATA_URI) return null;

  const now = Date.now();
  if (cachedStats && now - lastFetch < 3000) return cachedStats;

  try {
    const [taskRes, statsRes] = await Promise.all([
      fetch(`${ECS_METADATA_URI}/task`),
      fetch(`${ECS_METADATA_URI}/task/stats`),
    ]);

    const task = await taskRes.json();
    const stats = await statsRes.json();

    cachedStats = { task, stats };
    lastFetch = now;
    return cachedStats;
  } catch (err) {
    console.error("ECS metadata fetch failed:", err.message);
    return null;
  }
}

function calcDockerCpu(stats) {
  // Docker stats format: calculate CPU % from cpu_stats
  const cpuDelta =
    stats.cpu_stats.cpu_usage.total_usage -
    stats.precpu_stats.cpu_usage.total_usage;
  const systemDelta =
    stats.cpu_stats.system_cpu_usage - stats.precpu_stats.system_cpu_usage;
  const numCpus = stats.cpu_stats.online_cpus || 1;

  if (systemDelta > 0 && cpuDelta >= 0) {
    return Math.round((cpuDelta / systemDelta) * numCpus * 10000) / 100;
  }
  return 0;
}

function calcDockerMemory(stats) {
  const used = stats.memory_stats.usage - (stats.memory_stats.stats?.cache || 0);
  const limit = stats.memory_stats.limit;
  return {
    percent: Math.round((used / limit) * 10000) / 100,
    used_mb: Math.round(used / 1024 / 1024),
    limit_mb: Math.round(limit / 1024 / 1024),
  };
}

async function getSystemMetrics() {
  const ecs = await fetchEcsStats();

  // If running on ECS, use real container stats
  if (ecs && ecs.stats) {
    const containerIds = Object.keys(ecs.stats);
    const containers = containerIds.map((id) => ecs.stats[id]).filter(Boolean);
    const running = containers.length;

    // Aggregate CPU and memory across all containers in the task
    let totalCpu = 0;
    let totalMemUsed = 0;
    let totalMemLimit = 0;

    for (const c of containers) {
      if (c.cpu_stats && c.precpu_stats) {
        totalCpu += calcDockerCpu(c);
      }
      if (c.memory_stats) {
        const mem = calcDockerMemory(c);
        totalMemUsed += mem.used_mb;
        totalMemLimit += mem.limit_mb;
      }
    }

    return {
      cpu_percent: Math.round(totalCpu * 100) / 100,
      memory_percent:
        totalMemLimit > 0
          ? Math.round((totalMemUsed / totalMemLimit) * 10000) / 100
          : 0,
      memory_used_mb: totalMemUsed,
      memory_limit_mb: totalMemLimit,
      uptime_seconds: os.uptime(),
      hostname: os.hostname(),
      platform: os.platform(),
      arch: os.arch(),
      node_version: process.version,
      process_uptime: process.uptime(),
      container_count: running,
      source: "ecs-metadata",
    };
  }

  // Fallback: local os module (for local dev / non-ECS)
  const cpus = os.cpus();
  const cpuUsage =
    cpus.reduce((acc, cpu) => {
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
    memory_limit_mb: Math.round(totalMem / 1024 / 1024),
    uptime_seconds: os.uptime(),
    hostname: os.hostname(),
    platform: os.platform(),
    arch: os.arch(),
    node_version: process.version,
    process_uptime: process.uptime(),
    container_count: 1,
    source: "os-module",
  };
}

// GET /api/metrics — real-time system metrics
router.get("/", async (req, res) => {
  const metrics = await getSystemMetrics();
  res.json({ success: true, data: metrics });
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
    const metrics = await getSystemMetrics();
    const result = await query(
      `INSERT INTO metrics_snapshots (cpu_percent, memory_percent, memory_used_mb, uptime_seconds, container_count)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [
        metrics.cpu_percent,
        metrics.memory_percent,
        metrics.memory_used_mb,
        metrics.uptime_seconds,
        metrics.container_count,
      ]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error("Failed to save metrics snapshot:", err.message);
    res.status(500).json({ success: false, error: "Failed to save metrics snapshot" });
  }
});

export default router;
