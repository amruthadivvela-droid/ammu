import React, { useEffect, useRef, useState } from 'react';

export default function CinematicIntro({ onComplete }) {
  const overlayRef = useRef(null);
  const canvasRef = useRef(null);
  const signRef = useRef(null);
  const animIdRef = useRef(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    const overlay = overlayRef.current;
    const hangingSignEl = signRef.current;
    if (!canvas || !overlay) return;

    const ctx = canvas.getContext('2d');
    let introActive = true;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.scale(dpr, dpr);

    const handleResize = () => {
      if (!introActive || !canvas) return;
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.scale(dpr, dpr);
    };

    window.addEventListener('resize', handleResize);

    // Sample letter coordinates for "WELCOME"
    const offCanvas = document.createElement('canvas');
    const offW = 1200;
    const offH = 300;
    offCanvas.width = offW;
    offCanvas.height = offH;
    const offCtx = offCanvas.getContext('2d');

    offCtx.fillStyle = '#000000';
    const welcomeLetters = ['W', 'E', 'L', 'C', 'O', 'M', 'E'];
    const letterSpacing = offW / (welcomeLetters.length + 1);
    offCtx.font = '900 135px "Outfit", sans-serif';
    offCtx.textAlign = 'center';
    offCtx.textBaseline = 'middle';
    welcomeLetters.forEach((char, idx) => {
      offCtx.fillText(char, letterSpacing * (idx + 1), offH / 2);
    });

    const imgData = offCtx.getImageData(0, 0, offW, offH).data;
    const textCoords = [];
    const step = 8;
    for (let y = 0; y < offH; y += step) {
      for (let x = 0; x < offW; x += step) {
        const idx = (y * offW + x) * 4;
        if (imgData[idx + 3] > 130) {
          textCoords.push({ nx: (x - offW / 2) / offW, ny: (y - offH / 2) / offH });
        }
      }
    }

    const numParticles = Math.min(180, textCoords.length);
    const targetPoints = [];
    const stride = Math.max(1, Math.floor(textCoords.length / numParticles));
    for (let i = 0; i < numParticles; i++) {
      targetPoints.push(textCoords[(i * stride) % textCoords.length]);
    }

    const swarm = targetPoints.map((pt, i) => {
      const angle = Math.random() * Math.PI * 2;
      const dist = 320 + Math.random() * 450;
      return {
        id: i,
        x: width * 0.5 + Math.cos(angle) * dist,
        y: height * 0.42 + Math.sin(angle) * dist,
        nx: pt.nx,
        ny: pt.ny,
        size: 11 + Math.random() * 5,
        wingPhase: Math.random() * Math.PI * 2,
        colorA: i % 3 === 0 ? '#ffffff' : (i % 3 === 1 ? '#ffe3ec' : '#f7a6bc'),
        colorB: i % 2 === 0 ? '#d56586' : '#c24f72',
        petalRot: Math.random() * Math.PI * 2,
        petalRotSpeed: (Math.random() - 0.5) * 0.05,
        driftX: (Math.random() - 0.5) * 3.2,
        driftY: 1.4 + Math.random() * 2.5,
        alpha: 1
      };
    });

    const P0 = { x: -60, y: height * 0.78 };
    const P1 = { x: width * 0.32, y: height * 0.18 };
    const P2 = { x: width * 0.38, y: height * 0.75 };
    const P3 = { x: width * 0.5, y: height * 0.42 };

    function cubicBezier(t, p0, p1, p2, p3) {
      const u = 1 - t;
      const tt = t * t;
      const uu = u * u;
      const uuu = uu * u;
      const ttt = tt * t;
      return {
        x: uuu * p0.x + 3 * uu * t * p1.x + 3 * u * tt * p2.x + ttt * p3.x,
        y: uuu * p0.y + 3 * uu * t * p1.y + 3 * u * tt * p2.y + ttt * p3.y
      };
    }

    const sparkleTrail = [];
    const startTime = performance.now();

    function drawBotanicalPetal(c, x, y, size, angle, tumble, colorA, colorB, alpha) {
      c.save();
      c.translate(x, y);
      c.rotate(angle);
      c.scale(Math.cos(tumble), 1);
      c.globalAlpha = Math.max(0, Math.min(1, alpha));

      const grad = c.createLinearGradient(0, -size, 0, size);
      grad.addColorStop(0, colorA);
      grad.addColorStop(0.7, colorB);
      grad.addColorStop(1, '#8e3450');

      c.fillStyle = grad;
      c.beginPath();
      c.moveTo(0, size);
      c.bezierCurveTo(-size * 0.8, size * 0.4, -size * 0.9, -size * 0.6, -size * 0.3, -size);
      c.lineTo(0, -size * 0.75);
      c.lineTo(size * 0.3, -size);
      c.bezierCurveTo(size * 0.9, -size * 0.6, size * 0.8, size * 0.4, 0, size);
      c.closePath();
      c.fill();
      c.restore();
    }

    function drawDetailedButterfly(c, x, y, size, angle, flap, colorA, colorB, alpha) {
      c.save();
      c.translate(x, y);
      c.rotate(angle);
      c.globalAlpha = Math.max(0, Math.min(1, alpha));

      const flapScale = Math.sin(flap) * 0.85 + 0.15;

      // Left Wing
      c.save();
      c.scale(flapScale, 1);
      c.beginPath();
      c.moveTo(-2, 0);
      c.bezierCurveTo(-size * 1.5, -size * 1.3, -size * 1.8, size * 0.2, -size * 0.8, size * 1.1);
      c.bezierCurveTo(-size * 0.4, size * 0.8, -2, size * 0.4, -2, 0);
      const gradL = c.createLinearGradient(-size * 1.5, -size, 0, size);
      gradL.addColorStop(0, colorA);
      gradL.addColorStop(0.6, colorB);
      gradL.addColorStop(1, '#682537');
      c.fillStyle = gradL;
      c.fill();
      c.strokeStyle = 'rgba(255,255,255,0.7)';
      c.lineWidth = 1;
      c.stroke();
      c.restore();

      // Right Wing
      c.save();
      c.scale(-flapScale, 1);
      c.beginPath();
      c.moveTo(-2, 0);
      c.bezierCurveTo(-size * 1.5, -size * 1.3, -size * 1.8, size * 0.2, -size * 0.8, size * 1.1);
      c.bezierCurveTo(-size * 0.4, size * 0.8, -2, size * 0.4, -2, 0);
      const gradR = c.createLinearGradient(-size * 1.5, -size, 0, size);
      gradR.addColorStop(0, colorA);
      gradR.addColorStop(0.6, colorB);
      gradR.addColorStop(1, '#682537');
      c.fillStyle = gradR;
      c.fill();
      c.strokeStyle = 'rgba(255,255,255,0.7)';
      c.lineWidth = 1;
      c.stroke();
      c.restore();

      // Body & Antennae
      c.fillStyle = '#311c2f';
      c.beginPath();
      c.ellipse(0, 0, 2, size * 0.45, 0, 0, Math.PI * 2);
      c.fill();

      c.beginPath();
      c.arc(0, -size * 0.45, 2.5, 0, Math.PI * 2);
      c.fill();

      c.strokeStyle = '#523447';
      c.lineWidth = 0.8;
      c.beginPath();
      c.moveTo(-1, -size * 0.45);
      c.quadraticCurveTo(-size * 0.3, -size * 0.8, -size * 0.45, -size * 0.7);
      c.moveTo(1, -size * 0.45);
      c.quadraticCurveTo(size * 0.3, -size * 0.8, size * 0.45, -size * 0.7);
      c.stroke();

      c.restore();
    }

    function completeIntro() {
      if (!introActive) return;
      introActive = false;
      if (animIdRef.current) cancelAnimationFrame(animIdRef.current);
      if (hangingSignEl) hangingSignEl.style.display = 'none';
      if (overlay) {
        overlay.classList.add('parting');
        overlay.classList.add('intro-hidden');
        setTimeout(() => {
          overlay.style.display = 'none';
          setIsVisible(false);
          if (onComplete) onComplete();
        }, 850);
      }
    }

    window.skipIntro = completeIntro;

    function frame(now) {
      if (!introActive) return;
      const elapsed = (now - startTime) / 1000;

      ctx.clearRect(0, 0, width, height);

      const welcomeWidth = Math.min(width * 0.86, 1150);
      const welcomeHeight = welcomeWidth * (offH / offW);
      const welcomeCenterX = width * 0.5;
      const welcomeCenterY = height * 0.42;

      // 1. Solitary Butterfly Flight (0.0s - 2.5s)
      if (elapsed < 2.5) {
        const t = Math.min(elapsed / 2.2, 1);
        const easeT = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        const pos = cubicBezier(easeT, P0, P1, P2, P3);
        const nextPos = cubicBezier(Math.min(easeT + 0.02, 1), P0, P1, P2, P3);
        const angle = Math.atan2(nextPos.y - pos.y, nextPos.x - pos.x) + Math.PI / 2;
        const flap = elapsed * 32;

        if (Math.random() < 0.6) {
          sparkleTrail.push({
            x: pos.x + (Math.random() - 0.5) * 8,
            y: pos.y + (Math.random() - 0.5) * 8,
            alpha: 1,
            size: 2.5 + Math.random() * 2,
            color: Math.random() < 0.5 ? '#ffd57a' : '#fba8bf'
          });
        }

        drawDetailedButterfly(ctx, pos.x, pos.y, 22, angle, flap, '#ffffff', '#d56586', 1);
      }

      // Draw Sparkle Trail
      for (let i = sparkleTrail.length - 1; i >= 0; i--) {
        const sp = sparkleTrail[i];
        sp.alpha -= 0.035;
        sp.y += 0.4;
        if (sp.alpha <= 0) {
          sparkleTrail.splice(i, 1);
        } else {
          ctx.save();
          ctx.globalAlpha = sp.alpha;
          ctx.fillStyle = sp.color;
          ctx.beginPath();
          ctx.arc(sp.x, sp.y, sp.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

      // 2. Swarm Particles & WELCOME Formation (2.2s - 5.8s)
      if (elapsed >= 2.2) {
        const swarmProgress = Math.min(Math.max((elapsed - 2.2) / 1.6, 0), 1);
        const isMorphingToPetals = elapsed >= 5.8;
        const morphProgress = Math.min(Math.max((elapsed - 5.8) / 1.4, 0), 1);

        swarm.forEach(p => {
          const tx = welcomeCenterX + p.nx * welcomeWidth;
          const ty = welcomeCenterY + p.ny * welcomeHeight;

          if (!isMorphingToPetals) {
            const targetWeight = swarmProgress * swarmProgress;
            const desiredX = p.x + (tx - p.x) * (0.048 * targetWeight);
            const desiredY = p.y + (ty - p.y) * (0.048 * targetWeight);

            if (elapsed >= 3.8) {
              const jitterX = Math.sin(elapsed * 4 + p.id) * 1.2;
              const jitterY = Math.cos(elapsed * 4 + p.id) * 1.2;
              p.x = tx + jitterX;
              p.y = ty + jitterY;
            } else {
              p.x = desiredX;
              p.y = desiredY;
            }

            const flap = elapsed * 24 + p.wingPhase;
            const angle = Math.sin(elapsed * 2 + p.id) * 0.2;
            drawDetailedButterfly(ctx, p.x, p.y, p.size, angle, flap, p.colorA, p.colorB, 1);
          } else {
            p.x += p.driftX + Math.sin(elapsed * 3 + p.id) * 0.6;
            p.y += p.driftY;
            p.petalRot += p.petalRotSpeed;

            if (elapsed >= 7.0) {
              p.alpha = Math.max(0, 1 - (elapsed - 7.0) / 0.9);
            }

            if (morphProgress < 0.35) {
              const blendAlpha = 1 - (morphProgress / 0.35);
              drawDetailedButterfly(ctx, p.x, p.y, p.size, p.petalRot, elapsed * 24, p.colorA, p.colorB, blendAlpha * p.alpha);
              drawBotanicalPetal(ctx, p.x, p.y, p.size * 1.2, p.petalRot, elapsed * 2.5, p.colorA, p.colorB, (1 - blendAlpha) * p.alpha);
            } else {
              drawBotanicalPetal(ctx, p.x, p.y, p.size * 1.2, p.petalRot, elapsed * 2.5, p.colorA, p.colorB, p.alpha);
            }
          }
        });
      }

      // 3. Falling Hanging Sign "to my world" (4.0s to 7.8s)
      if (hangingSignEl) {
        if (elapsed >= 4.0 && elapsed < 6.8) {
          hangingSignEl.style.display = 'flex';
          const progress = Math.min((elapsed - 4.0) / 1.0, 1);
          const easeOutBack = 1 + 2.4 * Math.pow(progress - 1, 3) + 1.2 * Math.pow(progress - 1, 2);
          const targetY = welcomeCenterY + welcomeHeight * 0.48 + 36;
          const currentY = -100 + (targetY + 100) * Math.min(easeOutBack, 1.05);
          const swing = Math.sin(elapsed * 3) * (1 - progress) * 6;
          hangingSignEl.style.top = `${currentY}px`;
          hangingSignEl.style.transform = `translateX(-50%) rotate(${swing}deg)`;
          hangingSignEl.style.opacity = '1';
        } else if (elapsed >= 6.8 && elapsed < 7.8) {
          const fallTime = elapsed - 6.8;
          const targetY = welcomeCenterY + welcomeHeight * 0.48 + 36;
          const gravityY = targetY + 0.5 * 1400 * fallTime * fallTime;
          hangingSignEl.style.top = `${gravityY}px`;
          hangingSignEl.style.transform = `translateX(-50%) rotate(${8 + fallTime * 14}deg)`;
          hangingSignEl.style.opacity = String(Math.max(0, 1 - fallTime / 0.8));
        } else if (elapsed >= 7.8) {
          hangingSignEl.style.display = 'none';
        }
      }

      // 4. Soft Cloud Deck Lateral Reveal
      if (elapsed >= 7.2 && overlay && !overlay.classList.contains('parting')) {
        overlay.classList.add('parting');
      }

      // 5. Complete intro
      if (elapsed >= 8.5) {
        completeIntro();
        return;
      }

      animIdRef.current = requestAnimationFrame(frame);
    }

    animIdRef.current = requestAnimationFrame(frame);

    return () => {
      introActive = false;
      window.removeEventListener('resize', handleResize);
      if (animIdRef.current) cancelAnimationFrame(animIdRef.current);
    };
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <div
      ref={overlayRef}
      id="cinematic-intro-overlay"
      className="cinematic-intro-overlay"
      aria-label="Opening cinematic introduction"
    >
      {/* Storybook Washi Paper Deckle-Edge Curtains */}
      <div className="storybook-curtain storybook-curtain-left" id="curtain-left" aria-hidden="true">
        <svg className="deckle-edge-svg" viewBox="0 0 200 1000" preserveAspectRatio="none">
          <path d="M0,0 L160,0 C175,90 145,180 165,270 C185,360 140,450 170,540 C195,630 150,720 175,810 C190,900 155,950 165,1000 L0,1000 Z" fill="#fffaf8"/>
        </svg>
        <div className="washi-texture-overlay"></div>
      </div>

      <div className="storybook-curtain storybook-curtain-right" id="curtain-right" aria-hidden="true">
        <svg className="deckle-edge-svg" viewBox="0 0 200 1000" preserveAspectRatio="none">
          <path d="M200,0 L40,0 C25,90 55,180 35,270 C15,360 60,450 30,540 C5,630 50,720 25,810 C10,900 45,950 35,1000 L200,1000 Z" fill="#fffaf8"/>
        </svg>
        <div className="washi-texture-overlay"></div>
      </div>

      {/* Soft Painted Cloud Decks for Lateral Reveal */}
      <div className="cloud-deck cloud-deck-left" id="cloud-deck-left" aria-hidden="true">
        <div className="cloud-puff puff-1"></div>
        <div className="cloud-puff puff-2"></div>
        <div className="cloud-puff puff-3"></div>
        <div className="cloud-puff puff-4"></div>
      </div>

      <div className="cloud-deck cloud-deck-right" id="cloud-deck-right" aria-hidden="true">
        <div className="cloud-puff puff-5"></div>
        <div className="cloud-puff puff-6"></div>
        <div className="cloud-puff puff-7"></div>
        <div className="cloud-puff puff-8"></div>
      </div>

      {/* 60fps Interactive Animation Canvas */}
      <canvas ref={canvasRef} id="intro-canvas" className="intro-canvas"></canvas>

      {/* Falling Welcome Sign: "to my world" */}
      <div ref={signRef} id="intro-hanging-sign" className="intro-hanging-sign" style={{ display: 'none' }} aria-hidden="true">
        <svg className="intro-sign-threads" viewBox="0 0 420 60" preserveAspectRatio="none">
          <line x1="60" y1="0" x2="60" y2="60" stroke="#d56586" strokeWidth="2" strokeDasharray="3 3"/>
          <line x1="360" y1="0" x2="360" y2="60" stroke="#d56586" strokeWidth="2" strokeDasharray="3 3"/>
        </svg>
        <div className="intro-sign-text">to my world</div>
        <div className="intro-sign-deco">✿ &bull; ✦ &bull; ✿</div>
      </div>

      {/* Cinematic Controls */}
      <div className="intro-controls">
        <button
          type="button"
          id="skip-intro-btn"
          className="skip-intro-btn"
          aria-label="Skip introduction"
          onClick={() => {
            if (typeof window.skipIntro === 'function') window.skipIntro();
          }}
        >
          <span>Skip Intro</span> <span className="skip-arrow">↷</span>
        </button>
      </div>
    </div>
  );
}
