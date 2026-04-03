import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import '../styles/Hero.css';

const COMMANDS = [
  'terraform apply',
  'kubectl deploy',
  'docker build',
  'ansible-playbook',
  'helm upgrade',
];

const STATS = [
  { value: '99.9%', label: 'Uptime' },
  { value: '500+', label: 'Deployments' },
  { value: '< 5min', label: 'MTTR' },
];

export default function Hero() {
  const [displayText, setDisplayText] = useState('');
  const commandIndex = useRef(0);
  const charIndex = useRef(0);
  const deleting = useRef(false);
  const contentRef = useRef(null);

  useEffect(() => {
    const type = () => {
      const currentCmd = COMMANDS[commandIndex.current];

      if (!deleting.current) {
        charIndex.current++;
        setDisplayText(currentCmd.slice(0, charIndex.current));

        if (charIndex.current === currentCmd.length) {
          deleting.current = true;
          return setTimeout(type, 2000);
        }
        return setTimeout(type, 80);
      } else {
        charIndex.current--;
        setDisplayText(currentCmd.slice(0, charIndex.current));

        if (charIndex.current === 0) {
          deleting.current = false;
          commandIndex.current = (commandIndex.current + 1) % COMMANDS.length;
          return setTimeout(type, 400);
        }
        return setTimeout(type, 40);
      }
    };

    const timeoutId = setTimeout(type, 1000);
    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.from('.hero__label', { opacity: 0, y: 30, duration: 0.6 })
        .from('.hero__title', { opacity: 0, y: 40, duration: 0.8 }, '-=0.3')
        .from('.hero__subtitle', { opacity: 0, y: 30, duration: 0.6 }, '-=0.4')
        .from('.hero__terminal', { opacity: 0, y: 20, duration: 0.5 }, '-=0.3')
        .from('.hero__ctas', { opacity: 0, y: 20, duration: 0.5 }, '-=0.2')
        .from('.hero__stat', {
          opacity: 0,
          y: 30,
          duration: 0.5,
          stagger: 0.1,
        }, '-=0.3');
    }, contentRef);

    return () => ctx.revert();
  }, []);

  const handleScrollTo = (e, id) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="hero" id="hero">
      <div className="hero__grid" />
      <div className="hero__glow" />

      <div className="hero__content" ref={contentRef}>
        <span className="hero__label">SRE &amp; DevOps Engineer</span>

        <h1 className="hero__title">
          <span className="hero__title-gradient">DevOps Engineer</span>
        </h1>

        <p className="hero__subtitle">
          Building resilient infrastructure at scale
        </p>

        <div className="hero__terminal">
          <span className="hero__terminal-prompt">$</span>
          <span className="hero__terminal-text">{displayText}</span>
          <span className="hero__terminal-cursor" />
        </div>

        <div className="hero__ctas">
          <a
            href="#projects"
            className="hero__cta hero__cta--primary"
            onClick={(e) => handleScrollTo(e, 'projects')}
          >
            View Projects
          </a>
          <a
            href="#dashboard"
            className="hero__cta hero__cta--secondary"
            onClick={(e) => handleScrollTo(e, 'dashboard')}
          >
            Live Dashboard
          </a>
        </div>

        <div className="hero__stats">
          {STATS.map((stat) => (
            <div className="hero__stat" key={stat.label}>
              <span className="hero__stat-value">{stat.value}</span>
              <span className="hero__stat-label">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
