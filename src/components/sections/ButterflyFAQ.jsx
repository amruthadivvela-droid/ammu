import React, { useState, useRef, useEffect } from 'react';

const FAQ_DATA = [
  {
    category: 'Leadership & CodeXa',
    question: 'What is your role as Chief Technology Officer (CTO) at CodeXa Agency?',
    answer:
      'As CTO at CodeXa Agency, I direct frontend architecture, visual design systems, and modern web application development. I lead technical strategy, code quality standards, and interface innovation across client deliverables and internal digital products.'
  },
  {
    category: 'Technical Stack',
    question: 'What technologies and frontend frameworks do you specialize in?',
    answer:
      'My core stack focuses on React, modern JavaScript (ES6+), TypeScript, semantic HTML5, and advanced CSS/Vanilla styling with fluid motion graphics. I work extensively with Vite, RESTful APIs, Supabase PostgreSQL, and performance-tuned responsive interfaces.'
  },
  {
    category: 'Opportunities',
    question: 'Are you open to frontend engineering roles or freelance collaborations?',
    answer:
      'Yes! I am actively looking forward to frontend engineering internships, junior developer positions, and high-impact design collaborations where creative flair and engineering precision are valued.'
  },
  {
    category: 'Motion & UI/UX',
    question: 'How do you achieve fluid motion without sacrificing web performance?',
    answer:
      'By prioritizing hardware-accelerated CSS transforms, canvas-rendered particle dynamics outside of React reconciliation loops, IntersectionObserver pausing for offscreen elements, and strict adherence to prefers-reduced-motion accessibility standards.'
  },
  {
    category: 'Academic Background',
    question: 'What is your current academic background and learning trajectory?',
    answer:
      'I am currently pursuing my B.Tech degree in Computer Science & Engineering (2022–2026) at Narasaraopeta Engineering College. Previously, I secured 96.3% in Intermediate Class XII and 95.0% in Class X schooling at Sri Chaitanya.'
  },
  {
    category: 'Communication',
    question: 'How can clients or teams connect with you most effectively?',
    answer:
      'The fastest way is through the Contact Envelope form right below! Submitting automatically generates a digital visiting card, sends an email notification, and pre-fills WhatsApp (+91 90323 16792) for immediate conversation.'
  }
];

