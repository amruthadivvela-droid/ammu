import React, { useEffect, useState, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  ArrowRight, ArrowUpRight, Code2, Github, FileText, Heart, Menu, X, 
  Sparkles, Sun, Moon, Download, ExternalLink, ChevronDown, Check, 
  Copy, GraduationCap, Award, BookOpen, Layers, Users, Lightbulb, 
  Send, Sparkle
} from 'lucide-react';
import './styles.css';

const GITHUB_PROFILE = 'https://github.com/amruthadivvela-droid';

const THEMES = [
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

export function App() {
  const [theme, setTheme] = useState('sakura');
  const [themeOpen, setThemeOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [devModalOpen, setDevModalOpen] = useState(false);
  const [resumeModalOpen, setResumeModalOpen] = useState(false);
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [bubbleQuote, setBubbleQuote] = useState("Let's explore! 🌸");
  const [copied, setCopied] = useState(false);
  const [contactFeedback, setContactFeedback] = useState('');
  const [isRealPhoto, setIsRealPhoto] = useState(false);
  const [realPhotoSrc, setRealPhotoSrc] = useState('public/assets/ammu.webp');
  const [passkeyModalOpen, setPasskeyModalOpen] = useState(false);
  const [passkeyInput, setPasskeyInput] = useState('');
  const [passkeyError, setPasskeyError] = useState('');
  const [passkeyVisible, setPasskeyVisible] = useState(false);
  const [adminFilter, setAdminFilter] = useState('all');
  const [adminSearch, setAdminSearch] = useState('');
  const [adminToast, setAdminToast] = useState('');
  const [students, setStudents] = useState([
    { id: '21NEC01', name: 'Aarav Sharma', status: 'present', avg: '96%', tag: '' },
    { id: '21NEC02', name: 'Divvela J. V. Amrutha', status: 'present', avg: '98%', tag: 'Lead Architect' },
    { id: '21NEC03', name: 'Bhavya Karanam', status: 'absent', avg: '82%', tag: '' },
    { id: '21NEC04', name: 'Chaitanya Rao', status: 'present', avg: '94%', tag: '' },
    { id: '21NEC05', name: 'Divya Mandava', status: 'present', avg: '91%', tag: '' },
    { id: '21NEC06', name: 'Eshwar Prasad', status: 'absent', avg: '78%', tag: '' },
    { id: '21NEC07', name: 'Farhan Ahmed', status: 'present', avg: '93%', tag: '' },
    { id: '21NEC08', name: 'Gayatri Somu', status: 'present', avg: '95%', tag: '' },
    { id: '21NEC09', name: 'Harsh Vardhan', status: 'present', avg: '89%', tag: '' },
    { id: '21NEC10', name: 'Ishita Nair', status: 'present', avg: '97%', tag: '' }
  ]);

  const quotes = [
    "Let’s explore! 🌸",
    "Welcome to my world! ✨",
    "A little creativity goes a long way. ♡",
    "Let's build something lovely! ✿",
    "Thoughtful code, happy users! 💻"
  ];

  useEffect(() => {
    try {
      const saved = localStorage.getItem('amrutha-theme');
      if (saved) setTheme(saved);
    } catch (e) {}
  }, []);

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    try {
      localStorage.setItem('amrutha-theme', newTheme);
    } catch (e) {}
    setThemeOpen(false);
  };

  const cycleQuote = () => {
    const nextIdx = (quotes.indexOf(bubbleQuote) + 1) % quotes.length;
    setBubbleQuote(quotes[nextIdx]);
  };

  const copyGitHub = async () => {
    try {
      await navigator.clipboard.writeText(GITHUB_PROFILE);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch (e) {
      window.open(GITHUB_PROFILE, '_blank');
    }
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    const name = e.target.elements['contact-name'].value.trim();
    const email = e.target.elements['contact-email'].value.trim();
    const msg = e.target.elements['contact-msg'].value.trim();

    if (!name || !email || !msg) {
      setContactFeedback('Please fill out all fields! ♡');
      return;
    }

    const subject = encodeURIComponent(`Portfolio Message from ${name}`);
    const body = encodeURIComponent(`Hi Amrutha,\n\n${msg}\n\nFrom: ${name} (${email})`);
    window.location.href = `mailto:amrutha.divvela@example.com?subject=${subject}&body=${body}`;
    setContactFeedback('Opening your email client... Thank you! ✿');
    e.target.reset();
  };

  return (
    <div className="portfolio-app">
      {/* Floating Navbar */}
      <header className="site-header">
        <nav className="nav-pill" aria-label="Main navigation">
          <a className="brand" href="#top">
            Amrutha <span className="flower-icon">✿</span>
          </a>

          <div className={`nav-links ${menuOpen ? 'menu-open' : ''}`} id="nav-links">
            <a href="#about" onClick={() => setMenuOpen(false)}>About</a>
            <a href="#education" onClick={() => setMenuOpen(false)}>Education</a>
            <a href="#work" onClick={() => setMenuOpen(false)}>Work</a>
            <a href="#skills" onClick={() => setMenuOpen(false)}>Skills</a>
            <a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a>
          </div>

          <div className="nav-actions">
            <button 
              type="button" 
              className="rotating-admin-flower-btn" 
              onClick={() => {
                if (sessionStorage.getItem('amrutha_admin_auth') === 'true') {
                  setAdminModalOpen(true);
                } else {
                  setPasskeyModalOpen(true);
                }
              }}
              aria-label="Admin Portal Passkey Gateway"
              title="Admin Portal (Passkey Protected)"
            >
              <svg className="admin-spinning-flower" viewBox="0 0 100 100" width="22" height="22" aria-hidden="true">
                <g transform="translate(50,50)">
                  <path d="M 0,-5 C -10,-28 -22,-28 -19,-15 C -16,-3 -5,0 0,0 C 5,0 16,-3 19,-15 C 22,-28 10,-28 0,-5 Z" fill="#d56586"/>
                  <path d="M 0,-5 C -10,-28 -22,-28 -19,-15 C -16,-3 -5,0 0,0 C 5,0 16,-3 19,-15 C 22,-28 10,-28 0,-5 Z" fill="#d56586" transform="rotate(72)"/>
                  <path d="M 0,-5 C -10,-28 -22,-28 -19,-15 C -16,-3 -5,0 0,0 C 5,0 16,-3 19,-15 C 22,-28 10,-28 0,-5 Z" fill="#d56586" transform="rotate(144)"/>
                  <path d="M 0,-5 C -10,-28 -22,-28 -19,-15 C -16,-3 -5,0 0,0 C 5,0 16,-3 19,-15 C 22,-28 10,-28 0,-5 Z" fill="#d56586" transform="rotate(216)"/>
                  <path d="M 0,-5 C -10,-28 -22,-28 -19,-15 C -16,-3 -5,0 0,0 C 5,0 16,-3 19,-15 C 22,-28 10,-28 0,-5 Z" fill="#d56586" transform="rotate(288)"/>
                  <circle cx="0" cy="0" r="5.5" fill="#ffd57a" stroke="#d56586" strokeWidth="1.2"/>
                </g>
              </svg>
              <span>Admin</span>
            </button>

            <button 
              type="button" 
              className="nav-admin-btn" 
              onClick={() => {
                if (sessionStorage.getItem('amrutha_admin_auth') === 'true') {
                  setAdminModalOpen(true);
                } else {
                  setPasskeyModalOpen(true);
                }
              }}
              aria-label="Open Smart Classroom Admin Dashboard"
            >
              <span>Portal</span>
            </button>
            <span className="nav-separator" aria-hidden="true"></span>
            
            <div className="theme-wrap">
              <button 
                type="button" 
                className="theme-button" 
                onClick={() => setThemeOpen(!themeOpen)}
                aria-expanded={themeOpen}
              >
                <span className="sun-circle">☼</span>
                <span className="theme-label">Themes</span>
                <span className="theme-chevron">⌄</span>
              </button>

              {themeOpen && (
                <div className="theme-dropdown">
                  <div className="theme-heading">
                    <span>✿</span> Choose your mood <span>♡</span>
                  </div>
                  <div className="theme-options">
                    {THEMES.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        className={`theme-opt ${theme === t.id ? 'active' : ''}`}
                        onClick={() => handleThemeChange(t.id)}
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
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle mobile menu"
            >
              {menuOpen ? '✕' : '☰'}
            </button>
          </div>
        </nav>
      </header>

      {/* Main Hero */}
      <main>
        <section id="top" className="hero">
          <div className="hero-wash" aria-hidden="true"></div>
          
          <div className="giant-name-wrap">
            <div className="giant-name" aria-hidden="true">AMRUTHA</div>
          </div>

          {/* Left Content */}
          <div className="hero-copy">
            <div className="hand-intro">
              Hi, I’m Amrutha.<span className="hand-heart">♡</span>
            </div>
            <h1>
              Frontend<br />
              Developer
            </h1>
            <p className="hero-subtitle">
              I turn ideas into thoughtful web experiences.
            </p>
            <div className="hero-actions">
              <a href="#work" className="btn btn-primary">
                Explore my work <span className="btn-arrow">→</span>
              </a>
              <button 
                type="button" 
                className="btn btn-outline" 
                onClick={() => setResumeModalOpen(true)}
              >
                View resume <FileText size={18} style={{ marginLeft: 6 }} />
              </button>
            </div>
          </div>

          {/* Center Character */}
          <div className="character-wrap">
            <img 
              className="character-img"
              src="public/assets/amrutha-character.png" 
              alt="Amrutha character"
              draggable="false"
            />
            <div className="character-shadow" aria-hidden="true"></div>

            <button type="button" className="speech-bubble" onClick={cycleQuote}>
              {bubbleQuote}
            </button>

            <div className="character-sparkles" aria-hidden="true">
              <span>✦</span>
              <span>✧</span>
              <span>✦</span>
            </div>
          </div>

          {/* Hanging Developer ID Card with Realistic Realism & Photo Switcher */}
          <div className="badge-scene">
            <div className="strap strap-a"></div>
            <div className="strap strap-b"></div>
            <div className="lanyard-link"></div>
            <div className="lanyard-clip"></div>

            <div 
              className="dev-id"
              role="button"
              tabIndex={0}
              onClick={() => setDevModalOpen(true)}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setDevModalOpen(true)}
              aria-label="Developer ID Card"
            >
              <div className="badge-hole-slot" aria-hidden="true">
                <div className="clasp-through-loop" aria-hidden="true"></div>
                <div className="clasp-front-lip" aria-hidden="true"></div>
              </div>

              <div className="dev-id-head">
                <div className="id-code">&lt;/&gt;</div>
                <span>DEVELOPER ID</span>
                <span className="id-flower">✿</span>
              </div>

              <div 
                className={`id-photo ${isRealPhoto ? 'show-real' : ''}`}
                onMouseEnter={() => setIsRealPhoto(true)}
                onMouseLeave={() => setIsRealPhoto(false)}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsRealPhoto(!isRealPhoto);
                }}
                title="Hover or tap to reveal real photo"
              >
                <img className="portrait-layer portrait-anime" src="public/assets/amrutha-avatar.png" alt="Amrutha Avatar" />
                <img className="portrait-layer portrait-real" src={realPhotoSrc} alt="Amrutha Real Portrait" />
                
                <div className="photo-controls" onClick={(e) => e.stopPropagation()}>
                  <button 
                    type="button" 
                    className="photo-switch-btn" 
                    onClick={() => setIsRealPhoto(!isRealPhoto)}
                    title="Toggle Portrait Style"
                  >
                    <span>✦</span> <span>{isRealPhoto ? 'Anime Avatar' : 'Real Photo'}</span>
                  </button>
                  <label className="photo-upload-btn" title="Upload custom portrait">
                    <span>📷</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      style={{ display: 'none' }} 
                      onChange={(e) => {
                        const file = e.target.files && e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (ev) => {
                            setRealPhotoSrc(ev.target.result);
                            setIsRealPhoto(true);
                          };
                          reader.readAsDataURL(file);
                        }
                      }} 
                    />
                  </label>
                </div>
              </div>

              <div className="id-name">AMRUTHA</div>
              <div className="id-role">B.Tech Student</div>
              <div className="id-barcode"></div>
              <span className="id-flower-bottom">🌸</span>
              <span className="badge-hint">Click to inspect ↗</span>
            </div>
          </div>

          {/* Corner Sakura Branches */}
          <img src="public/assets/sakura-branch.png" className="sakura-branch-corner branch-left" alt="" aria-hidden="true" />
          <img src="public/assets/sakura-branch.png" className="sakura-branch-corner branch-right" alt="" aria-hidden="true" />
          <div className="hero-bottom-fade"></div>
        </section>

        {/* About Section */}
        <section id="about" className="section about-section">
          <div className="about-intro reveal">
            <div className="section-heading">
              <div className="section-kicker"><span>01</span> / A LITTLE ABOUT ME</div>
              <h2>Curious mind. <em>Creative heart.</em></h2>
            </div>
            <p className="about-intro-text">
              I’m a B.Tech student at Narasaraopeta Engineering College with a deep passion for frontend web development. I love building intuitive, visually delightful user interfaces and learning through hands-on technical projects and teamwork.
            </p>
          </div>

          <div className="about-grid reveal">
            <div className="about-note">
              <div className="note-tape"></div>
              <span className="note-heart">♡</span>
              <h3>Oh, hello there!</h3>
              <p>
                I'm Amrutha, a frontend developer with a soft spot for thoughtful details, charming microinteractions, and web experiences that make people smile.
              </p>
              <span className="signature">made with love, Amrutha ✿</span>
            </div>

            <div className="about-highlights">
              <div className="about-highlight-card">
                <div className="about-icon">✧</div>
                <div>
                  <h4>Design meets development</h4>
                  <p>From visual layout sketches to clean responsive HTML/CSS, I connect aesthetic ideas with solid code.</p>
                </div>
              </div>

              <div className="about-highlight-card">
                <div className="about-icon">♡</div>
                <div>
                  <h4>Details are everything</h4>
                  <p>Intentional spacing, accessible contrast, and smooth micro-animations bring web pages to life.</p>
                </div>
              </div>

              <div className="about-highlight-card">
                <div className="about-icon">✦</div>
                <div>
                  <h4>Always learning</h4>
                  <p>Constantly exploring modern web standards, collaborative tools, and improving with every challenge.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Education Timeline */}
        <section id="education" className="section education-section">
          <div className="section-top reveal">
            <div className="section-heading">
              <div className="section-kicker"><span>02</span> / ACADEMIC JOURNEY</div>
              <h2>Education &amp; <em>milestones.</em></h2>
            </div>
            <div className="section-side-note">Verified academic foundation <span>🌸</span></div>
          </div>

          <div className="education-timeline reveal">
            <div className="timeline-item">
              <div className="timeline-dot">🎓</div>
              <div className="timeline-card">
                <div className="timeline-card-header">
                  <h3 className="timeline-title">Bachelor of Technology (B.Tech)</h3>
                  <span className="timeline-badge">Currently Pursuing</span>
                </div>
                <div className="timeline-institute">Narasaraopeta Engineering College</div>
                <p className="timeline-desc">
                  Studying computer science principles, web application architectures, data structures, and practical software team projects.
                </p>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-dot">✿</div>
              <div className="timeline-card">
                <div className="timeline-card-header">
                  <h3 className="timeline-title">Class XII &mdash; Intermediate (MPC)</h3>
                  <span className="timeline-badge">Score: 96.3%</span>
                </div>
                <div className="timeline-institute">Sri Chaitanya Junior College</div>
                <p className="timeline-desc">
                  Focused in Mathematics, Physics, and Chemistry. Established strong analytical reasoning and rigorous problem-solving habits.
                </p>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-dot">★</div>
              <div className="timeline-card">
                <div className="timeline-card-header">
                  <h3 className="timeline-title">Class X &mdash; Secondary School Certificate</h3>
                  <span className="timeline-badge">Score: 95.0%</span>
                </div>
                <div className="timeline-institute">Sri Chaitanya Techno School</div>
                <p className="timeline-desc">
                  Academic excellence in science, logic, and mathematics with active participation in co-curricular student competitions.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Selected Work */}
        <section id="work" className="section work-section">
          <div className="section-top reveal">
            <div className="section-heading">
              <div className="section-kicker"><span>03</span> / SELECTED WORK</div>
              <h2>Little ideas. <em>Big possibilities.</em></h2>
            </div>
            <div className="section-side-note">A peek into some things I've been building <span>↗</span></div>
          </div>

          <div className="project-filters reveal">
            <button 
              type="button" 
              className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
              onClick={() => setActiveFilter('all')}
            >
              All Projects
            </button>
            <button 
              type="button" 
              className={`filter-btn ${activeFilter === 'team' ? 'active' : ''}`}
              onClick={() => setActiveFilter('team')}
            >
              Team Projects
            </button>
            <button 
              type="button" 
              className={`filter-btn ${activeFilter === 'ai' ? 'active' : ''}`}
              onClick={() => setActiveFilter('ai')}
            >
              AI &amp; Retrieval
            </button>
            <button 
              type="button" 
              className={`filter-btn ${activeFilter === 'web' ? 'active' : ''}`}
              onClick={() => setActiveFilter('web')}
            >
              Web Experiments
            </button>
          </div>

          {/* Primary Featured Project */}
          {(activeFilter === 'all' || activeFilter === 'team') && (
            <article className="featured-project-card reveal">
              <div className="featured-art">
                <div 
                  className="mockup-window" 
                  role="button" 
                  tabIndex={0} 
                  style={{ cursor: 'pointer' }} 
                  onClick={() => setAdminModalOpen(true)}
                  title="Click to launch interactive Admin Dashboard"
                >
                  <div className="mockup-header">
                    <span className="mockup-dot red"></span>
                    <span className="mockup-dot yellow"></span>
                    <span className="mockup-dot green"></span>
                    <span className="mockup-title">attendance-portal.local</span>
                    <span className="mockup-launch-badge">⚡ Live Demo</span>
                  </div>
                  <div className="mockup-body">
                    <div className="mockup-stat-row">
                      <div className="mockup-stat">
                        <div className="mockup-stat-num">{students.length}</div>
                        <div className="mockup-stat-lbl">Total Enrolled</div>
                      </div>
                      <div className="mockup-stat">
                        <div className="mockup-stat-num" style={{ color: '#2ba362' }}>
                          {students.filter(s => s.status === 'present').length}
                        </div>
                        <div className="mockup-stat-lbl">Present Today</div>
                      </div>
                      <div className="mockup-stat">
                        <div className="mockup-stat-num" style={{ color: '#e0526e' }}>
                          {students.length > 0 ? ((students.filter(s => s.status === 'present').length / students.length) * 100).toFixed(1) + '%' : '0%'}
                        </div>
                        <div className="mockup-stat-lbl">Attendance Rate</div>
                      </div>
                    </div>

                    <div className="mockup-list">
                      <div className="mockup-row">
                        <span>CSE-3A &bull; Roll 21NEC01</span>
                        <span className="status-badge status-present">Present ✓</span>
                      </div>
                      <div className="mockup-row">
                        <span>CSE-3A &bull; Roll 21NEC02</span>
                        <span className="status-badge status-present">Present ✓</span>
                      </div>
                      <div className="mockup-row">
                        <span>CSE-3A &bull; Roll 21NEC03</span>
                        <span className="status-badge status-absent">Absent ✗</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="featured-content">
                <div className="project-tag">FEATURED &bull; TEAM PROJECT</div>
                <h3>Smart Classroom Attendance System</h3>
                <p>
                  Designed and developed an intuitive, web-based classroom attendance interface with live status recording, structured roll-call workflows, and clean responsive feedback.
                </p>

                <ul className="feature-bullets">
                  <li><span className="bullet-icon">✿</span> Built semantic frontend layouts using clean HTML5 and CSS3</li>
                  <li><span className="bullet-icon">✿</span> Implemented interactive attendance tracking and dynamic state toggling in JavaScript</li>
                  <li><span className="bullet-icon">✿</span> Collaborated with teammates on modular planning, integration, and user-friendly UX</li>
                </ul>

                <div className="chip-row" style={{ marginBottom: 22 }}>
                  <span className="tech-chip">HTML5</span>
                  <span className="tech-chip">CSS3</span>
                  <span className="tech-chip">JavaScript</span>
                  <span className="tech-chip">Responsive Web</span>
                </div>

                <div className="project-bottom">
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent)' }}>Academic Team Collaboration</span>
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    <button 
                      type="button" 
                      className="btn btn-primary" 
                      onClick={() => setAdminModalOpen(true)}
                      style={{ minHeight: 44, padding: '0 22px', fontSize: 13 }}
                    >
                      Launch Admin Dashboard ⚡
                    </button>
                    <a 
                      href={GITHUB_PROFILE} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="btn btn-outline" 
                      style={{ minHeight: 44, padding: '0 22px', fontSize: 13 }}
                    >
                      View on GitHub ↗
                    </a>
                  </div>
                </div>
              </div>
            </article>
          )}

          {/* Secondary GitHub Repositories Grid */}
          <div className="project-grid">
            {(activeFilter === 'all' || activeFilter === 'ai') && (
              <article className="project-card reveal">
                <div className="project-art art-prompt">
                  <div style={{ background: 'var(--surface)', borderRadius: 18, padding: '22px 28px', width: '80%', boxShadow: '0 12px 30px rgba(0,0,0,0.06)', textAlign: 'center' }}>
                    <span style={{ fontSize: 28, color: 'var(--accent)' }}>✦</span>
                    <div style={{ fontWeight: 900, fontSize: 18, color: 'var(--ink)', margin: '6px 0' }}>Prompt Tech</div>
                    <div style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: 1 }}>DOCUMENT INTELLIGENCE</div>
                  </div>
                </div>
                <div className="project-content">
                  <div className="project-eyebrow">01 &bull; AI &bull; DOCUMENT INTELLIGENCE</div>
                  <div className="project-title-row">
                    <h3>Prompt Tech</h3>
                    <a className="project-arrow" target="_blank" rel="noopener noreferrer" href="https://github.com/amruthadivvela-droid/Prompt-tech">↗</a>
                  </div>
                  <p>Knowledge intelligence experience featuring hybrid document retrieval and grounded question-answering workflows.</p>
                  <div className="project-bottom">
                    <div className="chip-row">
                      <span className="tech-chip">React</span>
                      <span className="tech-chip">TypeScript</span>
                      <span className="tech-chip">AI</span>
                    </div>
                    <a className="live-link" href="https://prompt-tech-chi.vercel.app" target="_blank" rel="noopener noreferrer">Live site ↗</a>
                  </div>
                </div>
              </article>
            )}

            {(activeFilter === 'all' || activeFilter === 'web') && (
              <article className="project-card reveal">
                <div className="project-art art-watch">
                  <div style={{ width: 130, height: 130, borderRadius: 36, background: 'linear-gradient(135deg, #7868a3, #b3a6df)', display: 'grid', placeItems: 'center', boxShadow: '0 14px 28px rgba(110,90,150,0.3)', color: '#fff', fontSize: 36 }}>
                    <span>⌚</span>
                  </div>
                </div>
                <div className="project-content">
                  <div className="project-eyebrow">02 &bull; INTERACTIVE WEB EXPERIMENT</div>
                  <div className="project-title-row">
                    <h3>Watch</h3>
                    <a className="project-arrow" target="_blank" rel="noopener noreferrer" href="https://github.com/amruthadivvela-droid/watch">↗</a>
                  </div>
                  <p>A TypeScript frontend experiment exploring interactive frame components, dynamic dials, and visual micro-details.</p>
                  <div className="project-bottom">
                    <div className="chip-row">
                      <span className="tech-chip">TypeScript</span>
                      <span className="tech-chip">CSS Animations</span>
                    </div>
                    <a className="live-link" href="https://watch-rosy-mu.vercel.app" target="_blank" rel="noopener noreferrer">Live site ↗</a>
                  </div>
                </div>
              </article>
            )}

            {(activeFilter === 'all' || activeFilter === 'web') && (
              <article className="project-card reveal">
                <div className="project-art art-portfolio">
                  <div style={{ background: 'var(--surface)', borderRadius: 18, padding: '22px 28px', width: '78%', boxShadow: '0 12px 30px rgba(0,0,0,0.06)', textAlign: 'center' }}>
                    <div style={{ fontFamily: 'var(--font-hand)', fontSize: 20, color: 'var(--accent)' }}>creative corner ♡</div>
                    <div style={{ fontWeight: 900, fontSize: 24, color: 'var(--ink)' }}>hello, world!</div>
                  </div>
                </div>
                <div className="project-content">
                  <div className="project-eyebrow">03 &bull; PERSONAL WEBSITE</div>
                  <div className="project-title-row">
                    <h3>Portfolio</h3>
                    <a className="project-arrow" target="_blank" rel="noopener noreferrer" href="https://github.com/amruthadivvela-droid/portfolio">↗</a>
                  </div>
                  <p>A personal portfolio codebase showcasing creative layout experiments, fluid typography, and aesthetic presentation work.</p>
                  <div className="project-bottom">
                    <div className="chip-row">
                      <span className="tech-chip">HTML5</span>
                      <span className="tech-chip">CSS3</span>
                      <span className="tech-chip">JavaScript</span>
                    </div>
                    <a className="live-link" href="https://github.com/amruthadivvela-droid/portfolio" target="_blank" rel="noopener noreferrer">GitHub ↗</a>
                  </div>
                </div>
              </article>
            )}

            {(activeFilter === 'all' || activeFilter === 'web') && (
              <article className="project-card reveal">
                <div className="project-art art-sanjay">
                  <div style={{ background: 'var(--surface)', borderRadius: 18, padding: '22px 28px', width: '78%', boxShadow: '0 12px 30px rgba(0,0,0,0.06)', textAlign: 'center' }}>
                    <div style={{ fontSize: 10, letterSpacing: 2, color: '#4a9686', fontWeight: 800 }}>THE WEB IS A CANVAS</div>
                    <div style={{ fontWeight: 900, fontSize: 20, color: 'var(--ink)', margin: '6px 0' }}>Create Beautifully</div>
                  </div>
                </div>
                <div className="project-content">
                  <div className="project-eyebrow">04 &bull; WEB PROJECT</div>
                  <div className="project-title-row">
                    <h3>Sanjay</h3>
                    <a className="project-arrow" target="_blank" rel="noopener noreferrer" href="https://github.com/amruthadivvela-droid/sanjay">↗</a>
                  </div>
                  <p>A published JavaScript frontend web application built with clean component structures and deployed to Vercel.</p>
                  <div className="project-bottom">
                    <div className="chip-row">
                      <span className="tech-chip">JavaScript</span>
                      <span className="tech-chip">Web App</span>
                    </div>
                    <a className="live-link" href="https://sanjay-bachhe-gay.vercel.app" target="_blank" rel="noopener noreferrer">Live site ↗</a>
                  </div>
                </div>
              </article>
            )}
          </div>

          <a className="all-work-link reveal" href={GITHUB_PROFILE} target="_blank" rel="noopener noreferrer">
            More repositories on GitHub <ArrowUpRight size={18} />
          </a>
        </section>

        {/* Skills Section */}
        <section id="skills" className="section skills-section">
          <div className="skills-wrapper reveal">
            <div className="skill-copy">
              <div className="section-heading">
                <div className="section-kicker"><span>04</span> / MY TOOLBOX</div>
                <h2>Skills I'm <em>growing with.</em></h2>
              </div>
              <p>
                Core technologies and development practices I use to build responsive, accessible, and delightful digital interfaces.
              </p>
              <div className="skill-quote">
                “A little curiosity, a lot of creativity.” <span>♡</span>
              </div>
            </div>

            <div className="skills-cloud-container">
              <div className="skill-cluster">
                <div className="skill-cluster-title">Programming Foundation</div>
                <div className="skill-cluster-pills">
                  <div className="skill-pill">
                    <span className="skill-icon">◇</span>
                    <span>C Language</span>
                  </div>
                </div>
              </div>

              <div className="skill-cluster">
                <div className="skill-cluster-title">Frontend Development</div>
                <div className="skill-cluster-pills">
                  <div className="skill-pill">
                    <span className="skill-icon">✿</span>
                    <span>HTML5 Semantic Markup</span>
                  </div>
                  <div className="skill-pill">
                    <span className="skill-icon">✦</span>
                    <span>CSS3 &amp; Modern Layouts</span>
                  </div>
                  <div className="skill-pill">
                    <span className="skill-icon">✧</span>
                    <span>JavaScript (ES6+)</span>
                  </div>
                  <div className="skill-pill">
                    <span className="skill-icon">♡</span>
                    <span>Responsive Web Design</span>
                  </div>
                </div>
              </div>

              <div className="skill-cluster">
                <div className="skill-cluster-title">Practices &amp; Workflows</div>
                <div className="skill-cluster-pills">
                  <div className="skill-pill">
                    <span className="skill-icon">✎</span>
                    <span>UI Implementation</span>
                  </div>
                  <div className="skill-pill">
                    <span className="skill-icon">⌘</span>
                    <span>Git &amp; GitHub</span>
                  </div>
                  <div className="skill-pill">
                    <span className="skill-icon">⚙</span>
                    <span>Problem Solving</span>
                  </div>
                  <div className="skill-pill">
                    <span className="skill-icon">🤝</span>
                    <span>Team Collaboration</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Strengths & Collaboration */}
        <section className="section strengths-section">
          <div className="section-top reveal">
            <div className="section-heading">
              <div className="section-kicker"><span>COLLABORATION</span> / CORE ATTRIBUTES</div>
              <h2>Better ideas <em>bloom together.</em></h2>
            </div>
            <div className="section-side-note">How I work and grow <span>✿</span></div>
          </div>

          <div className="strengths-grid reveal">
            <div className="strength-card">
              <div className="strength-icon">🤝</div>
              <h4>Team Collaboration</h4>
              <p>Thrives in peer groups and pair-programming settings, valuing shared ownership, active listening, and constructive feedback.</p>
            </div>
            <div className="strength-card">
              <div className="strength-icon">🌱</div>
              <h4>Fast Learner</h4>
              <p>Eagerly picks up new frontend concepts, documentation patterns, and design systems with genuine enthusiasm.</p>
            </div>
            <div className="strength-card">
              <div className="strength-icon">🔍</div>
              <h4>Attention to Detail</h4>
              <p>Cares deeply about spacing, typographic rhythm, harmonious colors, and smooth micro-interactions.</p>
            </div>
            <div className="strength-card">
              <div className="strength-icon">💡</div>
              <h4>Problem Solving</h4>
              <p>Approaches UI challenges methodically, breaking complex layouts into modular and maintainable components.</p>
            </div>
            <div className="strength-card">
              <div className="strength-icon">⏱</div>
              <h4>Reliability &amp; Focus</h4>
              <p>Committed to meeting academic milestones and delivering tidy, well-tested code that teammates can rely on.</p>
            </div>
            <div className="strength-card">
              <div className="strength-icon">💬</div>
              <h4>Thoughtful Communication</h4>
              <p>Explains technical decisions clearly and communicates progress openly throughout every project phase.</p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="contact-section">
          <div className="contact-container reveal">
            <div className="section-kicker">05 / SAY HELLO</div>
            <h2>Let's make something<br /><em>lovely together!</em></h2>
            <p className="contact-desc">
              Have an idea, an academic project collaboration, or just want to connect? I’d love to hear from you.
            </p>

            <div className="contact-box tilt-card">
              <div className="contact-stamp" aria-hidden="true">
                <span className="stamp-icon">🌸</span>
                <span className="stamp-text">AIR MAIL</span>
              </div>

              <form className="contact-form" onSubmit={handleContactSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="contact-name">Your Name</label>
                    <input type="text" id="contact-name" name="contact-name" className="form-input" placeholder="What's your name?" required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="contact-email">Your Email</label>
                    <input type="email" id="contact-email" name="contact-email" className="form-input" placeholder="hello@example.com" required />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="contact-msg">Message</label>
                  <textarea id="contact-msg" name="contact-msg" className="form-input" placeholder="Tell me about your idea or say hello! ♡" required></textarea>
                </div>

                <button type="submit" className="btn btn-primary" style={{ margin: '8px auto 0', width: 'min(280px, 100%)' }}>
                  Send message <span className="btn-arrow">♡</span>
                </button>
              </form>

              {contactFeedback && (
                <div style={{ marginTop: 16, fontWeight: 700, color: 'var(--accent)' }}>
                  {contactFeedback}
                </div>
              )}
            </div>

            <div className="contact-actions">
              <a className="btn btn-primary" href={GITHUB_PROFILE} target="_blank" rel="noopener noreferrer">
                Find me on GitHub ↗
              </a>
              <button className="btn btn-outline" type="button" onClick={copyGitHub}>
                {copied ? 'Link copied! ♡' : 'Copy GitHub link'}
              </button>
              <button className="btn btn-outline" type="button" onClick={() => setResumeModalOpen(true)}>
                View Resume 📄
              </button>
            </div>

            <span className="contact-signoff">See you around! ♡</span>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="site-footer">
        <a href="#top" className="footer-brand">Amrutha <span>✿</span></a>
        <p>Built with care, curiosity &amp; a little bit of magic &bull; Divvela Jyoti Venkata Amrutha</p>
        <a href="#top" className="back-to-top">Back to top ↑</a>
      </footer>

      {/* Developer ID Modal */}
      {devModalOpen && (
        <div className="modal-backdrop is-open" onClick={() => setDevModalOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="modal-close-btn" onClick={() => setDevModalOpen(false)}>✕</button>
            <div className="dev-modal-head">
              <div className="dev-modal-avatar">
                <img src="public/assets/amrutha-avatar.png" alt="Amrutha avatar" />
              </div>
              <h2 className="dev-modal-name">Divvela Jyoti Venkata Amrutha</h2>
              <div className="dev-modal-subtitle">Frontend Developer &bull; B.Tech Student</div>
            </div>

            <div className="dev-modal-details">
              <div className="dev-detail-item">
                <span className="dev-detail-label">Institution</span>
                <span className="dev-detail-val">Narasaraopeta Engineering College</span>
              </div>
              <div className="dev-detail-item">
                <span className="dev-detail-label">Current Status</span>
                <span className="dev-detail-val" style={{ color: 'var(--accent)' }}>Pursuing B.Tech Degree</span>
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

            <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
              <button 
                type="button" 
                className="btn btn-primary" 
                style={{ width: '100%', minHeight: 46, fontSize: 13, justifyContent: 'center' }}
                onClick={() => { setDevModalOpen(false); setAdminModalOpen(true); }}
              >
                <span>⚡</span> Launch Attendance Admin Dashboard
              </button>
              <a href={GITHUB_PROFILE} target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ minHeight: 44, padding: '0 20px', fontSize: 13, flex: 1, justifyContent: 'center' }}>
                Open GitHub Profile ↗
              </a>
              <button 
                type="button" 
                className="btn btn-outline" 
                style={{ minHeight: 44, padding: '0 20px', fontSize: 13, flex: 1, justifyContent: 'center' }}
                onClick={() => { setDevModalOpen(false); setResumeModalOpen(true); }}
              >
                Inspect Resume 📄
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Resume Viewer Modal */}
      {resumeModalOpen && (
        <div className="modal-backdrop is-open" onClick={() => setResumeModalOpen(false)}>
          <div className="modal-card" style={{ width: 'min(720px, 100%)' }} onClick={(e) => e.stopPropagation()}>
            <button type="button" className="modal-close-btn" onClick={() => setResumeModalOpen(false)}>✕</button>
            
            <div className="resume-modal-body">
              <span style={{ fontSize: 42, display: 'block', marginBottom: 6 }}>🌸</span>
              <div className="section-kicker" style={{ justifyContent: 'center' }}>OFFICIAL RESUME</div>
              <h2 style={{ fontSize: 32, fontWeight: 900 }}>
                Amrutha's Resume <span>♡</span>
              </h2>
              <p style={{ color: 'var(--muted)', fontSize: 14, marginTop: 4 }}>
                Divvela Jyoti Venkata Amrutha &bull; B.Tech Student &bull; Frontend Developer
              </p>

              <div className="resume-embed-container">
                <iframe src="public/resume.pdf" className="resume-iframe" title="Amrutha Resume Preview"></iframe>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', gap: 14, flexWrap: 'wrap', marginTop: 16 }}>
                <a href="public/resume.pdf" download="Divvela_Amrutha_Resume.pdf" className="btn btn-primary" style={{ minHeight: 48, padding: '0 26px', fontSize: 13 }}>
                  Download PDF ⤓
                </a>
                <a href="public/resume.pdf" target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ minHeight: 48, padding: '0 24px', fontSize: 13 }}>
                  Open in New Tab ↗
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Passkey Security Gateway Modal */}
      {passkeyModalOpen && (
        <div className="modal-backdrop is-open" onClick={() => setPasskeyModalOpen(false)}>
          <div className="modal-card passkey-modal-card" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="modal-close-btn" onClick={() => setPasskeyModalOpen(false)}>✕</button>
            <div className="passkey-icon-wrap">
              <svg className="admin-spinning-flower" viewBox="0 0 100 100" width="44" height="44" aria-hidden="true">
                <g transform="translate(50,50)">
                  <path d="M 0,-6 C -12,-36 -28,-36 -24,-20 C -20,-4 -6,0 0,0 C 6,0 20,-4 24,-20 C 28,-36 12,-36 0,-6 Z" fill="#d56586"/>
                  <path d="M 0,-6 C -12,-36 -28,-36 -24,-20 C -20,-4 -6,0 0,0 C 6,0 20,-4 24,-20 C 28,-36 12,-36 0,-6 Z" fill="#d56586" transform="rotate(72)"/>
                  <path d="M 0,-6 C -12,-36 -28,-36 -24,-20 C -20,-4 -6,0 0,0 C 6,0 20,-4 24,-20 C 28,-36 12,-36 0,-6 Z" fill="#d56586" transform="rotate(144)"/>
                  <path d="M 0,-6 C -12,-36 -28,-36 -24,-20 C -20,-4 -6,0 0,0 C 6,0 20,-4 24,-20 C 28,-36 12,-36 0,-6 Z" fill="#d56586" transform="rotate(216)"/>
                  <path d="M 0,-6 C -12,-36 -28,-36 -24,-20 C -20,-4 -6,0 0,0 C 6,0 20,-4 24,-20 C 28,-36 12,-36 0,-6 Z" fill="#d56586" transform="rotate(288)"/>
                  <circle cx="0" cy="0" r="7" fill="#ffd57a" stroke="#d56586" strokeWidth="1.5"/>
                </g>
              </svg>
            </div>
            <h3 className="passkey-title">Admin Passkey Gateway</h3>
            <p className="passkey-desc">Enter your authorization passkey to access Smart Classroom Attendance &amp; Analytics.</p>
            
            <form 
              className="passkey-form" 
              onSubmit={(e) => {
                e.preventDefault();
                const validKeys = ['2026', 'sakura', 'amrutha', 'admin'];
                if (validKeys.includes(passkeyInput.trim().toLowerCase())) {
                  sessionStorage.setItem('amrutha_admin_auth', 'true');
                  setPasskeyModalOpen(false);
                  setPasskeyInput('');
                  setPasskeyError('');
                  setAdminModalOpen(true);
                } else {
                  setPasskeyError('Invalid passkey. Hint: try 2026 or sakura ✿');
                }
              }}
            >
              <div className="passkey-input-wrap">
                <input 
                  type={passkeyVisible ? "text" : "password"}
                  className={`passkey-input ${passkeyError ? 'input-error' : ''}`}
                  placeholder="Enter passkey (e.g. 2026)"
                  value={passkeyInput}
                  onChange={(e) => {
                    setPasskeyInput(e.target.value);
                    if (passkeyError) setPasskeyError('');
                  }}
                  autoFocus
                />
                <button 
                  type="button" 
                  className="passkey-vis-btn" 
                  onClick={() => setPasskeyVisible(!passkeyVisible)}
                  aria-label="Toggle password visibility"
                >
                  {passkeyVisible ? '🔒' : '👁'}
                </button>
              </div>
              {passkeyError && <div className="passkey-error">{passkeyError}</div>}
              
              <button type="submit" className="btn btn-primary magnetic-btn" style={{ width: '100%', minHeight: '48px', justifyContent: 'center' }}>
                <span>Unlock Admin Portal ✦</span>
              </button>
              
              <div className="passkey-hint">
                <span>🔒 Authorized demo passkeys: <code>2026</code>, <code>sakura</code>, <code>amrutha</code>, or <code>admin</code></span>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Dashboard Modal */}
      {adminModalOpen && (
        <div className="modal-backdrop is-open" onClick={() => setAdminModalOpen(false)}>
          <div className="modal-card admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="modal-close-btn" onClick={() => setAdminModalOpen(false)}>✕</button>

            <div className="admin-modal-header">
              <div className="admin-header-badge">
                <span className="live-dot" aria-hidden="true"></span>
                <span>ADMIN ATTENDANCE PORTAL &bull; LIVE SYSTEM</span>
              </div>
              <h3 className="admin-modal-title">Smart Classroom Attendance System</h3>
              <p className="admin-modal-sub">
                <strong>Section:</strong> CSE-3A &bull; <strong>Department:</strong> Computer Science &amp; Engineering &bull; <strong>Lead Architect:</strong> Divvela Jyoti Venkata Amrutha
              </p>
              <div className="admin-meta-strip">
                <span className="admin-time-badge">🕒 Today: 09:30 AM &bull; Period 1 (Web Engineering)</span>
                <span className="admin-session-pill">Academic Year 2026-27</span>
              </div>
            </div>

            {/* Metrics */}
            <div className="admin-stats-grid">
              <div className="admin-stat-card">
                <div className="admin-stat-icon">👥</div>
                <div>
                  <div className="admin-stat-val">{students.length}</div>
                  <div className="admin-stat-label">Total Enrolled</div>
                </div>
              </div>
              <div className="admin-stat-card stat-present">
                <div className="admin-stat-icon">✓</div>
                <div>
                  <div className="admin-stat-val">{students.filter(s => s.status === 'present').length}</div>
                  <div className="admin-stat-label">Present Today</div>
                </div>
              </div>
              <div className="admin-stat-card stat-absent">
                <div className="admin-stat-icon">✗</div>
                <div>
                  <div className="admin-stat-val">{students.filter(s => s.status === 'absent').length}</div>
                  <div className="admin-stat-label">Absent</div>
                </div>
              </div>
              <div className="admin-stat-card stat-rate">
                <div className="admin-stat-icon">📈</div>
                <div>
                  <div className="admin-stat-val">
                    {students.length > 0 ? ((students.filter(s => s.status === 'present').length / students.length) * 100).toFixed(1) + '%' : '0%'}
                  </div>
                  <div className="admin-stat-label">Attendance Rate</div>
                </div>
              </div>
            </div>

            {/* Toolbar */}
            <div className="admin-toolbar">
              <div className="admin-search-wrap">
                <span className="search-icon">🔍</span>
                <input 
                  type="text" 
                  className="admin-search-input" 
                  placeholder="Search by student name or roll number (e.g. 21NEC01)..."
                  value={adminSearch}
                  onChange={(e) => setAdminSearch(e.target.value)}
                />
                {adminSearch && (
                  <button type="button" className="search-clear-btn" onClick={() => setAdminSearch('')}>✕</button>
                )}
              </div>

              <div className="admin-filter-group" role="tablist">
                <button 
                  type="button" 
                  className={`admin-filter-btn ${adminFilter === 'all' ? 'active' : ''}`}
                  onClick={() => setAdminFilter('all')}
                >
                  All ({students.length})
                </button>
                <button 
                  type="button" 
                  className={`admin-filter-btn ${adminFilter === 'present' ? 'active' : ''}`}
                  onClick={() => setAdminFilter('present')}
                >
                  Present ({students.filter(s => s.status === 'present').length})
                </button>
                <button 
                  type="button" 
                  className={`admin-filter-btn ${adminFilter === 'absent' ? 'active' : ''}`}
                  onClick={() => setAdminFilter('absent')}
                >
                  Absent ({students.filter(s => s.status === 'absent').length})
                </button>
              </div>
            </div>

            {/* Batch Actions */}
            <div className="admin-actions-bar">
              <button 
                type="button" 
                className="btn-admin-action"
                onClick={() => {
                  setStudents(students.map(s => ({ ...s, status: 'present' })));
                  setAdminToast('✓ All 10 students marked Present for Period 1!');
                  setTimeout(() => setAdminToast(''), 3500);
                }}
              >
                <span>✓</span> Mark All Present
              </button>
              <button 
                type="button" 
                className="btn-admin-action"
                onClick={() => {
                  setStudents(students.map((s, idx) => ({ ...s, status: (idx === 2 || idx === 5) ? 'absent' : 'present' })));
                  setAdminToast('↺ Attendance roll call reset to scheduled roster state.');
                  setTimeout(() => setAdminToast(''), 3500);
                }}
              >
                <span>↺</span> Reset Roll Call
              </button>
              <button 
                type="button" 
                className="btn-admin-action btn-admin-accent"
                onClick={() => {
                  let csv = 'Roll No,Student Name,Status,Semester Average,Class,Department,Date\n';
                  const dStr = new Date().toLocaleDateString('en-US');
                  students.forEach(s => {
                    csv += `${s.id},"${s.name}",${s.status.toUpperCase()},${s.avg},CSE-3A,Computer Science,${dStr}\n`;
                  });
                  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `Attendance_Report_CSE3A_${new Date().toISOString().slice(0, 10)}.csv`;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                  setAdminToast('📥 Attendance CSV report downloaded successfully!');
                  setTimeout(() => setAdminToast(''), 3500);
                }}
              >
                <span>📥</span> Export CSV Report
              </button>
              <button 
                type="button" 
                className="btn-admin-action"
                onClick={() => {
                  setAdminToast('☁ Syncing live attendance with Narasaraopeta Engineering College Portal... Done!');
                  setTimeout(() => setAdminToast(''), 3500);
                }}
              >
                <span>☁</span> Sync College Server
              </button>
            </div>

            {/* Roster */}
            <div className="admin-roster-wrap">
              <div className="admin-roster-header">
                <span>STUDENT ROSTER</span>
                <span className="roster-live-hint">Click status pills below to toggle live attendance</span>
              </div>
              <div className="admin-roster-list">
                {students
                  .filter(s => {
                    const matchFilter = adminFilter === 'all' || s.status === adminFilter;
                    const matchSearch = !adminSearch || 
                      s.name.toLowerCase().includes(adminSearch.toLowerCase()) || 
                      s.id.toLowerCase().includes(adminSearch.toLowerCase());
                    return matchFilter && matchSearch;
                  })
                  .map(student => {
                    const initials = student.name.split(' ').map(n => n[0]).slice(0, 2).join('');
                    return (
                      <div key={student.id} className="admin-student-row">
                        <div className="student-info">
                          <div className="student-avatar">{initials}</div>
                          <div className="student-details">
                            <div className="student-name">
                              {student.name}
                              {student.tag && <span className="student-tag">{student.tag}</span>}
                            </div>
                            <div className="student-sub">Roll No: <strong>{student.id}</strong> &bull; Semester Avg: {student.avg}</div>
                          </div>
                        </div>
                        <div className="status-toggle-group">
                          <button 
                            type="button" 
                            className={`status-pill-btn pill-present ${student.status === 'present' ? 'active' : ''}`}
                            onClick={() => setStudents(students.map(s => s.id === student.id ? { ...s, status: 'present' } : s))}
                            title="Mark Present"
                          >
                            Present ✓
                          </button>
                          <button 
                            type="button" 
                            className={`status-pill-btn pill-absent ${student.status === 'absent' ? 'active' : ''}`}
                            onClick={() => setStudents(students.map(s => s.id === student.id ? { ...s, status: 'absent' } : s))}
                            title="Mark Absent"
                          >
                            Absent ✗
                          </button>
                          <button 
                            type="button" 
                            className={`status-pill-btn pill-late ${student.status === 'late' ? 'active' : ''}`}
                            onClick={() => setStudents(students.map(s => s.id === student.id ? { ...s, status: 'late' } : s))}
                            title="Mark Late"
                          >
                            Late ⏰
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Toast */}
            {adminToast && <div className="admin-toast">{adminToast}</div>}

            {/* Footer */}
            <div className="admin-modal-footer">
              <div className="admin-arch-note">
                <span>💡 <strong>Architecture Note:</strong> Built with semantic HTML5, reactive Vanilla JavaScript DOM state management, and real-time roll-call recalculations. Contributed by Amrutha for college lab automation.</span>
              </div>
              <div className="admin-footer-links">
                <a href={GITHUB_PROFILE} target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ minHeight: 38, fontSize: 12.5, padding: '0 18px' }}>
                  View Source Code ↗
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const rootEl = document.getElementById('root');
if (rootEl) {
  createRoot(rootEl).render(<App />);
}
