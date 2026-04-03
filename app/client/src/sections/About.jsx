import useScrollAnimation from '../hooks/useScrollAnimation';
import '../styles/About.css';

const HIGHLIGHTS = [
  { number: '10+', label: 'Years Experience' },
  { number: '1000+', label: 'Projects Delivered' },
  { number: 'Full', label: 'Stack SDLC' },
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
              <span className="about__photo-placeholder">FK</span>
            </div>
            <div className="about__photo-accent" />
          </div>

          <div className="about__text">
            <p className="section__label">About</p>
            <h2>
              Faisal Khan Afridi{' '}
            </h2>
            <p className="about__bio">
              CEO and engineering generalist operating at the intersection of
              infrastructure, automation, and software delivery. Faisal brings over a
              decade of experience architecting systems across the full stack&mdash;frontend,
              backend, databases, cloud, and the complete SDLC&mdash;with a{' '}
              <strong>deep specialization in DevOps and Site Reliability Engineering</strong>.
            </p>
            <p className="about__bio">
              Known for designing infrastructure that scales effortlessly under pressure,
              Faisal engineers platforms where reliability is a first-class feature, not an
              afterthought. From zero-downtime deployment pipelines spanning thousands of
              microservices to observability frameworks that surface anomalies before they
              become incidents&mdash;the work is defined by{' '}
              <strong>automation at every layer</strong> and an uncompromising standard for
              operational excellence.
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