export default function ButterflyFAQ() {
  const [activeFaq, setActiveFaq] = useState(null);
  const [flyingState, setFlyingState] = useState(null); // { x, y, stage: 'start' | 'center' }
  const flyingTimerRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && activeFaq !== null) {
        setActiveFaq(null);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [activeFaq]);

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

  const openFaq = (idx, e) => {
    const trigger = e.currentTarget;
    const rect = trigger.getBoundingClientRect();

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setActiveFaq(idx);
      return;
    }

    setFlyingState({
      x: rect.left + rect.width / 2 - 30,
      y: rect.top + rect.height / 2 - 25,
      stage: 'start'
    });

    if (flyingTimerRef.current) clearTimeout(flyingTimerRef.current);

    flyingTimerRef.current = setTimeout(() => {
      setFlyingState({
        x: window.innerWidth / 2 - 30,
        y: window.innerHeight / 2 - 25,
        stage: 'center'
      });

      flyingTimerRef.current = setTimeout(() => {
        setFlyingState(null);
        setActiveFaq(idx);
      }, 420);
    }, 20);
  };

  const closeFaq = () => {
    setActiveFaq(null);
  };

  return (
    <section id="faq" className="section faq-section" aria-label="Frequently Asked Questions">
      {/* SVG Defs for Butterfly Wings */}
      <svg style={{ display: 'none' }} aria-hidden="true">
        <defs>
          <linearGradient id="faqWingGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fff5f9" />
            <stop offset="50%" stopColor="#f5a4bd" />
            <stop offset="100%" stopColor="#d56586" />
          </linearGradient>
          <g id="faq-full-butterfly-def">
            <g className="wing-left">
              <path
                d="M48 38 C35 15, 12 5, 5 15 C-5 30, 20 52, 44 44 C22 46, 10 60, 20 70 C30 80, 48 55, 48 44 Z"
                fill="url(#faqWingGrad)"
                stroke="#ba768e"
                strokeWidth="1.5"
              />
            </g>
            <g className="wing-right">
              <path
                d="M52 38 C65 15, 88 5, 95 15 C105 30, 80 52, 56 44 C78 46, 90 60, 80 70 C70 80, 52 55, 52 44 Z"
                fill="url(#faqWingGrad)"
                stroke="#ba768e"
                strokeWidth="1.5"
              />
            </g>
            <path d="M50 28 v38" stroke="#5d384e" strokeWidth="3" strokeLinecap="round" />
          </g>
        </defs>
      </svg>

      <div className="faq-container reveal visible">
        <div className="section-kicker" style={{ justifyContent: 'center' }}>
          <span>05</span> / FREQUENTLY ASKED QUESTIONS
        </div>
        <h2 className="faq-title">
          Curious? <em>Ask the Butterflies ✿</em>
        </h2>
        <p className="faq-subtitle">
          Click any fluttering butterfly below to watch it take flight and transform into answers about my engineering, leadership at CodeXa, and creative design philosophy.
        </p>

        {/* 6 Butterfly Question Cards */}
        <div className="faq-cards-grid" id="faq-cards-grid">
          {FAQ_DATA.map((item, idx) => (
            <div
              key={idx}
              className="faq-card tilt-card"
              role="button"
              tabIndex={0}
              data-faq-index={idx}
              aria-label={`FAQ Question ${idx + 1}: ${item.question}`}
              onClick={(e) => openFaq(idx, e)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  openFaq(idx, e);
                }
              }}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <div className="faq-butterfly-trigger" aria-hidden="true">
                <svg className="faq-mini-butterfly" viewBox="0 0 100 80">
                  <use href="#faq-full-butterfly-def" />
                </svg>
              </div>
              <div className="faq-card-content">
                <span className="faq-category">{item.category}</span>
                <h3 className="faq-question">{item.question}</h3>
                <p className="faq-hint">Click butterfly to reveal answer ✿</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Flying Butterfly Transition Clone */}
      {flyingState && (
        <div
          id="faq-flying-butterfly"
          className="faq-flying-butterfly"
          aria-hidden="true"
          style={{
            display: 'block',
            position: 'fixed',
            zIndex: 9999,
            pointerEvents: 'none',
            left: `${flyingState.x}px`,
            top: `${flyingState.y}px`,
            transform: flyingState.stage === 'center' ? 'scale(2.2) rotate(15deg)' : 'scale(0.8) rotate(0deg)',
            opacity: flyingState.stage === 'center' ? 0.9 : 1,
            transition: 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)'
          }}
        >
          <svg viewBox="0 0 100 80" className="flying-svg" style={{ width: '60px', height: '48px' }}>
            <use href="#faq-full-butterfly-def" />
          </svg>
        </div>
      )}

      {/* Butterfly-Shaped Transformed Answer Modal */}
      {activeFaq !== null && (
        <div
          id="faq-butterfly-modal"
          className="modal-backdrop faq-butterfly-modal is-open"
          role="dialog"
          aria-modal="true"
          aria-labelledby="faq-active-title"
          style={{ display: 'flex' }}
          onClick={closeFaq}
        >
          <div className="faq-modal-backdrop" id="faq-modal-backdrop" onClick={closeFaq}></div>

          <div
            className="butterfly-wings-panel"
            id="butterfly-wings-panel"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Ambient Vector Wing Silhouette */}
            <svg
              className="butterfly-wings-svg-bg"
              viewBox="0 0 800 620"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="butterflyWingFill" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#fffdfa" stopOpacity="0.98" />
                  <stop offset="50%" stopColor="#fff2f7" stopOpacity="0.96" />
                  <stop offset="100%" stopColor="#ffe6f0" stopOpacity="0.95" />
                </linearGradient>
                <linearGradient id="butterflyWingBorder" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#d56586" />
                  <stop offset="50%" stopColor="#ffb8cf" />
                  <stop offset="100%" stopColor="#d56586" />
                </linearGradient>
              </defs>
              <path
                className="wing-path"
                d="M 400 120 
                  C 430 40, 560 10, 680 40 
                  C 790 70, 810 180, 750 280 
                  C 710 350, 610 360, 570 380 
                  C 650 420, 710 500, 640 570 
                  C 570 630, 480 570, 420 510 
                  C 408 495, 400 480, 400 470 
                  C 400 480, 392 495, 380 510 
                  C 320 570, 230 630, 160 570 
                  C 90 500, 150 420, 230 380 
                  C 190 360, 90 350, 50 280 
                  C -10 180, 10 70, 120 40 
                  C 240 10, 370 40, 400 120 Z"
                fill="url(#butterflyWingFill)"
                stroke="url(#butterflyWingBorder)"
                strokeWidth="3"
                filter="drop-shadow(0 15px 35px rgba(213, 101, 134, 0.25))"
              />
              <path
                className="wing-veins"
                d="M 400 240 Q 560 180 710 160 M 400 260 Q 600 260 720 280 M 400 320 Q 560 400 630 480 M 400 240 Q 240 180 90 160 M 400 260 Q 200 260 80 280 M 400 320 Q 240 400 170 480"
                stroke="var(--accent)"
                strokeOpacity="0.22"
                strokeWidth="1.8"
                fill="none"
                strokeDasharray="4 4"
              />
            </svg>

            {/* Orbiting Smaller Butterfly Close Button */}
            <div
              className="orbiting-butterfly-wrap"
              id="orbiting-butterfly-close"
              role="button"
              tabIndex={0}
              aria-label="Close answer panel"
              title="Click orbiting butterfly to close"
              onClick={closeFaq}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  closeFaq();
                }
              }}
            >
              <div className="orbit-path-track" aria-hidden="true"></div>
              <div className="orbiting-butterfly">
                <svg viewBox="0 0 50 40" className="orbit-svg">
                  <path d="M25 18 C20 8, 8 2, 4 8 C-2 16, 12 28, 22 24 C12 26, 6 32, 11 37 C16 42, 25 28, 25 22 Z" fill="#f5a4bd" />
                  <path d="M25 18 C30 8, 42 2, 46 8 C52 16, 38 28, 28 24 C38 26, 44 32, 39 37 C34 42, 25 28, 25 22 Z" fill="#e27595" />
                  <circle cx="25" cy="20" r="2" fill="#5d384e" />
                </svg>
                <span className="orbit-close-tag">Close ✕</span>
              </div>
            </div>

            {/* Top Close Button */}
            <button
              type="button"
              className="faq-wings-close-btn"
              id="faq-wings-close-btn"
              aria-label="Close FAQ dialog"
              onClick={closeFaq}
            >
              <span>✕</span>
            </button>

            {/* Content Centered Inside Wings */}
            <div className="faq-wings-content">
              <div className="faq-active-badge" id="faq-active-category">
                {FAQ_DATA[activeFaq].category}
              </div>
              <h3 className="faq-active-question" id="faq-active-title">
                {FAQ_DATA[activeFaq].question}
              </h3>
              <div className="faq-active-divider">
                <span className="flower-symbol">🌸</span>
              </div>
              <div className="faq-active-answer" id="faq-active-body">
                {FAQ_DATA[activeFaq].answer}
              </div>
              <div className="faq-wings-footer">
                <span className="faq-wings-note">
                  Press <kbd>Esc</kbd> or click the orbiting butterfly to close
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
