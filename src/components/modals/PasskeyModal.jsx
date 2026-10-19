import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const VALID_KEYS = ['170311', '2026', 'sakura', 'amrutha'];

export default function PasskeyModal({ isOpen, onClose }) {
  const [passkey, setPasskey] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const clean = passkey.trim().toLowerCase();

    if (VALID_KEYS.includes(clean)) {
      sessionStorage.setItem(
        'amrutha_admin_session',
        JSON.stringify({
          authenticated: true,
          role: 'owner',
          timestamp: Date.now()
        })
      );
      setError('');
      setPasskey('');
      onClose();
      navigate('/admin');
    } else {
      setError('Access denied. Please check your access key.');
      setPasskey('');
    }
  };

  return (
    <div
      className="modal-backdrop is-open"
      id="passkey-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="passkey-modal-title"
      onClick={onClose}
    >
      <div className="modal-card passkey-modal-card" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          id="close-passkey-modal"
          className="modal-close-btn"
          aria-label="Close passkey modal"
          onClick={onClose}
        >
          ✕
        </button>

        <div className="passkey-icon-wrap" aria-hidden="true">
          <svg viewBox="0 0 100 100" width="44" height="44">
            <defs>
              <radialGradient id="modalFlowerGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#fff5f8" />
                <stop offset="50%" stopColor="#fba8bf" />
                <stop offset="100%" stopColor="#d56586" />
              </radialGradient>
            </defs>
            <g transform="translate(50,50)">
              <path d="M 0,-5 C -10,-28 -22,-28 -19,-15 C -16,-3 -5,0 0,0 C 5,0 16,-3 19,-15 C 22,-28 10,-28 0,-5 Z" fill="url(#modalFlowerGrad)" />
              <path d="M 0,-5 C -10,-28 -22,-28 -19,-15 C -16,-3 -5,0 0,0 C 5,0 16,-3 19,-15 C 22,-28 10,-28 0,-5 Z" fill="url(#modalFlowerGrad)" transform="rotate(72)" />
              <path d="M 0,-5 C -10,-28 -22,-28 -19,-15 C -16,-3 -5,0 0,0 C 5,0 16,-3 19,-15 C 22,-28 10,-28 0,-5 Z" fill="url(#modalFlowerGrad)" transform="rotate(144)" />
              <path d="M 0,-5 C -10,-28 -22,-28 -19,-15 C -16,-3 -5,0 0,0 C 5,0 16,-3 19,-15 C 22,-28 10,-28 0,-5 Z" fill="url(#modalFlowerGrad)" transform="rotate(216)" />
              <path d="M 0,-5 C -10,-28 -22,-28 -19,-15 C -16,-3 -5,0 0,0 C 5,0 16,-3 19,-15 C 22,-28 10,-28 0,-5 Z" fill="url(#modalFlowerGrad)" transform="rotate(288)" />
              <circle cx="0" cy="0" r="5.5" fill="#ffd57a" stroke="#d56586" strokeWidth="1.2" />
            </g>
          </svg>
        </div>

        <h3 id="passkey-modal-title" className="passkey-title">
          Restricted Access
        </h3>
        <p className="passkey-desc">Enter your access key to continue.</p>

        <form id="passkey-form" className="passkey-form" onSubmit={handleSubmit} noValidate autoComplete="off">
          <div className="passkey-input-wrap">
            <input
              type="password"
              id="passkey-input"
              className={`passkey-input ${error ? 'input-error' : ''}`}
              placeholder="••••••••"
              aria-label="Access Key"
              value={passkey}
              onChange={(e) => {
                setPasskey(e.target.value);
                if (error) setError('');
              }}
              autoFocus
              required
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div id="passkey-error" className="passkey-error" role="alert">
              {error}
            </div>
          )}

          <button
            type="submit"
            id="unlock-btn"
            className="btn btn-primary"
            style={{ width: '100%', minHeight: '48px', fontSize: '14px', fontWeight: 800, justifyContent: 'center' }}
          >
            Unlock Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}
