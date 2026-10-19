import React from 'react';

export default function About() {
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
    <section id="about" className="about-section">
      <div className="section-head reveal visible">
        <div className="section-kicker">01 / ABOUT ME</div>
        <h2>
          Curiosity meets<br />
          <em>thoughtful code</em>
        </h2>
      </div>

      <div className="about-grid">
        <div
          className="about-card tilt-card reveal visible"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <span className="about-num">01</span>
          <h3>Creative Mindset</h3>
          <p>I build web interfaces where visual charm and technical precision coexist naturally.</p>
        </div>

        <div
          className="about-card tilt-card reveal visible"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <span className="about-num">02</span>
          <h3>B.Tech Academic Journey</h3>
          <p>Pursuing Computer Science &amp; Engineering at Narasaraopeta Engineering College.</p>
        </div>

        <div
          className="about-card tilt-card reveal visible"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <span className="about-num">03</span>
          <h3>Modern Frontend Stack</h3>
          <p>Hands-on work across JavaScript, React, TypeScript, responsive layouts, and animations.</p>
        </div>
      </div>
    </section>
  );
}
