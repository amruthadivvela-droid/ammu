import React, { useEffect, useRef } from 'react';

export default function OutroFinale() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const strikethroughRef = useRef(null);
  const portfolioRef = useRef(null);
  const worldRef = useRef(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    const strikethrough = strikethroughRef.current;
    const portfolio = portfolioRef.current;
    const world = worldRef.current;
    const container = containerRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let w = (canvas.width = canvas.offsetWidth || window.innerWidth);
    let h = (canvas.height = canvas.offsetHeight || 520);

    const handleResize = () => {
      if (!canvas) return;
      w = canvas.width = canvas.offsetWidth || window.innerWidth;
      h = canvas.height = canvas.offsetHeight || 520;
    };
    window.addEventListener('resize', handleResize);

    // Particle system (150 particles: butterflies and petals)
    const particleCount = 150;
    const particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5 - 0.5,
        size: Math.random() * 8 + 6,
        isButterfly: Math.random() > 0.45,
        wingPhase: Math.random() * Math.PI * 2,
        wingSpeed: Math.random() * 0.15 + 0.1,
        colorA: i % 2 === 0 ? '#fca5bd' : '#ffd4e0',
        colorB: i % 3 === 0 ? '#d56586' : '#ba5372',
        rot: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.04
      });
    }

    let isVisible = true;
    let animFrame = null;
    let cycleId = 0;
    let cycleTimeout = null;

    function drawParticles() {
      if (!isVisible) return;
      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.rotSpeed;

        if (p.x < -30) p.x = w + 30;
        if (p.x > w + 30) p.x = -30;
        if (p.y < -30) p.y = h + 30;
        if (p.y > h + 30) p.y = -30;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);

        if (p.isButterfly) {
          p.wingPhase += p.wingSpeed;
          const flap = Math.sin(p.wingPhase);

          ctx.save();
          ctx.scale(flap, 1);
          ctx.fillStyle = p.colorA;
          ctx.beginPath();
          ctx.ellipse(-p.size * 0.7, -p.size * 0.3, p.size * 0.9, p.size * 0.5, -0.4, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.ellipse(-p.size * 0.6, p.size * 0.4, p.size * 0.7, p.size * 0.4, 0.4, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();

          ctx.save();
          ctx.scale(-flap, 1);
          ctx.fillStyle = p.colorB;
          ctx.beginPath();
          ctx.ellipse(-p.size * 0.7, -p.size * 0.3, p.size * 0.9, p.size * 0.5, -0.4, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.ellipse(-p.size * 0.6, p.size * 0.4, p.size * 0.7, p.size * 0.4, 0.4, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();

          ctx.fillStyle = '#4a2538';
          ctx.fillRect(-1.5, -p.size * 0.4, 3, p.size * 0.8);
        } else {
          ctx.fillStyle = p.colorA;
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size * 0.5, p.size, 0, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      animFrame = requestAnimationFrame(drawParticles);
    }

    // Continuous Outro Animation Cycle (No Replay Button, Loops Automatically)
    function runCycle() {
      cycleId++;
      const current = cycleId;
      if (cycleTimeout) clearTimeout(cycleTimeout);

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        if (container) container.style.opacity = '1';
        if (strikethrough) strikethrough.classList.add('active');
        if (portfolio) portfolio.classList.add('struck');
        if (world) world.classList.add('active');
        return;
      }

      // State A: "Thanks for visiting my portfolio" (opacity 1)
      if (container) container.style.opacity = '1';
      if (strikethrough) strikethrough.classList.remove('active');
      if (world) world.classList.remove('active');
      if (portfolio) {
        portfolio.classList.remove('struck');
        portfolio.style.opacity = '0.9';
      }

      // State B: After 2.5s, strikethrough path animates across "portfolio"
      cycleTimeout = setTimeout(() => {
        if (current !== cycleId) return;
        if (strikethrough) strikethrough.classList.add('active');

        // State C & D: After 0.6s, "world ♡" blooms
        cycleTimeout = setTimeout(() => {
          if (current !== cycleId) return;
          if (portfolio) portfolio.classList.add('struck');
          if (world) world.classList.add('active');

          // State E: Hold 6.5s so visitors can fully read "Thanks for visiting my world! ♡"
          cycleTimeout = setTimeout(() => {
            if (current !== cycleId) return;

            // State F: Dissolve message into butterflies & petals
            if (container) container.style.opacity = '0';

            // State G: Reform after 1.5s and loop seamlessly!
            cycleTimeout = setTimeout(() => {
              if (current !== cycleId) return;
              runCycle();
            }, 1500);
          }, 6500);
        }, 600);
      }, 2500);
    }

    drawParticles();
    runCycle();

    // Pause offscreen rendering using IntersectionObserver
    let observer = null;
    if (section && 'IntersectionObserver' in window) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              if (!isVisible) {
                isVisible = true;
                drawParticles();
              }
            } else {
              isVisible = false;
              if (animFrame) cancelAnimationFrame(animFrame);
            }
          });
        },
        { threshold: 0.05 }
      );
      observer.observe(section);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrame) cancelAnimationFrame(animFrame);
      if (cycleTimeout) clearTimeout(cycleTimeout);
      if (observer) observer.disconnect();
    };
  }, []);

  return (
    <section ref={sectionRef} id="finale" className="finale-section" aria-label="Grand Finale">
      <div className="finale-ambient-glow" aria-hidden="true"></div>

      {/* Canvas for butterfly flocking & cherry-blossom particles */}
      <canvas ref={canvasRef} id="finale-canvas" className="finale-canvas" aria-hidden="true"></canvas>

      <div className="finale-stage" id="finale-stage">
        <div ref={containerRef} className="finale-message-container" id="finale-message-container">
          <div className="finale-line finale-line-primary">
            <span className="finale-word word-thanks">Thanks</span>
            <span className="finale-word word-for">for</span>
            <span className="finale-word word-visiting">visiting</span>
            <span className="finale-word word-my">my</span>
          </div>
          <div className="finale-line finale-line-transform">
            <span className="finale-target-slot" id="finale-target-slot">
              {/* Original word: portfolio */}
              <span ref={portfolioRef} className="finale-word word-portfolio" id="finale-portfolio">
                portfolio
                <svg
                  className="handwritten-strikethrough-svg"
                  viewBox="0 0 240 46"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path
                    ref={strikethroughRef}
                    id="strikethrough-path"
                    className="strikethrough-path"
                    d="M 6 24 Q 60 10 120 23 T 234 20 Q 150 28 80 22"
                    fill="none"
                    stroke="var(--accent)"
                    strokeWidth="4.5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              {/* Replacement word: world ♡ */}
              <span ref={worldRef} className="finale-word word-world" id="finale-world" aria-hidden="true">
                world <span className="finale-heart">♡</span>
              </span>
            </span>
          </div>
          <div className="finale-subtext" id="finale-subtext">
            <span>May your curiosity bloom like cherry blossoms in spring ✿</span>
          </div>
        </div>
      </div>
    </section>
  );
}
