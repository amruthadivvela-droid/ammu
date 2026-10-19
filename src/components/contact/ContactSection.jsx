import React, { useState } from 'react';
import VisitingCardModal from './VisitingCardModal';

const GITHUB_PROFILE = 'https://github.com/amruthadivvela-droid';
const INSTAGRAM_URL = 'https://www.instagram.com/amrutha.d344/';
const WHATSAPP_URL = 'https://wa.me/919032316792';
const CONTACT_EMAIL = 'amruthadivvela@gmail.com';

export default function ContactSection() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formFeedback, setFormFeedback] = useState({ text: '', type: '' });
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [visitingCardOpen, setVisitingCardOpen] = useState(false);
  const [lastWhatsappUrl, setLastWhatsappUrl] = useState('');

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } catch {
      window.location.href = `mailto:${CONTACT_EMAIL}`;
    }
  };

  const handleCopyPhone = async () => {
    try {
      await navigator.clipboard.writeText('+91 90323 16792');
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2000);
    } catch {
      window.open(WHATSAPP_URL, '_blank');
    }
  };

  const handleMouseMove = (e) => {
    if (window.innerWidth < 768 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
    const rotX = (-(y - rect.height / 2) / rect.height * 9).toFixed(2);
    const rotY = ((x - rect.width / 2) / rect.width * 9).toFixed(2);
    card.style.transform = `perspective(850px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-6px) scale3d(1.02, 1.02, 1.02)`;
  };

  const handleMouseLeave = (e) => {
    e.currentTarget.style.transform = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedMessage = message.trim();

    if (!trimmedName) {
      setFormFeedback({ text: 'Please enter your name to connect! ♡', type: 'error' });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmedEmail || !emailRegex.test(trimmedEmail)) {
      setFormFeedback({ text: 'Please provide a valid email address so I can reply! ♡', type: 'error' });
      return;
    }

    if (!trimmedMessage) {
      setFormFeedback({ text: 'Please describe your requirements or ideas! ♡', type: 'error' });
      return;
    }

    setFormFeedback({ text: '', type: '' });
    setIsSubmitting(true);

    const idempotencyKey = `sub_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Idempotency-Key': idempotencyKey
        },
        body: JSON.stringify({
          name: trimmedName,
          email: trimmedEmail,
          message: trimmedMessage
        })
      });

      const result = await response.json();

      if (!response.ok || !result.readyForWhatsApp) {
        throw new Error(result.message || 'Unable to prepare your enquiry. Please check connection and retry.');
      }

      setLastWhatsappUrl(result.whatsappUrl);
      setVisitingCardOpen(true);
      setFormFeedback({
        text: 'Enquiry sent successfully! Visiting card generated and WhatsApp ready 🌸',
        type: 'success'
      });

      // Navigate to WhatsApp
      setTimeout(() => {
        window.location.assign(result.whatsappUrl);
      }, 1200);

    } catch (err) {
      console.error('[Contact Error]', err);
      setFormFeedback({
        text: err.message || 'Unable to submit enquiry. Please try again.',
        type: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="contact-section" aria-label="Contact Amrutha">
      <div className="contact-container reveal visible">
        <div className="section-kicker" style={{ justifyContent: 'center' }}>
          06 / SAY HELLO
        </div>
        <h2>
          Let's build something <em>extraordinary</em>
        </h2>
        <p className="contact-desc">
          Have an exciting project, technical leadership enquiry, or want to collaborate with CodeXa Agency? Send a message through the royal washi envelope or connect directly.
        </p>

        <div className="contact-main-grid">
          {/* LEFT COLUMN: Social Contact Composition */}
          <div
            className="social-contact-composition tilt-card"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <div className="composition-header">
              <div className="composition-avatar-frame">
                <img
                  src="/assets/idcard_avatar.jpeg"
                  alt="Amrutha Avatar"
                  className="composition-avatar-img"
                />
                <span className="composition-online-status" title="Active & Open for Work"></span>
              </div>
              <div className="composition-meta">
                <h3 className="composition-name">Divvela Jyoti Venkata Amrutha</h3>
                <div className="composition-title">
                  <span className="comp-badge-cto">CTO</span>
                  <span className="comp-title-text">CodeXa Agency &bull; Frontend Engineer</span>
                </div>
                <div className="composition-location">
                  <span>📍 Andhra Pradesh, India</span>
                  <span className="composition-dot">•</span>
                  <span>🌸 IST (UTC+05:30)</span>
                </div>
              </div>
            </div>

            <div className="composition-quote">
              <p>
                "Turning complex requirements into graceful, human-centered digital experiences with Sakura beauty."
              </p>
            </div>

            {/* Direct Communication Channels */}
            <div className="composition-channels">
              <a
                href={GITHUB_PROFILE}
                target="_blank"
                rel="noopener noreferrer"
                className="channel-item"
                aria-label="GitHub Profile"
              >
                <div className="channel-icon-wrap icon-gh">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                </div>
                <div className="channel-info">
                  <span className="channel-title">GitHub</span>
                  <span className="channel-val">amruthadivvela-droid</span>
                </div>
                <span className="channel-arrow">↗</span>
              </a>

              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="channel-item"
                aria-label="Instagram Profile"
              >
                <div className="channel-icon-wrap icon-ig">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </div>
                <div className="channel-info">
                  <span className="channel-title">Instagram</span>
                  <span className="channel-val">@amrutha.d344</span>
                </div>
                <span className="channel-arrow">↗</span>
              </a>

              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="channel-item"
                aria-label="WhatsApp Direct Chat"
              >
                <div className="channel-icon-wrap icon-wa">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                  </svg>
                </div>
                <div className="channel-info">
                  <span className="channel-title">WhatsApp Direct</span>
                  <span className="channel-val">+91 90323 16792</span>
                </div>
                <span className="channel-arrow">↗</span>
              </a>

              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="channel-item"
                aria-label="Direct Email"
              >
                <div className="channel-icon-wrap icon-mail">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                </div>
                <div className="channel-info">
                  <span className="channel-title">Email</span>
                  <span className="channel-val">{CONTACT_EMAIL}</span>
                </div>
                <span className="channel-arrow">↗</span>
              </a>
            </div>

            {/* Quick Copy Buttons */}
            <div className="composition-copy-actions">
              <button
                type="button"
                className="btn-copy-chip"
                id="copy-email-btn"
                onClick={handleCopyEmail}
              >
                <span>{copiedEmail ? 'Copied! ♡' : 'Copy Email'}</span> {copiedEmail ? '✓' : '📋'}
              </button>
              <button
                type="button"
                className="btn-copy-chip"
                id="copy-phone-btn"
                onClick={handleCopyPhone}
              >
                <span>{copiedPhone ? 'Copied! ♡' : 'Copy WhatsApp'}</span> {copiedPhone ? '✓' : '💬'}
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: Royal Washi Envelope Enquiry Form */}
          <div
            className="envelope-form-container tilt-card"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <div className="envelope-flap-accent" aria-hidden="true"></div>

            <div className="envelope-form-inner">
              <div className="envelope-form-header">
                <span className="envelope-kicker">✦ DIRECT INBOX &bull; INSTANT DISPATCH ✦</span>
                <h3 className="envelope-title">Send a Royal Sakura Note</h3>
                <p className="envelope-desc">
                  Your enquiry triggers automatic owner notifications via Resend and opens WhatsApp with your pre-formatted note.
                </p>
              </div>

              <form id="contact-form" className="envelope-form" onSubmit={handleSubmit} noValidate>
                <div className="form-group">
                  <label htmlFor="contact-name">Your Name *</label>
                  <input
                    type="text"
                    id="contact-name"
                    name="name"
                    className="form-input"
                    placeholder="e.g. Maya Chen"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="contact-email">Your Email *</label>
                  <input
                    type="email"
                    id="contact-email"
                    name="email"
                    className="form-input"
                    placeholder="e.g. maya@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="contact-msg">What are your requirements? *</label>
                  <textarea
                    id="contact-msg"
                    name="requirements"
                    className="form-input form-textarea"
                    rows="4"
                    placeholder="Tell me about your idea, project scope, timeline, or collaboration..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  id="submit-enquiry-btn"
                  className="btn btn-primary btn-submit-envelope"
                  disabled={isSubmitting}
                >
                  <span id="submit-btn-lbl">
                    {isSubmitting ? 'Sending enquiry... 🌸' : 'Contact Me ♡'}
                  </span>
                </button>

                <p className="form-guarantee-note">
                  Submitting securely records your enquiry, sends an email notification, and prepares your message for WhatsApp.
                </p>

                {formFeedback.text && (
                  <div
                    id="form-feedback"
                    className="form-feedback"
                    style={{
                      display: 'block',
                      color: formFeedback.type === 'error' ? '#e0526e' : 'var(--accent)',
                      marginTop: '12px',
                      fontWeight: 700
                    }}
                  >
                    {formFeedback.text}
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>

        <span className="contact-signoff">See you around! ♡</span>
      </div>

      <VisitingCardModal
        isOpen={visitingCardOpen}
        onClose={() => setVisitingCardOpen(false)}
        name={name}
        email={email}
        message={message}
        whatsappUrl={lastWhatsappUrl}
      />
    </section>
  );
}
