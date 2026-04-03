CREATE TABLE IF NOT EXISTS visitors (
  id SERIAL PRIMARY KEY,
  ip VARCHAR(45),
  path VARCHAR(2048),
  user_agent TEXT,
  visited_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS deployments (
  id SERIAL PRIMARY KEY,
  commit_sha VARCHAR(40),
  branch VARCHAR(255),
  status VARCHAR(50),
  deployed_at TIMESTAMPTZ DEFAULT NOW(),
  duration_ms INT
);

CREATE TABLE IF NOT EXISTS contacts (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255),
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS metrics_snapshots (
  id SERIAL PRIMARY KEY,
  cpu_percent FLOAT,
  memory_percent FLOAT,
  memory_used_mb FLOAT,
  uptime_seconds FLOAT,
  container_count INT,
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);
