import useScrollAnimation from '../hooks/useScrollAnimation';
import '../styles/Skills.css';

const SKILLS = [
  {
    number: '01',
    title: 'Infrastructure as Code',
    description:
      'Designing, provisioning, and managing cloud infrastructure through declarative configuration. Version-controlled infrastructure ensures reproducibility, auditability, and rapid disaster recovery across environments.',
    tags: ['Terraform', 'CloudFormation', 'Pulumi'],
  },
  {
    number: '02',
    title: 'CI/CD & Automation',
    description:
      'Building end-to-end delivery pipelines that take code from commit to production with confidence. Automated testing, security scanning, and progressive rollouts reduce risk and accelerate shipping velocity.',
    tags: ['GitHub Actions', 'Jenkins', 'ArgoCD'],
  },
  {
    number: '03',
    title: 'Containers & Orchestration',
    description:
      'Packaging applications into portable containers and orchestrating them at scale. From local development environments to production clusters, containerization provides consistency and efficient resource utilization.',
    tags: ['Docker', 'Kubernetes', 'ECS'],
  },
  {
    number: '04',
    title: 'Observability & Monitoring',
    description:
      'Implementing comprehensive observability across metrics, logs, and traces. Proactive alerting and rich dashboards enable rapid incident response and data-driven capacity planning.',
    tags: ['Prometheus', 'Grafana', 'CloudWatch', 'ELK'],
  },
  {
    number: '05',
    title: 'Cloud Platforms',
    description:
      'Architecting multi-cloud and hybrid solutions that leverage the best services from each provider. Deep expertise in networking, security, and cost optimization across major cloud platforms.',
    tags: ['AWS', 'GCP', 'Azure'],
  },
];

export default function Skills() {
  const headerRef = useScrollAnimation('fadeUp');
  const listRef = useScrollAnimation('stagger', {
    target: '.skills__item',
    stagger: 0.15,
    duration: 0.7,
  });

  return (
    <section className="skills section" id="skills">
      <div className="container">
        <div className="skills__header" ref={headerRef}>
          <p className="section__label">Expertise</p>
          <h2 className="section__title">
            Core <span className="gradient-text">Skill Areas</span>
          </h2>
          <p className="section__subtitle">
            Deep technical expertise across the full DevOps and SRE spectrum.
          </p>
        </div>

        <div className="skills__list" ref={listRef}>
          {SKILLS.map((skill) => (
            <div className="skills__item" key={skill.number}>
              <span className="skills__number">{skill.number}</span>
              <div className="skills__body">
                <h3 className="skills__title">{skill.title}</h3>
                <p className="skills__description">{skill.description}</p>
                <div className="skills__tags">
                  {skill.tags.map((tag) => (
                    <span className="skills__tag" key={tag}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
