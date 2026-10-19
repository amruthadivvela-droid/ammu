import React, { useRef, useEffect } from 'react';

export default function VisitingCardModal({ isOpen, onClose, name, email, message, whatsappUrl }) {
  const canvasRef = useRef(null);

  const drawCard = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = 1080;
    const h = 1350;

    // Card Background
    const bgGrad = ctx.createLinearGradient(0, 0, w, h);
    bgGrad.addColorStop(0, '#fffbf7');
    bgGrad.addColorStop(0.5, '#fff2f6');
    bgGrad.addColorStop(1, '#ffeaf1');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // Subtle Decorative Grid
    ctx.strokeStyle = 'rgba(213, 101, 134, 0.08)';
    ctx.lineWidth = 1;
    for (let x = 60; x < w; x += 60) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 60; y < h; y += 60) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Outer & Inner Borders
    ctx.strokeStyle = '#d56586';
    ctx.lineWidth = 6;
    ctx.strokeRect(50, 50, w - 100, h - 100);

    ctx.strokeStyle = 'rgba(230, 188, 88, 0.7)';
    ctx.lineWidth = 2.5;
    ctx.strokeRect(62, 62, w - 124, h - 124);

    // Corner Floral Accents
    function drawCornerBlossom(cx, cy) {
      ctx.save();
      ctx.translate(cx, cy);
      for (let a = 0; a < 5; a++) {
        ctx.rotate((Math.PI * 2) / 5);
        ctx.beginPath();
        ctx.ellipse(0, -18, 11, 18, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(245, 164, 189, 0.85)';
        ctx.fill();
      }
      ctx.beginPath();
      ctx.arc(0, 0, 7, 0, Math.PI * 2);
      ctx.fillStyle = '#ffd57a';
      ctx.fill();
      ctx.restore();
    }

    drawCornerBlossom(90, 90);
    drawCornerBlossom(w - 90, 90);
    drawCornerBlossom(90, h - 90);
    drawCornerBlossom(w - 90, h - 90);

    // Header: Brand & Identity
    ctx.textAlign = 'center';
    ctx.fillStyle = '#d56586';
    ctx.font = 'bold 54px Outfit, sans-serif';
    ctx.fillText('Amrutha ✿', w / 2, 175);

    ctx.fillStyle = '#6b4b58';
    ctx.font = '700 28px Outfit, sans-serif';
    ctx.fillText('Chief Technology Officer at CodeXa Agency', w / 2, 222);

    ctx.fillStyle = '#8f6e7c';
    ctx.font = '500 22px Outfit, sans-serif';
    ctx.fillText('Frontend Engineer • Creative Web Architect', w / 2, 258);

    // Decorative Badge
    ctx.fillStyle = 'rgba(213, 101, 134, 0.12)';
    ctx.beginPath();
    ctx.roundRect(w / 2 - 270, 290, 540, 46, 23);
    ctx.fill();

    ctx.fillStyle = '#ba5372';
    ctx.font = 'bold 20px Outfit, sans-serif';
    ctx.fillText('OFFICIAL DIGITAL VISITING CARD & ENQUIRY', w / 2, 320);

    // Content Box
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.beginPath();
    ctx.roundRect(100, 370, w - 200, 710, 28);
    ctx.fill();
    ctx.strokeStyle = 'rgba(213, 101, 134, 0.22)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Visitor Info
    const visitorName = name.trim() || 'Kind Visitor';
    const visitorEmail = email.trim() || 'amruthadivvela@gmail.com';
    const reqText =
      message.trim() ||
      'Exploring opportunities for creative web engineering, frontend architecture, and technical collaborations. 🌸';

    ctx.textAlign = 'left';
    ctx.fillStyle = '#ba5372';
    ctx.font = 'bold 24px Outfit, sans-serif';
    ctx.fillText('COLLABORATION ENQUIRY FROM:', 150, 440);

    ctx.fillStyle = '#2b1c24';
    ctx.font = 'bold 36px Outfit, sans-serif';
    ctx.fillText(visitorName, 150, 490);

    ctx.fillStyle = '#8f6e7c';
    ctx.font = '500 24px Outfit, sans-serif';
    ctx.fillText(`Contact: ${visitorEmail}`, 150, 532);

    ctx.strokeStyle = 'rgba(213, 101, 134, 0.18)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(150, 570);
    ctx.lineTo(w - 150, 570);
    ctx.stroke();

    ctx.fillStyle = '#ba5372';
    ctx.font = 'bold 24px Outfit, sans-serif';
    ctx.fillText('PROJECT PROPOSAL & MESSAGE:', 150, 625);

    ctx.fillStyle = '#3a2530';
    ctx.font = '400 27px Outfit, sans-serif';

    const maxLineWidth = w - 300;
    const lineHeight = 42;
    const words = reqText.split(/\s+/);
    let line = '';
    let curY = 675;
    const maxY = 1010;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxLineWidth && n > 0) {
        ctx.fillText(line.trim(), 150, curY);
        line = words[n] + ' ';
        curY += lineHeight;
        if (curY > maxY) {
          ctx.fillText('...', 150, curY);
          break;
        }
      } else {
        line = testLine;
      }
    }
    if (curY <= maxY && line.trim()) {
      ctx.fillText(line.trim(), 150, curY);
    }

    // Footer
    ctx.textAlign = 'center';
    ctx.fillStyle = '#d56586';
    ctx.font = 'bold 32px Caveat, cursive, sans-serif';
    ctx.fillText('Thank you for connecting! ♡', w / 2, 1150);

    ctx.fillStyle = '#7a5a68';
    ctx.font = '600 22px Outfit, sans-serif';
    ctx.fillText('Divvela Amrutha • WhatsApp: +91 90323 16792 • CodeXa Agency', w / 2, 1205);
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(drawCard, 50);
    }
  }, [isOpen, name, email, message]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.toBlob((blob) => {
      if (!blob) return;
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'Amrutha_Sakura_Visiting_Card.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(a.href);
    }, 'image/png');
  };

  const handleShare = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.toBlob(async (blob) => {
      if (!blob) return;
      const cardFile = new File([blob], 'Amrutha_Visiting_Card.png', { type: 'image/png' });
      const shareText = `Official CodeXa Visiting Card for ${name || 'a visitor'} - Amrutha Portfolio`;

      if (navigator.canShare && navigator.canShare({ files: [cardFile] })) {
        try {
          await navigator.share({
            title: 'Amrutha Visiting Card',
            text: shareText,
            files: [cardFile]
          });
        } catch (err) {}
      } else {
        handleDownload();
      }
    }, 'image/png');
  };

  if (!isOpen) return null;

  return (
    <div
      className="modal-backdrop is-open"
      id="visiting-card-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="visiting-card-modal-title"
      onClick={onClose}
    >
      <div className="modal-card visiting-card-modal-card" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="modal-close-btn"
          id="close-visiting-card-modal"
          aria-label="Close Visiting Card"
          onClick={onClose}
        >
          ✕
        </button>

        <div className="visiting-card-modal-head">
          <div className="section-kicker" style={{ justifyContent: 'center' }}>
            VISITING CARD CREATED 🌸
          </div>
          <h2
            id="visiting-card-modal-title"
            style={{ fontFamily: 'var(--font-display)', fontSize: '24px', margin: '4px 0 8px' }}
          >
            Your Personalized Sakura Visiting Card
          </h2>
          <p style={{ fontSize: '13.5px', color: 'var(--muted)', margin: '0 auto', maxWidth: '440px' }}>
            Official CodeXa Chief Technology Officer visiting card, customized with your project enquiry details.
          </p>
        </div>

        <div className="visiting-card-canvas-wrap" style={{ margin: '20px auto', maxWidth: '380px' }}>
          <canvas
            ref={canvasRef}
            id="visiting-card-canvas"
            className="visiting-card-canvas"
            width="1080"
            height="1350"
          ></canvas>
        </div>

        <div
          className="visiting-card-modal-actions"
          style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}
        >
          <button
            type="button"
            className="btn btn-primary"
            id="download-card-btn"
            style={{ minHeight: '46px', padding: '0 22px' }}
            onClick={handleDownload}
          >
            <span>Download High-Res (PNG)</span> 📥
          </button>
          <button
            type="button"
            className="btn btn-outline"
            id="share-card-btn"
            style={{ minHeight: '46px', padding: '0 22px' }}
            onClick={handleShare}
          >
            <span>Share Visiting Card</span> ↗
          </button>
          {whatsappUrl && (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline"
              id="proceed-dispatch-btn"
              style={{ minHeight: '46px', padding: '0 22px' }}
            >
              <span id="proceed-btn-lbl">Continue to WhatsApp 💬</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
