import useScrollAnimation from '../hooks/useScrollAnimation';
import '../styles/About.css';

const HIGHLIGHTS = [
  { number: '5+', label: 'Years Experience' },
  { number: '4', label: 'Certifications' },
  { number: '30+', label: 'Projects Delivered' },
];

export default function About() {
  const sectionRef = useScrollAnimation('fadeUp', { duration: 0.8 });
  const highlightsRef = useScrollAnimation('stagger', {
    target: '.about__highlight',
    stagger: 0.15,
  });

  return (
    <section className="about section" id="about">
      <div className="container">
        <div className="about__grid" ref={sectionRef}>
          <div className="about__photo-wrapper">
            <div className="about__photo">
              <span className="about__photo-placeholder">F</span>
            </div>
            <div className="about__photo-accent" />
          </div>

          <div className="about__text">
            <p className="section__label">About Me</p>
            <h2>
              Passionate about building{' '}
              <span className="gradient-text">reliable systems</span>
            </h2>
            <p className="about__bio">
              I am a <strong>DevOps and Site Reliability Engineer</strong> with a deep
              commitment to building infrastructure that scales. My expertise spans
              cloud platforms, container orchestration, CI/CD pipelines, and
              observability systems. I believe that <strong>great infrastructure is invisible</strong>
              &mdash; when everything works seamlessly, engineers can focus on shipping
              features and users enjoy a flawless experience. From automating
              deployments with Terraform and Kubernetes to designing monitoring
              dashboards that catch issues before they impact users, I treat
              infrastructure as a craft.
            </p>

            <div className="about__highlights" ref={highlightsRef}>
              {HIGHLIGHTS.map((item) => (
                <div className="about__highlight" key={item.label}>
                  <span className="about__highlight-number">{item.number}</span>
                  <span className="about__highlight-label">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
