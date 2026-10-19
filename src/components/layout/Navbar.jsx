import React, { useState, useEffect, useRef } from 'react';

export const THEMES = [
  { id: 'sakura', name: 'Sakura Dream', emoji: '🌸', color: '#d56586' },
  { id: 'lavender', name: 'Lavender Mist', emoji: '🦋', color: '#9b7bd3' },
  { id: 'strawberry', name: 'Strawberry Milk', emoji: '🍓', color: '#e84a6f' },
  { id: 'midnight', name: 'Midnight Sakura', emoji: '🌙', color: '#f08ba5' },
  { id: 'matcha', name: 'Matcha Garden', emoji: '🍃', color: '#5c946e' },
  { id: 'ocean', name: 'Ocean Pearl', emoji: '🐚', color: '#3a93a5' },
  { id: 'peach', name: 'Peach Blossom', emoji: '🍑', color: '#e88759' },
  { id: 'moonlight', name: 'Moonlight Blue', emoji: '⭐', color: '#7ba2e8' },
  { id: 'rosegold', name: 'Rose Gold', emoji: '🥀', color: '#c97b88' },
  { id: 'candypop', name: 'Candy Pop', emoji: '🍬', color: '#ff6b8b' }
];

export default function Navbar({ currentTheme, onThemeChange }) {
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setThemeDropdownOpen(false);
      }
    };
    document.addEventListener('pointerdown', handleClickOutside);
    return () => document.removeEventListener('pointerdown', handleClickOutside);
  }, []);

  // IntersectionObserver for active section highlight
  useEffect(() => {
    const sections = ['about', 'education', 'work', 'skills', 'contact']
      .map(id => document.getElementById(id))
      .filter(Boolean);

    if (!('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.35 }
    );

    sections.forEach(s => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const handleLinkClick = (id) => {
    setMobileMenuOpen(false);
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="site-header">
      <nav className="nav-pill" aria-label="Main navigation">
        <a className="brand" href="#top" aria-label="Amrutha home">
          Amrutha <span className="flower-icon" aria-hidden="true">✿</span>
        </a>

        <div className={`nav-links ${mobileMenuOpen ? 'menu-open' : ''}`} id="nav-links">
          <a
            href="#about"
            className={activeSection === 'about' ? 'active' : ''}
            onClick={(e) => { e.preventDefault(); handleLinkClick('about'); }}
          >
            About
          </a>
          <a
            href="#education"
            className={activeSection === 'education' ? 'active' : ''}
            onClick={(e) => { e.preventDefault(); handleLinkClick('education'); }}
          >
            Education
          </a>
          <a
            href="#work"
            className={activeSection === 'work' ? 'active' : ''}
            onClick={(e) => { e.preventDefault(); handleLinkClick('work'); }}
          >
            Work
          </a>
          <a
            href="#skills"
            className={activeSection === 'skills' ? 'active' : ''}
            onClick={(e) => { e.preventDefault(); handleLinkClick('skills'); }}
          >
            Skills
          </a>
          <a
            href="#contact"
            className={activeSection === 'contact' ? 'active' : ''}
            onClick={(e) => { e.preventDefault(); handleLinkClick('contact'); }}
          >
            Contact
          </a>
        </div>

        <div className="nav-actions">
          <span className="nav-separator" aria-hidden="true"></span>

          <div className="theme-wrap" ref={dropdownRef}>
            <button
              type="button"
              className="theme-button"
              id="theme-toggle"
              aria-expanded={themeDropdownOpen}
              aria-haspopup="true"
              onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
            >
              <span className="sun-circle" aria-hidden="true">☼</span>
              <span className="theme-label">Themes</span>
              <span className="theme-chevron" aria-hidden="true">⌄</span>
            </button>

            {themeDropdownOpen && (
              <div className="theme-dropdown" id="theme-dropdown" role="menu">
                <div className="theme-heading">
                  <span aria-hidden="true">✿</span> Choose your mood <span aria-hidden="true">♡</span>
                </div>
                <div className="theme-options">
                  {THEMES.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      className={`theme-opt ${currentTheme === t.id ? 'active' : ''}`}
                      data-theme={t.id}
                      role="menuitem"
                      onClick={() => {
                        onThemeChange(t.id);
                        setThemeDropdownOpen(false);
                      }}
                    >
                      <span className="theme-dot" style={{ background: t.color }}></span>
                      <span>{t.emoji} {t.name}</span>
                      <span className="theme-check">✓</span>
                    </button>
                  ))}
                </div>
                <div className="theme-foot">a little color, a little magic ♡</div>
              </div>
            )}
          </div>

          <button
            type="button"
            className="menu-button"
            id="mobile-menu-btn"
            aria-label="Toggle mobile navigation menu"
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </nav>
    </header>
  );
}
