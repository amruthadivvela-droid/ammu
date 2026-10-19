import React from 'react';

const SKILLS = [
  'React',
  'JavaScript (ES6+)',
  'TypeScript',
  'HTML5 & CSS3',
  'Tailwind CSS',
  'Git & GitHub',
  'REST APIs',
  'Vite',
  'Responsive Design',
  'UI/UX Design'
];

export default function SkillsCollaboration() {
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

  const handleMagneticMove = (e) => {
    if (window.innerWidth < 768 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    el.style.transform = `translate(${x * 0.22}px, ${y * 0.22}px) scale(1.03)`;
  };

  const handleMagneticLeave = (e) => {
    e.currentTarget.style.transform = '';
  };

  return (
    <section id="skills" className="skills-section">
      <div className="section-head reveal visible">
        <div className="section-kicker">04 / TOOLBOX</div>
        <h2>
          Technologies I work with<br />
          <em>every day</em>
        </h2>
      </div>

      <div className="skills-cloud reveal visible">
        {SKILLS.map((skill) => (
          <span
            key={skill}
            className="skill-pill magnetic-btn"
            onMouseMove={handleMagneticMove}
            onMouseLeave={handleMagneticLeave}
          >
            <span>✿</span> {skill}
          </span>
        ))}
      </div>

      <div className="strengths-grid" style={{ marginTop: '48px' }}>
        <div
          className="strength-card tilt-card reveal visible"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <div className="strength-icon">💡</div>
          <h4>Problem Solving</h4>
          <p>
            Approaches UI challenges methodically, breaking complex layouts into modular and maintainable components.
          </p>
        </div>

        <div
          className="strength-card tilt-card reveal visible"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <div className="strength-icon">⏱</div>
          <h4>Reliability &amp; Focus</h4>
          <p>
            Committed to meeting academic milestones and delivering tidy, well-tested code that teammates can rely on.
          </p>
        </div>

        <div
          className="strength-card tilt-card reveal visible"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <div className="strength-icon">💬</div>
          <h4>Thoughtful Communication</h4>
          <p>
            Explains technical decisions clearly and communicates progress openly throughout every project phase.
          </p>
        </div>
      </div>
    </section>
  );
}
