import React, { useState } from 'react';

const GITHUB_PROFILE = 'https://github.com/amruthadivvela-droid';

const PROJECTS = [
  {
    id: 'attendance',
    title: 'Smart Classroom Attendance',
    eyebrow: '01 • ACADEMIC SYSTEM',
    category: 'systems',
    filterCategory: 'fullstack',
    featured: true,
    desc: 'Interactive web application engineered for department faculty with automated percentage analytics and CSV reporting.',
    techs: ['JavaScript', 'CSV Engine'],
    github: GITHUB_PROFILE,
    live: null,
    artType: 'attendance',
    artLabel: 'real-time analytics ♡'
  },
  {
    id: 'prompt-tech',
    title: 'Prompt Tech',
    eyebrow: '02 • WEB APPLICATION',
    category: 'web',
    filterCategory: 'webapp',
    featured: false,
    desc: 'A smart prompt generation and technical utility platform designed to streamline AI prompting workflows.',
    techs: ['React', 'TypeScript'],
    github: 'https://github.com/amruthadivvela-droid/prompt-tech',
    live: 'https://prompt-tech-chi.vercel.app',
    artType: 'prompt-tech',
    artLabel: 'ai assistant ♡'
  },
  {
    id: 'watch',
    title: 'Watch',
    eyebrow: '03 • INTERACTIVE WEB EXPERIMENT',
    category: 'web',
    filterCategory: 'frontend',
    featured: false,
    desc: 'A TypeScript frontend experiment exploring interactive frame components and dynamic dials.',
    techs: ['TypeScript', 'CSS Animations'],
    github: 'https://github.com/amruthadivvela-droid/watch',
    live: 'https://watch-rosy-mu.vercel.app',
    artType: 'watch',
    artLabel: '⌚'
  }
];

export default function WorkProjects() {
  const [activeFilter, setActiveFilter] = useState('all');

  const handleMouseMove = (e) => {
    if (window.innerWidth < 768 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
    const rotX = (-(y - rect.height / 2) / rect.height * 9).toFixed(2);
    const rotY = ((x - rect.width / 2) / rect.width * 9).toFixed(2);
    card.style.transform = `perspective(850px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-6px) scale3d(1.02, 1.02, 1.02)`;
  };

  const handleMouseLeave = (e) => {
    e.currentTarget.style.transform = '';
  };

  const filteredProjects = PROJECTS.filter((p) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'webapp' && p.filterCategory === 'webapp') return true;
    if (activeFilter === 'frontend' && (p.filterCategory === 'frontend' || p.filterCategory === 'webapp')) return true;
    if (activeFilter === 'fullstack' && p.filterCategory === 'fullstack') return true;
    return false;
  });

  return (
    <section id="work" className="work-section">
      <div className="section-head reveal visible">
        <div className="section-kicker">03 / SELECTED WORK</div>
        <h2>
          Ideas brought to life<br />
          <em>on the screen</em>
        </h2>
      </div>

      <div className="filter-row">
        {[
          { id: 'all', label: 'All Projects' },
          { id: 'webapp', label: 'Web Apps' },
          { id: 'frontend', label: 'Frontend' },
          { id: 'fullstack', label: 'Full Stack' }
        ].map((f) => (
          <button
            key={f.id}
            type="button"
            className={`filter-btn ${activeFilter === f.id ? 'active' : ''}`}
            onClick={() => setActiveFilter(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="projects-grid">
        {filteredProjects.map((p) => (
          <article
            key={p.id}
            className={`project-card ${p.featured ? 'featured-project-card' : ''} tilt-card reveal visible`}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <div className={`project-art art-${p.artType}`}>
              {p.artType === 'watch' ? (
                <div
                  style={{
                    width: 130,
                    height: 130,
                    borderRadius: 36,
                    background: 'linear-gradient(135deg, #7868a3, #b3a6df)',
                    display: 'grid',
                    placeItems: 'center',
                    color: '#fff',
                    fontSize: 36
                  }}
                >
                  ⌚
                </div>
              ) : (
                <div
                  style={{
                    background: 'var(--surface)',
                    borderRadius: '18px',
                    padding: '24px 28px',
                    width: '82%',
                    boxShadow: '0 12px 30px rgba(0,0,0,0.06)'
                  }}
                >
                  <div style={{ fontFamily: 'var(--font-hand)', fontSize: 20, color: 'var(--accent)' }}>
                    {p.artLabel}
                  </div>
                  <div style={{ fontWeight: 800, fontSize: 22, color: 'var(--ink)' }}>
                    {p.title}
                  </div>
                </div>
              )}
            </div>

            <div className="project-content">
              <div className="project-eyebrow">{p.eyebrow}</div>
              <div className="project-title-row">
                <h3>{p.title}</h3>
                <a
                  className="project-arrow"
                  target="_blank"
                  rel="noopener noreferrer"
                  href={p.github}
                  aria-label={`Open ${p.title} GitHub repository`}
                >
                  ↗
                </a>
              </div>
              <p>{p.desc}</p>
              <div className="project-bottom">
                <div className="chip-row">
                  {p.techs.map((t) => (
                    <span key={t} className="tech-chip">
                      {t}
                    </span>
                  ))}
                </div>
                {p.live && (
                  <a
                    className="btn-live-glow"
                    href={p.live}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span>Live Demo</span> <span className="arrow-icon">↗</span>
                  </a>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
