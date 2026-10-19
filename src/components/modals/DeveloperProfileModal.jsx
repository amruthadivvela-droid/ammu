import React, { useEffect, useRef } from 'react';

const GITHUB_PROFILE = 'https://github.com/amruthadivvela-droid';

export default function DeveloperProfileModal({ isOpen, onClose, onOpenResume }) {
  const canvasRef = useRef(null);
  const animeImgRef = useRef(null);
  const realImgRef = useRef(null);
  const loopTimerRef = useRef(null);
  const animFrameRef = useRef(null);
  const isRunningRef = useRef(false);

  useEffect(() => {
    if (!isOpen) {
      isRunningRef.current = false;
      if (loopTimerRef.current) clearTimeout(loopTimerRef.current);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      return;
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      if (animeImgRef.current) animeImgRef.current.style.opacity = '1';
      if (realImgRef.current) realImgRef.current.style.opacity = '0';
      return;
    }

    isRunningRef.current = true;

    function executeDissolve(toReal, onComplete) {
      const canvas = canvasRef.current;
      const animeImg = animeImgRef.current;
      const realImg = realImgRef.current;

      if (!canvas || !animeImg || !realImg) {
        if (onComplete) onComplete();
        return;
      }

      canvas.style.display = 'block';
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = rect.width || 120;
      const h = rect.height || 120;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      const ctx = canvas.getContext('2d');
      ctx.scale(dpr, dpr);

      const cols = 20;
      const rows = 20;
      const cellW = w / cols;
      const cellH = h / rows;
      const total = cols * rows;

      const order = Array.from({ length: total }, (_, i) => i);
      for (let i = order.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [order[i], order[j]] = [order[j], order[i]];
      }

      const duration = 800;
      const startTime = performance.now();

      function stepFrame(currentTime) {
        if (!isRunningRef.current) {
          canvas.style.display = 'none';
          return;
        }

        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        if (progress >= 0.5) {
          animeImg.style.opacity = toReal ? '0' : '1';
          realImg.style.opacity = toReal ? '1' : '0';
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
          animFrameRef.current = requestAnimationFrame(stepFrame);
        } else {
          canvas.style.display = 'none';
          ctx.clearRect(0, 0, w, h);
          if (onComplete) onComplete();
        }
      }

      animFrameRef.current = requestAnimationFrame(stepFrame);
    }

    function runLoop() {
      if (!isRunningRef.current) return;

      if (animeImgRef.current) animeImgRef.current.style.opacity = '1';
      if (realImgRef.current) realImgRef.current.style.opacity = '0';

      loopTimerRef.current = setTimeout(() => {
        if (!isRunningRef.current) return;

        executeDissolve(true, () => {
          if (!isRunningRef.current) return;

          loopTimerRef.current = setTimeout(() => {
            if (!isRunningRef.current) return;

            executeDissolve(false, () => {
              if (!isRunningRef.current) return;
              runLoop();
            });
          }, 2000);
        });
      }, 2000);
    }

    runLoop();

    return () => {
      isRunningRef.current = false;
      if (loopTimerRef.current) clearTimeout(loopTimerRef.current);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="modal-backdrop is-open"
      id="dev-id-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dev-modal-title"
      onClick={onClose}
    >
      <div className="modal-card dev-modal-card" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="modal-close-btn"
          id="close-dev-modal"
          aria-label="Close Profile Modal"
          onClick={onClose}
        >
          ✕
        </button>

        <div className="dev-modal-head">
          <div className="dev-modal-avatar">
            <img
              ref={animeImgRef}
              src="/assets/idcard_avatar.jpeg"
              alt="Amrutha Avatar"
              id="modal-avatar-anime"
              className="modal-portrait-img"
              style={{ transition: 'opacity 0.3s ease' }}
            />
            <img
              ref={realImgRef}
              src="/assets/ammu.webp"
              alt="Amrutha Photograph"
              id="modal-avatar-real"
              className="modal-portrait-img"
              style={{ opacity: 0, transition: 'opacity 0.3s ease' }}
            />
            <canvas
              ref={canvasRef}
              id="modal-pixel-loop-canvas"
              className="modal-pixel-canvas"
              style={{ display: 'none' }}
            ></canvas>
          </div>
          <h2 id="dev-modal-title" className="dev-modal-name">
            Divvela Jyoti Venkata Amrutha
          </h2>
          <div className="dev-modal-subtitle">
            Frontend Developer &bull; B.Tech Student &bull; CodeXa Agency
          </div>
        </div>

        <div className="dev-modal-details">
          <div className="dev-detail-item">
            <span className="dev-detail-label">Institution</span>
            <span className="dev-detail-val">Narasaraopeta Engineering College</span>
          </div>
          <div className="dev-detail-item">
            <span className="dev-detail-label">Current Status</span>
            <span className="dev-detail-val" style={{ color: 'var(--accent)' }}>
              Pursuing B.Tech Degree
            </span>
          </div>
          <div className="dev-detail-item">
            <span className="dev-detail-label">Class XII Intermediate</span>
            <span className="dev-detail-val">Sri Chaitanya (Score: 96.3%)</span>
          </div>
          <div className="dev-detail-item">
            <span className="dev-detail-label">Class X Schooling</span>
            <span className="dev-detail-val">Sri Chaitanya (Score: 95.0%)</span>
          </div>
          <div className="dev-detail-item">
            <span className="dev-detail-label">Core Technologies</span>
            <span className="dev-detail-val">HTML5, CSS3, JavaScript, C</span>
          </div>
          <div className="dev-detail-item">
            <span className="dev-detail-label">GitHub Account</span>
            <span className="dev-detail-val">amruthadivvela-droid</span>
          </div>
        </div>

        {/* Public Footer Actions */}
        <div className="modal-actions" style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
          <a
            href={GITHUB_PROFILE}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
            style={{ minHeight: 46, padding: '0 24px', fontSize: '13.5px', flex: 1, justifyContent: 'center' }}
          >
            Open GitHub Profile ↗
          </a>
          <button
            type="button"
            id="dev-modal-resume-btn"
            className="btn btn-outline"
            style={{ minHeight: 46, padding: '0 24px', fontSize: '13.5px', flex: 1, justifyContent: 'center' }}
            onClick={() => {
              onClose();
              onOpenResume();
            }}
          >
            Inspect Resume 📄
          </button>
        </div>
      </div>
    </div>
  );
}
