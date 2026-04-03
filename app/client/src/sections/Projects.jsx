import useScrollAnimation from '../hooks/useScrollAnimation';
import '../styles/Projects.css';

const PROJECTS = [
  {
    icon: '\u2699\uFE0F',
    title: 'K8s Auto-Scaler',
    description:
      'Custom Kubernetes autoscaler that uses predictive scaling based on historical traffic patterns. Reduces over-provisioning by 40% while maintaining response time SLAs during traffic spikes.',
    tags: ['Kubernetes', 'Go', 'Prometheus', 'HPA'],
    link: 'https://github.com',
  },
  {
    icon: '\uD83D\uDE80',
    title: 'CI/CD Pipeline Framework',
    description:
      'Reusable GitHub Actions workflow templates for microservice deployments. Includes automated testing, container scanning, staged rollouts, and automatic rollback on failure detection.',
    tags: ['GitHub Actions', 'Docker', 'ArgoCD', 'Helm'],
    link: 'https://github.com',
  },
  {
    icon: '\uD83D\uDCCA',
    title: 'Infrastructure Monitoring Suite',
    description:
      'Full-stack observability platform combining metrics, logs, and traces. Custom Grafana dashboards with intelligent alerting that reduced mean time to detection by 70%.',
    tags: ['Prometheus', 'Grafana', 'Loki', 'Terraform'],
    link: 'https://github.com',
  },
  {
    icon: '\uD83D\uDD25',
    title: 'Chaos Engineering Toolkit',
    description:
      'Automated chaos experiments for distributed systems. Injects failures at network, pod, and node level to validate resilience. Generates detailed reports with remediation suggestions.',
    tags: ['Litmus', 'Python', 'Kubernetes', 'AWS'],
    link: 'https://github.com',
  },
];

export default function Projects() {
  const headerRef = useScrollAnimation('fadeUp');
  const gridRef = useScrollAnimation('stagger', {
    target: '.projects__card',
    stagger: 0.12,
    duration: 0.6,
  });

  return (
    <section className="projects section" id="projects">
      <div className="container">
        <div className="projects__header" ref={headerRef}>
          <p className="section__label">Portfolio</p>
          <h2 className="section__title">
            Featured <span className="gradient-text">Projects</span>
          </h2>
          <p className="section__subtitle">
            Open-source tools and infrastructure projects that solve real problems.
          </p>
        </div>

        <div className="projects__grid" ref={gridRef}>
          {PROJECTS.map((project) => (
            <article className="projects__card" key={project.title}>
              <div className="projects__card-icon">{project.icon}</div>
              <h3 className="projects__card-title">{project.title}</h3>
              <p className="projects__card-description">{project.description}</p>
              <div className="projects__card-tags">
                {project.tags.map((tag) => (
                  <span className="projects__card-tag" key={tag}>
                    {tag}
                  </span>
                ))}
              </div>
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="projects__card-link"
              >
                View Project
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
