import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const VALID_KEYS = ['170311', '2026', 'sakura', 'amrutha'];

export default function AdminLogin() {
  const [passkey, setPasskey] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // If already logged in, redirect directly to /admin
    try {
      const session = sessionStorage.getItem('amrutha_admin_session');
      if (session) {
        const parsed = JSON.parse(session);
        if (parsed && (parsed.authenticated || parsed.role === 'owner')) {
          navigate('/admin', { replace: true });
        }
      }
    } catch {}
  }, [navigate]);

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
      navigate('/admin', { replace: true });
    } else {
      setError('Invalid access key. Please verify and try again.');
      setPasskey('');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        position: 'relative'
      }}
    >
      <div
        className="modal-card passkey-modal-card"
        style={{
          boxShadow: '0 20px 60px rgba(213, 101, 134, 0.25)',
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: '28px',
          padding: '40px 32px',
          width: 'min(440px, 100%)'
        }}
      >
        <div className="passkey-icon-wrap" aria-hidden="true" style={{ textAlign: 'center', marginBottom: '16px' }}>
          <svg viewBox="0 0 100 100" width="56" height="56">
            <defs>
              <radialGradient id="loginFlowerGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#fff5f8" />
                <stop offset="50%" stopColor="#fba8bf" />
                <stop offset="100%" stopColor="#d56586" />
              </radialGradient>
            </defs>
            <g transform="translate(50,50)">
              <path d="M 0,-5 C -10,-28 -22,-28 -19,-15 C -16,-3 -5,0 0,0 C 5,0 16,-3 19,-15 C 22,-28 10,-28 0,-5 Z" fill="url(#loginFlowerGrad)" />
              <path d="M 0,-5 C -10,-28 -22,-28 -19,-15 C -16,-3 -5,0 0,0 C 5,0 16,-3 19,-15 C 22,-28 10,-28 0,-5 Z" fill="url(#loginFlowerGrad)" transform="rotate(72)" />
              <path d="M 0,-5 C -10,-28 -22,-28 -19,-15 C -16,-3 -5,0 0,0 C 5,0 16,-3 19,-15 C 22,-28 10,-28 0,-5 Z" fill="url(#loginFlowerGrad)" transform="rotate(144)" />
              <path d="M 0,-5 C -10,-28 -22,-28 -19,-15 C -16,-3 -5,0 0,0 C 5,0 16,-3 19,-15 C 22,-28 10,-28 0,-5 Z" fill="url(#loginFlowerGrad)" transform="rotate(216)" />
              <path d="M 0,-5 C -10,-28 -22,-28 -19,-15 C -16,-3 -5,0 0,0 C 5,0 16,-3 19,-15 C 22,-28 10,-28 0,-5 Z" fill="url(#loginFlowerGrad)" transform="rotate(288)" />
              <circle cx="0" cy="0" r="5.5" fill="#ffd57a" stroke="#d56586" strokeWidth="1.2" />
            </g>
          </svg>
        </div>

        <h2 className="passkey-title" style={{ textAlign: 'center', fontSize: '24px', fontWeight: 800, marginBottom: '6px' }}>
          Sakura CMS Access
        </h2>
        <p className="passkey-desc" style={{ textAlign: 'center', color: 'var(--muted)', fontSize: '14px', marginBottom: '24px' }}>
          Enter administrator passkey to access portfolio controls.
        </p>

        <form onSubmit={handleSubmit} noValidate autoComplete="off">
          <div className="passkey-input-wrap" style={{ marginBottom: '16px' }}>
            <input
              type="password"
              className={`passkey-input ${error ? 'input-error' : ''}`}
              placeholder="••••••••"
              aria-label="Admin Passkey"
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
            <div className="passkey-error" role="alert" style={{ marginBottom: '16px', color: '#e0526e', fontSize: '13px', fontWeight: 700, textAlign: 'center' }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', minHeight: '48px', fontSize: '14px', fontWeight: 800, justifyContent: 'center' }}
          >
            Unlock Sakura Dashboard
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <Link
            to="/"
            style={{ color: 'var(--accent)', fontSize: '13.5px', fontWeight: 700, textDecoration: 'none' }}
          >
            ← Back to Public Portfolio
          </Link>
        </div>
      </div>
    </div>
  );
}
