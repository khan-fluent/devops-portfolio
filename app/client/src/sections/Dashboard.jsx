import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import useApi from '../hooks/useApi';
import '../styles/Dashboard.css';

gsap.registerPlugin(ScrollTrigger);

const EMPTY_METRICS = {
  cpu: 0,
  memory: 0,
  uptime: '--',
  containers: { running: 0, total: 0 },
};

const EMPTY_STATUS = {
  services: [],
};

const EMPTY_DEPLOYMENTS = {
  total: 0,
  successRate: '0.0',
  avgDuration: '--',
  recent: [],
};

function getMetricColor(type, value) {
  if (type === 'cpu' || type === 'memory') {
    if (value < 60) return 'green';
    if (value < 85) return 'yellow';
    return 'red';
  }
  return 'green';
}

function formatUptime(seconds) {
  if (!seconds) return '--';
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return d > 0 ? `${d}d ${h}h ${m}m` : h > 0 ? `${h}h ${m}m` : `${m}m`;
}

function normalizeMetrics(raw) {
  if (!raw || raw.cpu_percent === undefined) return null;
  return {
    cpu: Math.round(raw.cpu_percent),
    memory: Math.round(raw.memory_percent),
    uptime: formatUptime(raw.uptime_seconds),
    containers: { running: 1, total: 1 },
  };
}

function normalizeStatus(raw) {
  if (!raw || !raw.checks) return null;
  return {
    services: raw.checks.map((c) => ({
      name: c.name.charAt(0).toUpperCase() + c.name.slice(1),
      status: c.status === 'pass' ? 'healthy' : 'unhealthy',
      latency: c.latency_ms,
    })),
  };
}

function normalizeDeployments(raw, stats) {
  return {
    total: stats?.total || 0,
    successRate: stats?.success_rate || '0.0',
    avgDuration: stats?.avg_duration_ms ? `${Math.round(stats.avg_duration_ms / 1000)}s` : '--',
    recent: (Array.isArray(raw) ? raw : []).map((d, i) => ({
      id: d.id || i,
      commit: (d.commit_sha || '').slice(0, 7) || '--',
      message: d.branch || 'deploy',
      status: d.status,
      time: d.deployed_at ? new Date(d.deployed_at).toLocaleString() : '--',
    })),
  };
}

