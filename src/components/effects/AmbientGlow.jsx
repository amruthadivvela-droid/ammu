import React, { useEffect } from 'react';

export default function AmbientGlow() {
  useEffect(() => {
    const ambientGlow = document.getElementById('ambient-glow');
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || window.innerWidth < 768) {
      return;
    }

    let lastSparkleTime = 0;

    const handlePointerMove = (e) => {
      if (ambientGlow) {
        ambientGlow.style.left = `${e.clientX}px`;
        ambientGlow.style.top = `${e.clientY}px`;
      }

      // Floral cursor trail
      const now = Date.now();
      if (now - lastSparkleTime > 48) {
        lastSparkleTime = now;
        const flower = document.createElement('span');
        flower.className = 'cursor-flower';

        const r = Math.random();
        let fSize = 12;
        if (r < 0.5) {
          fSize = 10 + Math.random() * 4;
        } else if (r < 0.85) {
          fSize = 16 + Math.random() * 8;
        } else {
          fSize = 26 + Math.random() * 8;
        }

        const symbols = ['🌸', '✿', '❀', '💮', '✦', '✧'];
        flower.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        flower.style.fontSize = `${fSize.toFixed(1)}px`;
        flower.style.left = `${e.clientX}px`;
        flower.style.top = `${e.clientY}px`;

        const driftX = (Math.random() - 0.5) * 55;
        const driftY = -18 - Math.random() * 38;
        const rotStart = (Math.random() * 360).toFixed(0);
        const rotMid = (Math.random() * 360).toFixed(0);
        const rotEnd = (Math.random() * 360).toFixed(0);
        const duration = (1.4 + Math.random() * 0.7).toFixed(2);

        flower.style.setProperty('--drift-x', `${driftX.toFixed(1)}px`);
        flower.style.setProperty('--drift-y', `${driftY.toFixed(1)}px`);
        flower.style.setProperty('--rot-start', `${rotStart}deg`);
        flower.style.setProperty('--rot-mid', `${rotMid}deg`);
        flower.style.setProperty('--rot-end', `${rotEnd}deg`);
        flower.style.setProperty('--flower-duration', `${duration}s`);

        document.body.appendChild(flower);
        setTimeout(() => flower.remove(), parseFloat(duration) * 1000);
      }
    };

    const handlePointerDown = (e) => {
      if (e.target.closest('input, textarea, select, .theme-dropdown, button, a')) return;

      const burst = document.createElement('div');
      burst.className = 'cursor-click-burst';
      burst.style.left = `${e.clientX}px`;
      burst.style.top = `${e.clientY}px`;
      burst.style.width = '42px';
      burst.style.height = '42px';
      document.body.appendChild(burst);
      setTimeout(() => burst.remove(), 600);

      for (let i = 0; i < 4; i++) {
        const petal = document.createElement('span');
        petal.className = 'cursor-flower';
        petal.textContent = '🌸';
        petal.style.fontSize = `${13 + Math.random() * 6}px`;
        petal.style.left = `${e.clientX}px`;
        petal.style.top = `${e.clientY}px`;
        const angle = (i * Math.PI) / 2 + (Math.random() - 0.5) * 0.6;
        const dist = 36 + Math.random() * 28;
        petal.style.setProperty('--drift-x', `${(Math.cos(angle) * dist).toFixed(1)}px`);
        petal.style.setProperty('--drift-y', `${(Math.sin(angle) * dist).toFixed(1)}px`);
        petal.style.setProperty('--flower-duration', '0.75s');
        document.body.appendChild(petal);
        setTimeout(() => petal.remove(), 750);
      }
    };

    document.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('pointerdown', handlePointerDown);

    return () => {
      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  }, []);

  return <div className="ambient-glow" id="ambient-glow" aria-hidden="true" />;
}
