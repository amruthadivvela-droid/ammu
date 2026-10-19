import React, { useRef, useEffect } from 'react';

export default function DeveloperID({ onOpenProfile, onOpenAdminPasskey }) {
  const badgeRef = useRef(null);
  const photoFrameRef = useRef(null);
  const animeImgRef = useRef(null);
  const realImgRef = useRef(null);
  const canvasRef = useRef(null);
  const lastTouchRef = useRef(0);
  const pixelAnimFrameRef = useRef(null);
  const badgeAngleRef = useRef(10);
  const targetBadgeAngleRef = useRef(10);

  // Smooth Pendulum Sway on Pointer Move
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || window.innerWidth < 768) {
      return;
    }

    const handlePointerMove = (e) => {
      const hero = document.getElementById('top');
      if (!hero) return;
      const rect = hero.getBoundingClientRect();
      if (e.clientY <= rect.bottom + 100) {
        const mx = (e.clientX - rect.left) / rect.width - 0.5;
        targetBadgeAngleRef.current = 10 + mx * 8;
      }
    };

    let animFrame = null;
    const updatePhysics = () => {
      badgeAngleRef.current += (targetBadgeAngleRef.current - badgeAngleRef.current) * 0.08;
      if (badgeRef.current) {
        badgeRef.current.style.transform = `rotate(${badgeAngleRef.current.toFixed(2)}deg)`;
      }
      animFrame = requestAnimationFrame(updatePhysics);
    };

    document.addEventListener('pointermove', handlePointerMove);
    animFrame = requestAnimationFrame(updatePhysics);

    return () => {
      document.removeEventListener('pointermove', handlePointerMove);
      if (animFrame) cancelAnimationFrame(animFrame);
    };
  }, []);

  // Pixel Dissolve Engine on Hover
  const runPixelDissolve = (toReal) => {
    const canvas = canvasRef.current;
    const animeImg = animeImgRef.current;
    const realImg = realImgRef.current;
    const photoFrame = photoFrameRef.current;

    if (!canvas || !animeImg || !realImg) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      animeImg.style.opacity = toReal ? '0' : '1';
      realImg.style.opacity = toReal ? '1' : '0';
      if (photoFrame) photoFrame.classList.toggle('show-real', toReal);
      return;
    }

    if (pixelAnimFrameRef.current) cancelAnimationFrame(pixelAnimFrameRef.current);
    canvas.style.display = 'block';

    const rect = photoFrame ? photoFrame.getBoundingClientRect() : canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = rect.width || 186;
    const h = rect.height || 160;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    const cols = 18;
    const rows = 18;
    const cellW = w / cols;
    const cellH = h / rows;
    const total = cols * rows;

    const order = Array.from({ length: total }, (_, i) => i);
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }

    const duration = 520;
    const startTime = performance.now();

    function stepHeroFrame(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      if (progress >= 0.5) {
        animeImg.style.opacity = toReal ? '0' : '1';
        realImg.style.opacity = toReal ? '1' : '0';
        if (photoFrame) photoFrame.classList.toggle('show-real', toReal);
      }

      ctx.clearRect(0, 0, w, h);
      const count = Math.floor(Math.sin(progress * Math.PI) * total);
      const alpha = Math.sin(progress * Math.PI) * 0.95;

      for (let c = 0; c < count; c++) {
        const idx = order[c];
        const col = idx % cols;
        const row = Math.floor(idx / cols);

        ctx.fillStyle =
          c % 3 === 0
            ? `rgba(245, 164, 189, ${alpha})`
            : c % 3 === 1
            ? `rgba(255, 230, 238, ${alpha})`
            : `rgba(213, 101, 134, ${alpha})`;
        ctx.fillRect(col * cellW, row * cellH, cellW - 0.5, cellH - 0.5);
      }

      if (progress < 1) {
        pixelAnimFrameRef.current = requestAnimationFrame(stepHeroFrame);
      } else {
        canvas.style.display = 'none';
        ctx.clearRect(0, 0, w, h);
      }
    }

    pixelAnimFrameRef.current = requestAnimationFrame(stepHeroFrame);
  };

  const handleFlowerTouchEnd = (e) => {
    const now = Date.now();
    const diff = now - lastTouchRef.current;
    if (diff > 0 && diff < 380) {
      e.preventDefault();
      e.stopPropagation();
      onOpenAdminPasskey();
    }
    lastTouchRef.current = now;
  };

  return (
    <div className="badge-scene" aria-label="Interactive Developer ID card">
      {/* Hanging Hardware Clasp SVG */}
      <svg className="lanyard-hardware-svg" viewBox="0 0 290 440" aria-hidden="true">
        <defs>
          <linearGradient id="lanyardStrapA" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffb8cc"/>
            <stop offset="50%" stopColor="#f59eb7"/>
            <stop offset="100%" stopColor="#d56586"/>
          </linearGradient>
          <linearGradient id="lanyardStrapB" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffd5e2"/>
            <stop offset="50%" stopColor="#f59eb7"/>
            <stop offset="100%" stopColor="#ba5372"/>
          </linearGradient>
          <linearGradient id="goldMetalGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fff0c2"/>
            <stop offset="40%" stopColor="#e6bc58"/>
            <stop offset="70%" stopColor="#b88a20"/>
            <stop offset="100%" stopColor="#7a570b"/>
          </linearGradient>
          <filter id="hardwareShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="6" stdDeviation="4" floodColor="#4a1826" floodOpacity="0.28"/>
          </filter>
        </defs>

        <path d="M 45 -40 C 70 100, 115 220, 142 275" stroke="url(#lanyardStrapA)" strokeWidth="26" strokeLinecap="round" fill="none"/>
        <path d="M 45 -40 C 70 100, 115 220, 142 275" stroke="#fff" strokeWidth="1.5" strokeDasharray="3 4" strokeOpacity="0.6" fill="none"/>
        <path d="M 245 -40 C 220 100, 175 220, 148 275" stroke="url(#lanyardStrapB)" strokeWidth="26" strokeLinecap="round" fill="none"/>
        <path d="M 245 -40 C 220 100, 175 220, 148 275" stroke="#fff" strokeWidth="1.5" strokeDasharray="3 4" strokeOpacity="0.6" fill="none"/>

        <rect x="127" y="268" width="36" height="18" rx="7" fill="url(#goldMetalGrad)" stroke="#8c6414" strokeWidth="1.5" filter="url(#hardwareShadow)"/>
        <rect x="139" y="286" width="12" height="20" rx="4" fill="url(#goldMetalGrad)" stroke="#7a570b" strokeWidth="1.2"/>
        <path d="M 145 306 L 145 342" stroke="url(#goldMetalGrad)" strokeWidth="7" strokeLinecap="round"/>
        <circle cx="145" cy="342" r="7.5" fill="none" stroke="url(#goldMetalGrad)" strokeWidth="4.5" filter="url(#hardwareShadow)"/>
        <path d="M 141 336 C 141 346, 149 346, 149 336" fill="none" stroke="#fff0c2" strokeWidth="2.5" strokeLinecap="round"/>
      </svg>

      {/* Hanging Badge Card */}
      <div
        ref={badgeRef}
        className="dev-id"
        id="dev-id-badge"
        role="button"
        tabIndex={0}
        aria-label="Amrutha Developer ID badge. Click card to open public profile modal."
        onClick={(e) => {
          if (e.target.closest('#id-admin-flower')) return;
          onOpenProfile();
        }}
        onKeyDown={(e) => {
          if (e.target.closest('#id-admin-flower')) return;
          if (e.key === 'Enter' || e.key === ' ') onOpenProfile();
        }}
      >
        <div className="badge-hole-slot" aria-hidden="true"></div>

        <div className="dev-id-head">
          <div className="id-code">&lt;/&gt;</div>
          <span>DEVELOPER ID</span>
          <span className="dev-corner-flower flower-rot-a" aria-hidden="true">✿</span>
        </div>

        {/* Anime Portrait Frame with Hover Pixel Dissolve to Real Photo */}
        <div
          ref={photoFrameRef}
          className="id-photo"
          id="id-photo-frame"
          title="Hover over portrait to reveal real photograph"
          onPointerEnter={() => runPixelDissolve(true)}
          onPointerLeave={() => runPixelDissolve(false)}
        >
          <img
            ref={animeImgRef}
            className="portrait-anime"
            src="/assets/idcard_avatar.jpeg"
            alt="Amrutha Avatar"
            id="anime-portrait-img"
          />
          <img
            ref={realImgRef}
            className="portrait-real"
            src="/assets/ammu.webp"
            alt="Amrutha Photograph"
            id="real-portrait-img"
          />
          <canvas
            ref={canvasRef}
            id="hero-pixel-canvas"
            className="hero-pixel-canvas"
            style={{ display: 'none' }}
          ></canvas>
        </div>

        <div className="id-name">AMRUTHA</div>
        <div className="id-role">Chief Technology Officer</div>
        <div className="id-agency">at CodeXa Agency</div>

        <div className="id-barcode" aria-hidden="true"></div>

        {/* Decorative Rotating Corner Flower */}
        <span
          className="dev-corner-flower flower-rot-b"
          style={{ position: 'absolute', left: '14px', bottom: '14px', fontSize: '16px' }}
          aria-hidden="true"
        >
          🌸
        </span>

        {/* Hidden Admin Entry: Rotating Decorative Blossom (Double-Click / Double-Tap) */}
        <div
          className="id-admin-flower"
          id="id-admin-flower"
          role="button"
          tabIndex={0}
          aria-label="Sakura emblem"
          title=""
          onDoubleClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onOpenAdminPasskey();
          }}
          onTouchEnd={handleFlowerTouchEnd}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              e.stopPropagation();
              onOpenAdminPasskey();
            }
          }}
        >
          <svg className="admin-flower-svg" viewBox="0 0 100 100" aria-hidden="true">
            <defs>
              <radialGradient id="cornerFlowerGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#fffbf7"/>
                <stop offset="50%" stopColor="#fba8bf"/>
                <stop offset="100%" stopColor="#d56586"/>
              </radialGradient>
            </defs>
            <g transform="translate(50,50)">
              <path d="M 0,-4 C -9,-26 -20,-26 -17,-14 C -14,-3 -4,0 0,0 C 4,0 14,-3 17,-14 C 20,-26 9,-26 0,-4 Z" fill="url(#cornerFlowerGrad)"/>
              <path d="M 0,-4 C -9,-26 -20,-26 -17,-14 C -14,-3 -4,0 0,0 C 4,0 14,-3 17,-14 C 20,-26 9,-26 0,-4 Z" fill="url(#cornerFlowerGrad)" transform="rotate(72)"/>
              <path d="M 0,-4 C -9,-26 -20,-26 -17,-14 C -14,-3 -4,0 0,0 C 4,0 14,-3 17,-14 C 20,-26 9,-26 0,-4 Z" fill="url(#cornerFlowerGrad)" transform="rotate(144)"/>
              <path d="M 0,-4 C -9,-26 -20,-26 -17,-14 C -14,-3 -4,0 0,0 C 4,0 14,-3 17,-14 C 20,-26 9,-26 0,-4 Z" fill="url(#cornerFlowerGrad)" transform="rotate(216)"/>
              <path d="M 0,-4 C -9,-26 -20,-26 -17,-14 C -14,-3 -4,0 0,0 C 4,0 14,-3 17,-14 C 20,-26 9,-26 0,-4 Z" fill="url(#cornerFlowerGrad)" transform="rotate(288)"/>
              <circle cx="0" cy="0" r="4.5" fill="#ffd57a" stroke="#d56586" strokeWidth="1"/>
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}
