import { Router } from "express";
import { query } from "../db/index.js";

const router = Router();

// GET /api/deployments — recent deployment history
router.get("/", async (req, res) => {
  try {
    const result = await query(
      "SELECT * FROM deployments ORDER BY deployed_at DESC LIMIT 20"
    );
    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error("Failed to fetch deployments:", err.message);
    res.status(500).json({ success: false, error: "Failed to fetch deployments" });
  }
});

// GET /api/deployments/stats — summary statistics
router.get("/stats", async (req, res) => {
  try {
    const result = await query(`
      SELECT
        COUNT(*)::int AS total,
        COUNT(*) FILTER (WHERE status = 'success')::int AS successful,
        ROUND(
          COUNT(*) FILTER (WHERE status = 'success')::numeric / GREATEST(COUNT(*), 1) * 100, 1
        ) AS success_rate,
        ROUND(AVG(duration_ms)::numeric, 0)::int AS avg_duration_ms
      FROM deployments
    `);
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error("Failed to fetch deployment stats:", err.message);
    res.status(500).json({ success: false, error: "Failed to fetch deployment stats" });
  }
});

// POST /api/deployments — record a new deployment
router.post("/", async (req, res) => {
  const { commit_sha, branch, status, duration_ms } = req.body;

  if (!commit_sha || !branch || !status) {
    return res.status(400).json({
      success: false,
      error: "commit_sha, branch, and status are required",
    });
  }

  const validStatuses = ["success", "failure", "pending", "cancelled"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      error: `status must be one of: ${validStatuses.join(", ")}`,
    });
  }

  try {
    const result = await query(
      `INSERT INTO deployments (commit_sha, branch, status, duration_ms)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [commit_sha, branch, status, duration_ms || null]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error("Failed to record deployment:", err.message);
    res.status(500).json({ success: false, error: "Failed to record deployment" });
  }
});

export default router;
