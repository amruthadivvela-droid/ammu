import React from 'react';

export default function Education() {
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

  return (
    <section id="education" className="education-section">
      <div className="section-head reveal visible">
        <div className="section-kicker">02 / EDUCATION</div>
        <h2>
          Academic<br />
          <em>milestones</em>
        </h2>
      </div>

      <div className="education-timeline">
        <div
          className="edu-card tilt-card reveal visible"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <div className="edu-period">2022 — 2026</div>
          <h3>B.Tech in Computer Science &amp; Engineering</h3>
          <p className="edu-inst">Narasaraopeta Engineering College</p>
        </div>

        <div
          className="edu-card tilt-card reveal visible"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <div className="edu-period">2020 — 2022</div>
          <h3>Intermediate (Class XII) &bull; 96.3%</h3>
          <p className="edu-inst">Sri Chaitanya Junior College</p>
        </div>
      </div>
    </section>
  );
}
