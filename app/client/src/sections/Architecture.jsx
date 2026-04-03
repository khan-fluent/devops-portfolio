import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../styles/Architecture.css';

gsap.registerPlugin(ScrollTrigger);

const NODES = [
  { id: 'github', label: 'GitHub', sub: 'Source Control', x: 80, y: 140, icon: '\u2B22' },
  { id: 'actions', label: 'GitHub Actions', sub: 'CI/CD Pipeline', x: 270, y: 140, icon: '\u26A1' },
  { id: 'ecr', label: 'ECR', sub: 'Container Registry', x: 460, y: 140, icon: '\uD83D\uDCE6' },
  { id: 'ecs', label: 'ECS (EC2)', sub: 'Container Orchestration', x: 650, y: 140, icon: '\u2699\uFE0F' },
  { id: 'rds', label: 'RDS', sub: 'PostgreSQL', x: 840, y: 140, icon: '\uD83D\uDDC4\uFE0F' },
];

const CONNECTIONS = [
  { from: 'github', to: 'actions' },
  { from: 'actions', to: 'ecr' },
  { from: 'ecr', to: 'ecs' },
  { from: 'ecs', to: 'rds' },
];

const NODE_WIDTH = 140;
const NODE_HEIGHT = 80;

export default function Architecture() {
  const sectionRef = useRef(null);
  const svgRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const nodes = svgRef.current.querySelectorAll('.architecture__node');
      const connections = svgRef.current.querySelectorAll('.architecture__connection');
      const dots = svgRef.current.querySelectorAll('.architecture__flow-dot');

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
      });

      tl.from(nodes, {
        opacity: 0,
        scale: 0.8,
        duration: 0.5,
        stagger: 0.15,
        ease: 'back.out(1.4)',
      })
        .from(
          connections,
          {
            strokeDashoffset: 200,
            opacity: 0,
            duration: 0.6,
            stagger: 0.12,
            ease: 'power2.out',
          },
          '-=0.5'
        )
        .from(
          dots,
          {
            opacity: 0,
            duration: 0.3,
          },
          '-=0.2'
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const getNodeCenter = (id) => {
    const node = NODES.find((n) => n.id === id);
    return { x: node.x + NODE_WIDTH / 2, y: node.y + NODE_HEIGHT / 2 };
  };

  return (
    <section className="architecture section" id="architecture" ref={sectionRef}>
      <div className="container">
        <div className="architecture__header">
          <p className="section__label">Infrastructure</p>
          <h2 className="section__title">
            System <span className="gradient-text">Architecture</span>
          </h2>
          <p className="section__subtitle">
            The actual deployment pipeline and infrastructure powering this portfolio.
          </p>
        </div>

        <div className="architecture__diagram">
          <svg
            ref={svgRef}
            className="architecture__svg"
            viewBox="0 0 960 280"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <marker
                id="arrowhead"
                markerWidth="8"
                markerHeight="6"
                refX="8"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 8 3, 0 6" className="architecture__arrow" />
              </marker>
            </defs>

            {CONNECTIONS.map((conn, i) => {
              const from = getNodeCenter(conn.from);
              const to = getNodeCenter(conn.to);
              const startX = from.x + NODE_WIDTH / 2;
              const endX = to.x - NODE_WIDTH / 2;
              const y = from.y;

              return (
                <g key={`conn-${i}`}>
                  <line
                    className="architecture__connection"
                    x1={startX}
                    y1={y}
                    x2={endX}
                    y2={y}
                    markerEnd="url(#arrowhead)"
                  />
                  <circle
                    className={`architecture__flow-dot ${
                      i % 2 === 0 ? '' : 'architecture__flow-dot--alt'
                    }`}
                    r="3"
                  >
                    <animateMotion
                      dur={`${2 + i * 0.3}s`}
                      repeatCount="indefinite"
                      path={`M${startX},${y} L${endX},${y}`}
                      keyTimes="0;1"
                      calcMode="linear"
                    />
                    <animate
                      attributeName="opacity"
                      values="0;1;1;0"
                      keyTimes="0;0.1;0.9;1"
                      dur={`${2 + i * 0.3}s`}
                      repeatCount="indefinite"
                    />
                  </circle>
                </g>
              );
            })}

            {NODES.map((node) => (
              <g
                key={node.id}
                className="architecture__node"
                transform={`translate(${node.x}, ${node.y})`}
              >
                <rect
                  className="architecture__node-box"
                  width={NODE_WIDTH}
                  height={NODE_HEIGHT}
                  rx="8"
                  ry="8"
                />
                <text className="architecture__node-icon" x={NODE_WIDTH / 2} y={22}>
                  {node.icon}
                </text>
                <text className="architecture__node-label" x={NODE_WIDTH / 2} y={46}>
                  {node.label}
                </text>
                <text className="architecture__node-sublabel" x={NODE_WIDTH / 2} y={64}>
                  {node.sub}
                </text>
              </g>
            ))}
          </svg>
        </div>

        <div className="architecture__legend">
          <div className="architecture__legend-item">
            <span className="architecture__legend-dot architecture__legend-dot--primary" />
            Data flow
          </div>
          <div className="architecture__legend-item">
            <span className="architecture__legend-dot architecture__legend-dot--secondary" />
            Async process
          </div>
          <div className="architecture__legend-item">
            <span className="architecture__legend-line" />
            Connection
          </div>
        </div>
      </div>
    </section>
  );
}
