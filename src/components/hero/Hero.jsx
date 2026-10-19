import React, { useState, useEffect, useRef } from 'react';
import DeveloperID from './DeveloperID';

export default function Hero({ onOpenResume, onOpenProfile, onOpenAdminPasskey }) {
  const [bubbleQuote, setBubbleQuote] = useState("Let's explore! 🌸");
  const particleCanvasRef = useRef(null);

  const quotes = [
    "Let’s explore! 🌸",
    "Welcome to my world! ✨",
    "A little creativity goes a long way. ♡",
    "Let's build something lovely! ✿",
    "Thoughtful code, happy users! 💻"
  ];

  const cycleQuote = () => {
    const nextIdx = (quotes.indexOf(bubbleQuote) + 1) % quotes.length;
    setBubbleQuote(quotes[nextIdx]);
  };

  // AMRUTHA Particle Displacement Canvas
  useEffect(() => {
    const canvas = particleCanvasRef.current;
    if (!canvas || window.innerWidth < 768 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const pCtx = canvas.getContext('2d');
    let pList = [];
    const pRadius = 135;
    let animFrame = null;
    let mousePos = { x: -9999, y: -9999 };

    const handlePointerMove = (e) => {
      mousePos.x = e.clientX;
      mousePos.y = e.clientY;
    };
    document.addEventListener('pointermove', handlePointerMove);

    function initParticles() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      pCtx.setTransform(1, 0, 0, 1, 0, 0);
      pCtx.scale(dpr, dpr);

      const offCanvas = document.createElement('canvas');
      offCanvas.width = rect.width;
      offCanvas.height = rect.height;
      const offCtx = offCanvas.getContext('2d');

      const computedFont = Math.min(rect.width * 0.22, 290);
      offCtx.font = `900 ${computedFont}px 'Outfit', sans-serif`;
      try { offCtx.letterSpacing = '-0.075em'; } catch (e) {}
      offCtx.fillStyle = '#f8cad6';
      offCtx.textAlign = 'center';
      offCtx.textBaseline = 'middle';
      offCtx.fillText('AMRUTHA', rect.width / 2, rect.height / 2 + 16);

      const imgData = offCtx.getImageData(0, 0, rect.width, rect.height);
      const step = window.innerWidth < 1200 ? 9 : 7;
      pList = [];

      for (let y = 0; y < rect.height; y += step) {
        for (let x = 0; x < rect.width; x += step) {
          const idx = (y * rect.width + x) * 4;
          if (imgData.data[idx + 3] > 100) {
            pList.push({
              homeX: x,
              homeY: y,
              x: x + (Math.random() - 0.5) * 14,
              y: y + (Math.random() - 0.5) * 14,
              vx: 0,
              vy: 0,
              size: Math.random() > 0.4 ? 2.8 : 4.0,
              color: Math.random() > 0.5 ? '#f5a4bd' : '#fcd2dc',
              angle: Math.random() * Math.PI * 2,
              wobble: 0.02 + Math.random() * 0.03
            });
          }
        }
      }
    }

    let frameCount = 0;
    function animateParticles() {
      pCtx.clearRect(0, 0, canvas.width, canvas.height);
      frameCount++;

      const rect = canvas.getBoundingClientRect();
      const localX = mousePos.x - rect.left;
      const localY = mousePos.y - rect.top;

      for (let i = 0; i < pList.length; i++) {
        const p = pList[i];
        const dx = p.x - localX;
        const dy = p.y - localY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < pRadius && dist > 0) {
          const force = (pRadius - dist) / pRadius;
          const ang = Math.atan2(dy, dx);
          p.vx += Math.cos(ang) * force * 13;
          p.vy += Math.sin(ang) * force * 13;
        }

        const springX = (p.homeX - p.x) * 0.065;
        const springY = (p.homeY - p.y) * 0.065;
        p.vx = (p.vx + springX) * 0.85;
        p.vy = (p.vy + springY) * 0.85;

        p.x += p.vx + Math.sin(frameCount * p.wobble + i) * 0.28;
        p.y += p.vy + Math.cos(frameCount * p.wobble + i) * 0.22;

        pCtx.fillStyle = p.color;
        pCtx.beginPath();
        pCtx.ellipse(p.x, p.y, p.size * 1.25, p.size * 0.75, p.angle, 0, Math.PI * 2);
        pCtx.fill();
      }

      animFrame = requestAnimationFrame(animateParticles);
    }

    initParticles();
    animateParticles();

    window.addEventListener('resize', initParticles);

    return () => {
      document.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('resize', initParticles);
      if (animFrame) cancelAnimationFrame(animFrame);
    };
  }, []);

  return (
    <section id="top" className="hero">
      <div className="hero-wash" aria-hidden="true"></div>

      {/* Giant AMRUTHA Lettering & Interactive Particle Canvas */}
      <div className="giant-name-wrap">
        <div className="giant-name" id="giant-amrutha" aria-hidden="true">
          AMRUTHA
        </div>
        <canvas
          ref={particleCanvasRef}
          id="amrutha-particle-canvas"
          className="amrutha-particle-canvas"
          aria-hidden="true"
        ></canvas>
      </div>

      {/* Left Content */}
      <div className="hero-copy">
        <div className="hand-intro">
          Hi, I’m Amrutha.<span className="hand-heart">♡</span>
        </div>
        <h1>
          Frontend<br />
          Developer
        </h1>
        <p className="hero-subtitle">
          I turn ideas into thoughtful web experiences.
        </p>
        <div className="hero-actions">
          <a
            href="#work"
            className="btn btn-primary"
            onClick={(e) => {
              e.preventDefault();
              const el = document.getElementById('work');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Explore my work <span className="btn-arrow">→</span>
          </a>
          <button
            type="button"
            className="btn btn-outline"
            id="open-resume-btn"
            onClick={onOpenResume}
          >
            <span>View resume</span>
            <span className="icon-inline" aria-hidden="true">📄</span>
          </button>
        </div>
      </div>

      {/* Anime Chibi Character */}
      <div className="character-wrap">
        <img
          className="character-img"
          src="/assets/amrutha-character.png"
          alt="Amrutha character"
          draggable="false"
        />
        <div className="character-shadow" aria-hidden="true"></div>

        <button
          type="button"
          id="speech-bubble"
          className="speech-bubble"
          onClick={cycleQuote}
          aria-label="Click speech bubble to cycle inspirational quote"
        >
          {bubbleQuote}
        </button>

        <div className="character-sparkles" aria-hidden="true">
          <span>✦</span>
          <span>✧</span>
          <span>✦</span>
        </div>
      </div>

      {/* Developer ID Badge */}
      <DeveloperID
        onOpenProfile={onOpenProfile}
        onOpenAdminPasskey={onOpenAdminPasskey}
      />

      {/* Corner Sakura Branches */}
      <img
        src="/assets/sakura-branch.png"
        className="sakura-branch-corner branch-left"
        alt=""
        aria-hidden="true"
      />
      <img
        src="/assets/sakura-branch.png"
        className="sakura-branch-corner branch-right"
        alt=""
        aria-hidden="true"
      />
    </section>
  );
}
