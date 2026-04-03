import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import '../styles/Hero.css';

const ROTATING_WORDS = [
  'Scaling',
  'Automating',
  'Deploying',
  'Securing',
  'Optimizing',
  'Monitoring',
  'Orchestrating',
  'Networking',
  'Developing',
  'Architecting',
];

const COMMANDS = [
  'terraform apply',
  'kubectl deploy',
  'docker build',
  'ansible-playbook',
  'helm upgrade',
];

const STATS = [
  { value: '99.9%', label: 'Uptime' },
  { value: '1000+', label: 'Projects' },
  { value: '< 5min', label: 'MTTR' },
];

export default function Hero() {
  const [word, setWord] = useState('');
  const [cmdText, setCmdText] = useState('');
  const wordIdx = useRef(0);
  const wordCharIdx = useRef(0);
  const wordDeleting = useRef(false);
  const cmdIdx = useRef(0);
  const cmdCharIdx = useRef(0);
  const cmdDeleting = useRef(false);
  const contentRef = useRef(null);

  // Rotating headline word
  useEffect(() => {
    const type = () => {
      const current = ROTATING_WORDS[wordIdx.current];

      if (!wordDeleting.current) {
        wordCharIdx.current++;
        setWord(current.slice(0, wordCharIdx.current));

        if (wordCharIdx.current === current.length) {
          wordDeleting.current = true;
          return setTimeout(type, 2200);
        }
        return setTimeout(type, 70);
      } else {
        wordCharIdx.current--;
        setWord(current.slice(0, wordCharIdx.current));

        if (wordCharIdx.current === 0) {
          wordDeleting.current = false;
          wordIdx.current = (wordIdx.current + 1) % ROTATING_WORDS.length;
          return setTimeout(type, 300);
        }
        return setTimeout(type, 35);
      }
    };

    const id = setTimeout(type, 800);
    return () => clearTimeout(id);
  }, []);

  // Terminal command typing
  useEffect(() => {
    const type = () => {
      const current = COMMANDS[cmdIdx.current];

      if (!cmdDeleting.current) {
        cmdCharIdx.current++;
        setCmdText(current.slice(0, cmdCharIdx.current));

        if (cmdCharIdx.current === current.length) {
          cmdDeleting.current = true;
          return setTimeout(type, 2000);
        }
        return setTimeout(type, 80);
      } else {
        cmdCharIdx.current--;
        setCmdText(current.slice(0, cmdCharIdx.current));

        if (cmdCharIdx.current === 0) {
          cmdDeleting.current = false;
          cmdIdx.current = (cmdIdx.current + 1) % COMMANDS.length;
          return setTimeout(type, 400);
        }
        return setTimeout(type, 40);
      }
    };

    const id = setTimeout(type, 1500);
    return () => clearTimeout(id);
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
        <span className="hero__label">Engineering as a Service</span>

        <h1 className="hero__title">
          Need help{' '}
          <span className="hero__title-gradient">{word}</span>
          <span className="hero__title-cursor">|</span>
        </h1>

        <p className="hero__subtitle">
          Full-stack engineering, DevOps, and SRE — from architecture to production.
        </p>

        <div className="hero__terminal">
          <span className="hero__terminal-prompt">$</span>
          <span className="hero__terminal-text">{cmdText}</span>
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
