import { useState, useRef, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../styles/Terminal.css';

gsap.registerPlugin(ScrollTrigger);

const WELCOME_LINES = [
  { text: '', type: 'output' },
  { text: '  Welcome to Faisal Khan Afridi\'s DevOps Portfolio Terminal', type: 'cyan' },
  { text: '  Type "help" to see available commands.', type: 'output' },
  { text: '', type: 'output' },
];

const HELP_OUTPUT = [
  { text: '', type: 'output' },
  { text: '  Available Commands:', type: 'bold' },
  { text: '', type: 'output' },
  { text: '  about          Show bio and background', type: 'output' },
  { text: '  skills         List technical skills', type: 'output' },
  { text: '  experience     Show work history', type: 'output' },
  { text: '  certifications List certifications', type: 'output' },
  { text: '  projects       List featured projects', type: 'output' },
  { text: '  contact        Show contact information', type: 'output' },
  { text: '  uptime         Fetch system uptime', type: 'output' },
  { text: '  status         Fetch service status', type: 'output' },
  { text: '  metrics        Fetch system metrics', type: 'output' },
  { text: '  neofetch       Display system info', type: 'output' },
  { text: '  clear          Clear terminal', type: 'output' },
  { text: '  help           Show this message', type: 'output' },
  { text: '', type: 'output' },
];

const ABOUT_OUTPUT = [
  { text: '', type: 'output' },
  { text: '  Faisal Khan Afridi — DevOps & Site Reliability Engineer', type: 'cyan' },
  { text: '', type: 'output' },
  { text: '  Passionate about building resilient, scalable infrastructure.', type: 'output' },
  { text: '  5+ years of experience in cloud platforms, container orchestration,', type: 'output' },
  { text: '  CI/CD automation, and observability. I treat infrastructure as code', type: 'output' },
  { text: '  and reliability as a feature.', type: 'output' },
  { text: '', type: 'output' },
];

const SKILLS_OUTPUT = [
  { text: '', type: 'output' },
  { text: '  Technical Skills:', type: 'bold' },
  { text: '', type: 'output' },
  { text: '  [01] Infrastructure as Code   Terraform, CloudFormation, Pulumi', type: 'success' },
  { text: '  [02] CI/CD & Automation        GitHub Actions, Jenkins, ArgoCD', type: 'success' },
  { text: '  [03] Containers & Orchestration Docker, Kubernetes, ECS', type: 'success' },
  { text: '  [04] Observability             Prometheus, Grafana, ELK', type: 'success' },
  { text: '  [05] Cloud Platforms           AWS, GCP, Azure', type: 'success' },
  { text: '', type: 'output' },
];

const EXPERIENCE_OUTPUT = [
  { text: '', type: 'output' },
  { text: '  Work Experience:', type: 'bold' },
  { text: '', type: 'output' },
  { text: '  > Senior DevOps Engineer — Cloud Corp          2022 - Present', type: 'cyan' },
  { text: '    Led migration to Kubernetes, reduced infra costs by 35%.', type: 'output' },
  { text: '    Built zero-downtime deployment pipelines for 40+ microservices.', type: 'output' },
  { text: '', type: 'output' },
  { text: '  > DevOps Engineer — TechStart Inc              2020 - 2022', type: 'cyan' },
  { text: '    Implemented IaC with Terraform across multi-account AWS setup.', type: 'output' },
  { text: '    Designed observability stack with Prometheus and Grafana.', type: 'output' },
  { text: '', type: 'output' },
  { text: '  > Junior SysAdmin — DataFlow Systems           2018 - 2020', type: 'cyan' },
  { text: '    Automated server provisioning with Ansible.', type: 'output' },
  { text: '    Managed CI/CD pipelines with Jenkins.', type: 'output' },
  { text: '', type: 'output' },
];

const CERTS_OUTPUT = [
  { text: '', type: 'output' },
  { text: '  Certifications:', type: 'bold' },
  { text: '', type: 'output' },
  { text: '  [x] AWS Solutions Architect — Professional', type: 'success' },
  { text: '  [x] Certified Kubernetes Administrator (CKA)', type: 'success' },
  { text: '  [x] HashiCorp Terraform Associate', type: 'success' },
  { text: '  [x] AWS DevOps Engineer — Professional', type: 'success' },
  { text: '', type: 'output' },
];

const PROJECTS_OUTPUT = [
  { text: '', type: 'output' },
  { text: '  Featured Projects:', type: 'bold' },
  { text: '', type: 'output' },
  { text: '  > K8s Auto-Scaler', type: 'cyan' },
  { text: '    Predictive Kubernetes autoscaler using historical traffic data.', type: 'output' },
  { text: '', type: 'output' },
  { text: '  > CI/CD Pipeline Framework', type: 'cyan' },
  { text: '    Reusable GitHub Actions templates with automated rollbacks.', type: 'output' },
  { text: '', type: 'output' },
  { text: '  > Infrastructure Monitoring Suite', type: 'cyan' },
  { text: '    Full-stack observability with Prometheus, Grafana, and Loki.', type: 'output' },
  { text: '', type: 'output' },
  { text: '  > Chaos Engineering Toolkit', type: 'cyan' },
  { text: '    Automated chaos experiments for distributed systems.', type: 'output' },
  { text: '', type: 'output' },
];

const CONTACT_OUTPUT = [
  { text: '', type: 'output' },
  { text: '  Contact Information:', type: 'bold' },
  { text: '', type: 'output' },
  { text: '  Email     khanfluent@outlook.com', type: 'output' },
  { text: '  GitHub    github.com/khan-fluent', type: 'output' },
  { text: '  LinkedIn  linkedin.com/in/faisal-khan-789a05400', type: 'output' },
  { text: '', type: 'output' },
];

const NEOFETCH_ASCII = `    ______      _           __
   / ____/___ _(_)________ _/ /
  / /_  / __ \`/ / ___/ __ \`/ /
 / __/ / /_/ / (__  ) /_/ / /
/_/    \\__,_/_/____/\\__,_/_/   `;

const NEOFETCH_INFO = [
  { label: 'OS', value: 'Ubuntu 22.04 LTS (ECS Optimized)' },
  { label: 'Host', value: 'AWS ECS on EC2' },
  { label: 'Kernel', value: '5.15.0-aws' },
  { label: 'Uptime', value: '14 days, 7 hours' },
  { label: 'Packages', value: '423 (apt)' },
  { label: 'Shell', value: 'bash 5.1.16' },
  { label: 'CPU', value: 'Intel Xeon @ 2.5GHz (2 vCPU)' },
  { label: 'Memory', value: '1.3GiB / 3.8GiB' },
  { label: 'Containers', value: '12 running (Docker 24.0)' },
  { label: 'Stack', value: 'React + Express + PostgreSQL' },
];

export default function Terminal() {
  const [lines, setLines] = useState([...WELCOME_LINES]);
  const [inputValue, setInputValue] = useState('');
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef(null);
  const bodyRef = useRef(null);
  const termRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [lines, scrollToBottom]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(termRef.current, {
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: termRef.current,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      });
    });
    return () => ctx.revert();
  }, []);

  const addLines = (newLines) => {
    setLines((prev) => [...prev, ...newLines]);
  };

  const processCommand = async (cmd) => {
    const trimmed = cmd.trim().toLowerCase();

    addLines([
      { text: `portfolio@sre:~$ ${cmd}`, type: 'input' },
    ]);

    if (!trimmed) return;

    switch (trimmed) {
      case 'help':
        addLines(HELP_OUTPUT);
        break;

      case 'about':
        addLines(ABOUT_OUTPUT);
        break;

      case 'skills':
        addLines(SKILLS_OUTPUT);
        break;

      case 'experience':
        addLines(EXPERIENCE_OUTPUT);
        break;

      case 'certifications':
      case 'certs':
        addLines(CERTS_OUTPUT);
        break;

      case 'projects':
        addLines(PROJECTS_OUTPUT);
        break;

      case 'contact':
        addLines(CONTACT_OUTPUT);
        break;

      case 'clear':
        setLines([]);
        return;

      case 'neofetch': {
        const asciiLines = NEOFETCH_ASCII.split('\n');
        const output = [];
        output.push({ text: '', type: 'output' });
        const maxAsciiLen = Math.max(...asciiLines.map((l) => l.length));
        const totalLines = Math.max(asciiLines.length, NEOFETCH_INFO.length);
        for (let i = 0; i < totalLines; i++) {
          const ascii = (asciiLines[i] || '').padEnd(maxAsciiLen + 4);
          const info = NEOFETCH_INFO[i];
          const infoStr = info ? `${info.label}: ${info.value}` : '';
          output.push({
            text: `  ${ascii}${infoStr}`,
            type: i < asciiLines.length ? 'cyan' : 'output',
          });
        }
        output.push({ text: '', type: 'output' });
        addLines(output);
        break;
      }

      case 'uptime': {
        addLines([{ text: '  Fetching uptime...', type: 'output' }]);
        try {
          const res = await fetch('/api/health');
          const data = await res.json();
          addLines([
            { text: '', type: 'output' },
            { text: `  Status: ${data.status || 'ok'}`, type: 'success' },
            { text: `  Uptime: ${data.uptime || 'N/A'}`, type: 'success' },
            { text: '', type: 'output' },
          ]);
        } catch {
          addLines([
            { text: '  Error: Could not reach /api/health', type: 'error' },
            { text: '', type: 'output' },
          ]);
        }
        break;
      }

      case 'status': {
        addLines([{ text: '  Fetching status...', type: 'output' }]);
        try {
          const res = await fetch('/api/status');
          const data = await res.json();
          const output = [{ text: '', type: 'output' }];
          (data.services || []).forEach((svc) => {
            const icon = svc.status === 'healthy' ? '[OK]' : '[!!]';
            const type = svc.status === 'healthy' ? 'success' : 'error';
            output.push({
              text: `  ${icon} ${svc.name.padEnd(12)} ${svc.latency}ms`,
              type,
            });
          });
          output.push({ text: '', type: 'output' });
          addLines(output);
        } catch {
          addLines([
            { text: '  Error: Could not reach /api/status', type: 'error' },
            { text: '', type: 'output' },
          ]);
        }
        break;
      }

      case 'metrics': {
        addLines([{ text: '  Fetching metrics...', type: 'output' }]);
        try {
          const res = await fetch('/api/metrics');
          const data = await res.json();
          addLines([
            { text: '', type: 'output' },
            { text: `  CPU:        ${data.cpu}%`, type: data.cpu < 80 ? 'success' : 'error' },
            { text: `  Memory:     ${data.memory}%`, type: data.memory < 80 ? 'success' : 'error' },
            { text: `  Uptime:     ${data.uptime}`, type: 'success' },
            {
              text: `  Containers: ${data.containers?.running || 0}/${data.containers?.total || 0}`,
              type: 'success',
            },
            { text: '', type: 'output' },
          ]);
        } catch {
          addLines([
            { text: '  Error: Could not reach /api/metrics', type: 'error' },
            { text: '', type: 'output' },
          ]);
        }
        break;
      }

      default:
        addLines([
          {
            text: `  bash: ${trimmed}: command not found. Type "help" for available commands.`,
            type: 'error',
          },
          { text: '', type: 'output' },
        ]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      const cmd = inputValue;
      processCommand(cmd);
      if (cmd.trim()) {
        setHistory((prev) => [...prev, cmd]);
      }
      setHistoryIndex(-1);
      setInputValue('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length === 0) return;
      const newIndex =
        historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(newIndex);
      setInputValue(history[newIndex]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex === -1) return;
      const newIndex = historyIndex + 1;
      if (newIndex >= history.length) {
        setHistoryIndex(-1);
        setInputValue('');
      } else {
        setHistoryIndex(newIndex);
        setInputValue(history[newIndex]);
      }
    }
  };

  const focusInput = () => {
    if (inputRef.current) inputRef.current.focus();
  };

  const getLineClass = (type) => {
    const map = {
      input: 'terminal__line--input',
      output: 'terminal__line--output',
      success: 'terminal__line--success',
      error: 'terminal__line--error',
      cyan: 'terminal__line--cyan',
      bold: 'terminal__line--bold',
    };
    return map[type] || 'terminal__line--output';
  };

  return (
    <section className="terminal-section section" id="terminal">
      <div className="container">
        <div className="terminal-section__header">
          <p className="section__label">Interactive</p>
          <h2 className="section__title">
            <span className="gradient-text">Terminal</span>
          </h2>
          <p className="section__subtitle">
            Explore my portfolio through a command-line interface. Type "help" to get started.
          </p>
        </div>

        <div className="terminal" ref={termRef} onClick={focusInput}>
          <div className="terminal__titlebar">
            <span className="terminal__dot terminal__dot--red" />
            <span className="terminal__dot terminal__dot--yellow" />
            <span className="terminal__dot terminal__dot--green" />
            <span className="terminal__titlebar-text">portfolio@sre:~$</span>
          </div>

          <div className="terminal__body" ref={bodyRef}>
            {lines.map((line, i) => (
              <div key={i} className={`terminal__line ${getLineClass(line.type)}`}>
                {line.text}
              </div>
            ))}

            <div className="terminal__input-line">
              <span className="terminal__input-prefix">
                <span className="terminal__prompt-symbol">portfolio@sre</span>
                <span className="terminal__prompt-path">:~$ </span>
              </span>
              <input
                ref={inputRef}
                className="terminal__input"
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="type a command..."
                autoComplete="off"
                spellCheck="false"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
