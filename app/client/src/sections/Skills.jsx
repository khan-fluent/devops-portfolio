import useScrollAnimation from '../hooks/useScrollAnimation';
import '../styles/Skills.css';

const SKILLS = [
  {
    number: '01',
    title: 'Infrastructure as Code',
    tags: ['Terraform', 'OpenTofu', 'CloudFormation', 'Pulumi', 'Ansible', 'Chef', 'Puppet'],
  },
  {
    number: '02',
    title: 'CI/CD & Automation',
    tags: ['GitHub Actions', 'Jenkins', 'ArgoCD', 'Azure DevOps', 'GitLab Pipelines', 'Bitbucket Pipelines', 'Bamboo', 'Airflow'],
  },
  {
    number: '03',
    title: 'Containers & Orchestration',
    tags: ['Docker', 'Kubernetes', 'ECS', 'Nomad', 'OpenShift', 'Helm'],
  },
  {
    number: '04',
    title: 'Observability & Monitoring',
    tags: ['Prometheus', 'Grafana', 'Datadog', 'New Relic', 'CloudWatch', 'ELK', 'Loki', 'PagerDuty', 'Jaeger'],
  },
  {
    number: '05',
    title: 'Cloud Platforms',
    tags: ['AWS', 'GCP', 'Azure', 'DigitalOcean', 'Cloudflare'],
  },
  {
    number: '06',
    title: 'Databases',
    tags: ['PostgreSQL', 'MySQL', 'Microsoft SQL Server', 'MongoDB', 'Redis', 'DynamoDB', 'ElastiCache'],
  },
];

export default function Skills() {
  const headerRef = useScrollAnimation('fadeUp');
  const listRef = useScrollAnimation('stagger', {
    target: '.skills__item',
    stagger: 0.1,
    duration: 0.5,
  });

  return (
    <section className="skills section" id="skills">
      <div className="container">
        <div className="skills__header" ref={headerRef}>
          <p className="section__label">Expertise</p>
          <h2 className="section__title">
            Core <span className="gradient-text">Skill Areas</span>
          </h2>
        </div>

        <div className="skills__grid" ref={listRef}>
          {SKILLS.map((skill) => (
            <div className="skills__item" key={skill.number}>
              <div className="skills__item-header">
                <span className="skills__number">{skill.number}</span>
                <h3 className="skills__title">{skill.title}</h3>
              </div>
              <div className="skills__tags">
                {skill.tags.map((tag) => (
                  <span className="skills__tag" key={tag}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