export default function Dashboard() {
  const { data: metricsRaw, refetch: refetchMetrics } = useApi('/api/metrics');
  const { data: statusRaw, refetch: refetchStatus } = useApi('/api/status');
  const { data: deploymentsRaw, refetch: refetchDeploys } = useApi('/api/deployments');
  const { data: deployStatsRaw, refetch: refetchStats } = useApi('/api/deployments/stats');
  const sectionRef = useRef(null);

  const metrics = normalizeMetrics(metricsRaw) || EMPTY_METRICS;
  const status = normalizeStatus(statusRaw) || EMPTY_STATUS;
  const deployments = normalizeDeployments(deploymentsRaw, deployStatsRaw);

  useEffect(() => {
    const interval = setInterval(() => {
      refetchMetrics();
      refetchStatus();
      refetchDeploys();
      refetchStats();
    }, 5000);

    return () => clearInterval(interval);
  }, [refetchMetrics, refetchStatus, refetchDeploys, refetchStats]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.dashboard__metric-card', {
        opacity: 0,
        y: 30,
        duration: 0.5,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      });

      gsap.from('.dashboard__panel', {
        opacity: 0,
        y: 30,
        duration: 0.6,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.dashboard__body',
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      });

      gsap.from('.dashboard__table-wrapper', {
        opacity: 0,
        y: 30,
        duration: 0.6,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.dashboard__table-wrapper',
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const cpuColor = getMetricColor('cpu', metrics.cpu);
  const memColor = getMetricColor('memory', metrics.memory);
  const containersOk =
    metrics.containers && metrics.containers.running === metrics.containers.total;

  return (
    <section className="dashboard section" id="dashboard" ref={sectionRef}>
      <div className="container">
        <div className="dashboard__header">
          <div className="dashboard__live-badge">
            <span className="dashboard__live-dot" />
            Live Infrastructure
          </div>
          <h2 className="section__title">
            System <span className="gradient-text">Dashboard</span>
          </h2>
          <p className="section__subtitle">
            Real-time metrics from the live infrastructure powering this portfolio.
          </p>
        </div>

        <div className="dashboard__metrics">
          <div className={`dashboard__metric-card dashboard__metric-card--${cpuColor}`}>
            <div className="dashboard__metric-label">CPU Usage</div>
            <div className="dashboard__metric-value">{metrics.cpu}%</div>
            <div className="dashboard__metric-sub">Across all containers</div>
          </div>

          <div className={`dashboard__metric-card dashboard__metric-card--${memColor}`}>
            <div className="dashboard__metric-label">Memory Usage</div>
            <div className="dashboard__metric-value">{metrics.memory}%</div>
            <div className="dashboard__metric-sub">Of allocated resources</div>
          </div>

          <div className="dashboard__metric-card dashboard__metric-card--green">
            <div className="dashboard__metric-label">Uptime</div>
            <div className="dashboard__metric-value">{metrics.uptime}</div>
            <div className="dashboard__metric-sub">Since last deployment</div>
          </div>

          <div
            className={`dashboard__metric-card dashboard__metric-card--${
              containersOk ? 'green' : 'red'
            }`}
          >
            <div className="dashboard__metric-label">Containers</div>
            <div className="dashboard__metric-value">
              {metrics.containers
                ? `${metrics.containers.running}/${metrics.containers.total}`
                : '--'}
            </div>
            <div className="dashboard__metric-sub">Running / Total</div>
          </div>
        </div>

        <div className="dashboard__body">
          <div className="dashboard__panel">
            <h3 className="dashboard__panel-title">Service Health</h3>
            <div className="dashboard__services">
              {(status.services || []).map((svc) => (
                <div className="dashboard__service" key={svc.name}>
                  <span className="dashboard__service-name">
                    <span
                      className={`dashboard__service-dot dashboard__service-dot--${
                        svc.status === 'healthy' ? 'green' : 'red'
                      }`}
                    />
                    {svc.name}
                  </span>
                  <span className="dashboard__service-latency">{svc.latency}ms</span>
                </div>
              ))}
            </div>
          </div>

          <div className="dashboard__panel">
            <h3 className="dashboard__panel-title">Deployment Stats</h3>
            <div className="dashboard__deploy-stats">
              <div className="dashboard__deploy-stat">
                <div className="dashboard__deploy-stat-value">
                  {deployments.total}
                </div>
                <div className="dashboard__deploy-stat-label">Total Deployments</div>
              </div>
              <div className="dashboard__deploy-stat">
                <div className="dashboard__deploy-stat-value">
                  {deployments.successRate}%
                </div>
                <div className="dashboard__deploy-stat-label">Success Rate</div>
              </div>
              <div className="dashboard__deploy-stat">
                <div className="dashboard__deploy-stat-value">
                  {deployments.avgDuration}
                </div>
                <div className="dashboard__deploy-stat-label">Avg Duration</div>
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard__table-wrapper">
          <div className="dashboard__table-header">Recent Deployments</div>
          <table className="dashboard__table">
            <thead>
              <tr>
                <th>Commit</th>
                <th>Message</th>
                <th>Status</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {(deployments.recent || []).length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', color: 'var(--color-text-secondary)', padding: '2rem' }}>
                    No deployments recorded yet — push to main to trigger CI/CD
                  </td>
                </tr>
              ) : (
                (deployments.recent || []).map((dep) => (
                  <tr key={dep.id}>
                    <td>{dep.commit}</td>
                    <td style={{ fontFamily: 'var(--font-sans)' }}>{dep.message}</td>
                    <td>
                      <span
                        className={`dashboard__status-badge dashboard__status-badge--${dep.status}`}
                      >
                        {dep.status}
                      </span>
                    </td>
                    <td>{dep.time}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
