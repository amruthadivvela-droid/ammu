import React from 'react';

export default function ResumeModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div
      className="modal-backdrop is-open"
      id="resume-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="resume-title"
      onClick={onClose}
    >
      <div
        className="modal-card"
        style={{ width: 'min(720px, 100%)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          id="close-resume-modal"
          className="modal-close-btn"
          aria-label="Close resume viewer"
          onClick={onClose}
        >
          ✕
        </button>

        <div className="resume-modal-body">
          <span style={{ fontSize: '42px', display: 'block', marginBottom: '6px' }}>🌸</span>
          <div className="section-kicker" style={{ justifyContent: 'center' }}>
            OFFICIAL RESUME
          </div>
          <h2 id="resume-title" style={{ fontSize: '32px', fontWeight: 900 }}>
            Amrutha's Resume <span>♡</span>
          </h2>
          <p style={{ color: 'var(--muted)', fontSize: '14px', marginTop: '4px' }}>
            Divvela Jyoti Venkata Amrutha &bull; B.Tech Student &bull; Frontend Developer
          </p>

          <div className="resume-embed-container">
            <iframe
              src="/resume.pdf"
              className="resume-iframe"
              title="Amrutha Resume Preview"
            ></iframe>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '14px',
              flexWrap: 'wrap',
              marginTop: '16px'
            }}
          >
            <a
              href="/resume.pdf"
              download="Divvela_Amrutha_Resume.pdf"
              className="btn btn-primary"
              style={{ minHeight: '48px', padding: '0 26px', fontSize: '13px' }}
            >
              Download PDF ⤓
            </a>
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline"
              style={{ minHeight: '48px', padding: '0 24px', fontSize: '13px' }}
            >
              Open in New Tab ↗
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
