import React, { useEffect, useState, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  ArrowRight, ArrowUpRight, Code2, Github, FileText, Heart, Menu, X, 
  Sparkles, Download, ExternalLink, ChevronDown, Check, 
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
  const [activeFilter, setActiveFilter] = useState('all');
  const [bubbleQuote, setBubbleQuote] = useState("Let's explore! 🌸");
  const [copied, setCopied] = useState(false);
  
  // Passkey Modal (Restricted Access)
  const [passkeyModalOpen, setPasskeyModalOpen] = useState(false);
  const [passkeyInput, setPasskeyInput] = useState('');
  const [passkeyError, setPasskeyError] = useState('');

  // Contact Requirements Flow
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMsg, setContactMsg] = useState('');
  const [contactChannel, setContactChannel] = useState('whatsapp');
  const [contactFeedback, setContactFeedback] = useState('');
  const cardCanvasRef = useRef(null);

  // Profile Modal Automatic Looping Pixel Dissolve
  const [modalStage, setModalStage] = useState('anime'); // 'anime' | 'dissolving-to-real' | 'real' | 'dissolving-to-anime'
  const pixelLoopCanvasRef = useRef(null);
  const loopTimerRef = useRef(null);
  const loopAnimRef = useRef(null);

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

  // Passkey Authentication Gateway
  const handlePasskeySubmit = (e) => {
    e.preventDefault();
    const entered = passkeyInput.trim().toLowerCase();
    if (['2026', 'sakura', 'amrutha'].includes(entered)) {
      sessionStorage.setItem('amrutha_admin_session', JSON.stringify({
        authenticated: true,
        role: 'owner',
        timestamp: Date.now()
      }));
      setPasskeyModalOpen(false);
      window.location.href = 'admin.html';
    } else {
      setPasskeyError('Access denied. Please try again.');
      setPasskeyInput('');
    }
  };

  // Double-tap tracker for hidden admin flower
  const lastTapRef = useRef(0);
  const handleFlowerTouchEnd = (e) => {
    const now = Date.now();
    if (now - lastTapRef.current < 380) {
      e.preventDefault();
      e.stopPropagation();
      setPasskeyModalOpen(true);
    }
    lastTapRef.current = now;
  };

  // Dynamic 1080 x 1350 Canvas Visiting Card Generator
  const drawVisitingCard = () => {
    const canvas = cardCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = 1080;
    const h = 1350;

    // Background gradient
    const bgGrad = ctx.createLinearGradient(0, 0, w, h);
    bgGrad.addColorStop(0, '#fffbf7');
    bgGrad.addColorStop(0.5, '#fff2f6');
    bgGrad.addColorStop(1, '#ffeaf1');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // Subtle grid
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

    // Header
    ctx.textAlign = 'center';
    ctx.fillStyle = '#d56586';
    ctx.font = 'bold 54px Outfit, sans-serif';
    ctx.fillText('Amrutha ✿', w / 2, 175);

    ctx.fillStyle = '#6b4b58';
    ctx.font = '600 28px Outfit, sans-serif';
    ctx.fillText('Frontend Developer • Creative Technologist', w / 2, 225);

    // Banner
    ctx.fillStyle = 'rgba(213, 101, 134, 0.12)';
    ctx.beginPath();
    ctx.roundRect(w / 2 - 270, 260, 540, 50, 25);
    ctx.fill();

    ctx.fillStyle = '#ba5372';
    ctx.font = 'bold 22px Outfit, sans-serif';
    ctx.fillText('A LITTLE NOTE FROM YOUR VISITOR', w / 2, 293);

    // Content Card
    ctx.fillStyle = 'rgba(255, 255, 255, 0.88)';
    ctx.beginPath();
    ctx.roundRect(100, 360, w - 200, 720, 28);
    ctx.fill();
    ctx.strokeStyle = 'rgba(213, 101, 134, 0.22)';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.textAlign = 'left';
    ctx.fillStyle = '#ba5372';
    ctx.font = 'bold 26px Outfit, sans-serif';
    ctx.fillText('FROM:', 150, 435);

    ctx.fillStyle = '#2b1c24';
    ctx.font = 'bold 36px Outfit, sans-serif';
    ctx.fillText(contactName.trim() || 'A Kind Visitor', 150, 485);

    if (contactEmail.trim()) {
      ctx.fillStyle = '#8f6e7c';
      ctx.font = '500 24px Outfit, sans-serif';
      ctx.fillText(`Email: ${contactEmail.trim()}`, 150, 528);
    }

    ctx.strokeStyle = 'rgba(213, 101, 134, 0.18)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(150, 565);
    ctx.lineTo(w - 150, 565);
    ctx.stroke();

    ctx.fillStyle = '#ba5372';
    ctx.font = 'bold 26px Outfit, sans-serif';
    ctx.fillText('REQUIREMENTS & MESSAGE:', 150, 625);

    ctx.fillStyle = '#3a2530';
    ctx.font = '400 28px Outfit, sans-serif';

    const reqText = contactMsg.trim() || 'Looking to connect and discuss frontend web development, design ideas, or creative collaborations! 🌸';
    const words = reqText.split(/\s+/);
    let line = '';
    let curY = 680;
    const maxLineWidth = w - 300;
    const lineHeight = 44;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      if (ctx.measureText(testLine).width > maxLineWidth && n > 0) {
        ctx.fillText(line.trim(), 150, curY);
        line = words[n] + ' ';
        curY += lineHeight;
        if (curY > 1010) {
          ctx.fillText('...', 150, curY);
          break;
        }
      } else {
        line = testLine;
      }
    }
    if (curY <= 1010 && line.trim()) {
      ctx.fillText(line.trim(), 150, curY);
    }

    // Footer
    ctx.textAlign = 'center';
    ctx.fillStyle = '#d56586';
    ctx.font = 'bold 32px Caveat, cursive, sans-serif';
    ctx.fillText('Thank you for visiting! ♡', w / 2, 1150);

    ctx.fillStyle = '#7a5a68';
    ctx.font = '600 22px Outfit, sans-serif';
    ctx.fillText("Amrutha's Creative World • github.com/amruthadivvela-droid", w / 2, 1205);
  };

  useEffect(() => {
    drawVisitingCard();
  }, [contactName, contactEmail, contactMsg, theme]);

  const downloadCardPng = () => {
    const canvas = cardCanvasRef.current;
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

  const handleShareCard = async () => {
    const canvas = cardCanvasRef.current;
    if (!canvas) return;
    canvas.toBlob(async (blob) => {
      if (!blob) return;
      const cardFile = new File([blob], 'Amrutha_Visiting_Card.png', { type: 'image/png' });
      if (navigator.canShare && navigator.canShare({ files: [cardFile] })) {
        try {
          await navigator.share({
            title: 'Note for Amrutha',
            text: `Hi Amrutha, here are my requirements from ${contactName || 'a visitor'}!`,
            files: [cardFile]
          });
        } catch (e) {}
      } else {
        downloadCardPng();
        setContactFeedback('Digital Visiting Card downloaded! You can attach it directly to WhatsApp. 🌸');
      }
    }, 'image/png');
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!contactName.trim() || !contactMsg.trim()) {
      setContactFeedback('Please provide your name and requirements! ♡');
      return;
    }

    if (contactChannel === 'whatsapp') {
      const waPhone = '919032316792';
      const prefilled = `Hi Amrutha! I visited your portfolio and would like to connect.\n\nName: ${contactName.trim()}${contactEmail.trim() ? `\nEmail: ${contactEmail.trim()}` : ''}\n\nMy Requirements:\n${contactMsg.trim()}\n\nI'd love to discuss this with you.\n\nThanks!`;

      downloadCardPng();
      window.open(`https://wa.me/${waPhone}?text=${encodeURIComponent(prefilled)}`, '_blank', 'noopener,noreferrer');
      setContactFeedback('Opening WhatsApp with your requirements... Thank you! ✿');
    } else {
      if (!contactEmail.includes('@')) {
        setContactFeedback('Please provide a valid email address! ♡');
        return;
      }
      const subject = encodeURIComponent(`Portfolio Enquiry from ${contactName.trim()}`);
      const body = encodeURIComponent(`Hi Amrutha,\n\nName: ${contactName.trim()}\nEmail: ${contactEmail.trim()}\n\nRequirements:\n${contactMsg.trim()}`);
      window.location.href = `mailto:amrutha.divvela@example.com?subject=${subject}&body=${body}`;
      downloadCardPng();
      setContactFeedback('✓ Opening your email client to send your enquiry. ✿');
    }
  };

  // Automatic Looping Pixel Dissolve in Profile Modal
  useEffect(() => {
    if (!devModalOpen) {
      if (loopTimerRef.current) clearTimeout(loopTimerRef.current);
      if (loopAnimRef.current) cancelAnimationFrame(loopAnimRef.current);
      setModalStage('anime');
      return;
    }

    let isRunning = true;
    const runCycle = () => {
      if (!isRunning) return;
      setModalStage('anime');

      loopTimerRef.current = setTimeout(() => {
        if (!isRunning) return;
        setModalStage('dissolving-to-real');

        loopTimerRef.current = setTimeout(() => {
          if (!isRunning) return;
          setModalStage('real');

          loopTimerRef.current = setTimeout(() => {
            if (!isRunning) return;
            setModalStage('dissolving-to-anime');

            loopTimerRef.current = setTimeout(() => {
              if (!isRunning) return;
              runCycle();
            }, 800);
          }, 2000);
        }, 800);
      }, 2000);
    };

    runCycle();

    return () => {
      isRunning = false;
      if (loopTimerRef.current) clearTimeout(loopTimerRef.current);
    };
  }, [devModalOpen]);

  return (
    <div className="portfolio-app">
      {/* Floating Navbar: STRICT public layout (Amrutha ✿ | About Education Work Skills Contact | ☼ Themes) */}
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
                <span>View resume</span>
                <FileText size={14} className="icon-inline" />
              </button>
            </div>
          </div>

          {/* Anime Chibi Character */}
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

          {/* Unified Hanging Developer ID Assembly & Hidden Admin Entry */}
          <div className="badge-scene" aria-label="Interactive Developer ID card">
            <svg className="lanyard-hardware-svg" viewBox="0 0 290 440" aria-hidden="true">
              <defs>
                <linearGradient id="reactLanyardA" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#ffb8cc"/>
                  <stop offset="50%" stopColor="#f59eb7"/>
                  <stop offset="100%" stopColor="#d56586"/>
                </linearGradient>
                <linearGradient id="reactLanyardB" x1="1" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ffd5e2"/>
                  <stop offset="50%" stopColor="#f59eb7"/>
                  <stop offset="100%" stopColor="#ba5372"/>
                </linearGradient>
                <linearGradient id="reactGold" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#fff0c2"/>
                  <stop offset="40%" stopColor="#e6bc58"/>
                  <stop offset="70%" stopColor="#b88a20"/>
                  <stop offset="100%" stopColor="#7a570b"/>
                </linearGradient>
              </defs>

              <path d="M 45 -40 C 70 100, 115 220, 142 275" stroke="url(#reactLanyardA)" strokeWidth="26" strokeLinecap="round" fill="none"/>
              <path d="M 45 -40 C 70 100, 115 220, 142 275" stroke="#fff" strokeWidth="1.5" strokeDasharray="3 4" strokeOpacity="0.6" fill="none"/>
              <path d="M 245 -40 C 220 100, 175 220, 148 275" stroke="url(#reactLanyardB)" strokeWidth="26" strokeLinecap="round" fill="none"/>
              <path d="M 245 -40 C 220 100, 175 220, 148 275" stroke="#fff" strokeWidth="1.5" strokeDasharray="3 4" strokeOpacity="0.6" fill="none"/>

              <rect x="127" y="268" width="36" height="18" rx="7" fill="url(#reactGold)" stroke="#8c6414" strokeWidth="1.5"/>
              <rect x="139" y="286" width="12" height="20" rx="4" fill="url(#reactGold)" stroke="#7a570b" strokeWidth="1.2"/>
              <path d="M 145 306 L 145 342" stroke="url(#reactGold)" strokeWidth="7" strokeLinecap="round"/>
              <circle cx="145" cy="342" r="7.5" fill="none" stroke="url(#reactGold)" strokeWidth="4.5"/>
              <path d="M 141 336 C 141 346, 149 346, 149 336" fill="none" stroke="#fff0c2" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>

            <div 
              className="dev-id"
              role="button"
              tabIndex={0}
              onClick={(e) => {
                if (e.target.closest('.id-admin-flower')) return;
                setDevModalOpen(true);
              }}
              onKeyDown={(e) => {
                if (e.target.closest('.id-admin-flower')) return;
                if (e.key === 'Enter' || e.key === ' ') setDevModalOpen(true);
              }}
              aria-label="Amrutha Developer ID Badge"
            >
              <div className="badge-hole-slot" aria-hidden="true"></div>

              <div className="dev-id-head">
                <div className="id-code">&lt;/&gt;</div>
                <span>DEVELOPER ID</span>
                <span className="dev-corner-flower flower-rot-a" aria-hidden="true">✿</span>
              </div>

              {/* Clean Anime Portrait (no badges, no camera overlays) */}
              <div className="id-photo-frame">
                <img 
                  className="portrait-layer portrait-anime" 
                  src="public/assets/amrutha-avatar.png" 
                  alt="Amrutha Anime Avatar"
                  draggable="false"
                />
              </div>

              <div className="id-name">AMRUTHA</div>
              <div className="id-role">B.Tech Student &bull; Frontend Dev</div>
              <div className="id-barcode" aria-hidden="true"></div>

              {/* Rotating Corner Flowers */}
              <span className="dev-corner-flower flower-rot-b" style={{ position: 'absolute', bottom: '14px', left: '16px', fontSize: '18px', color: 'var(--accent)' }} aria-hidden="true">✿</span>

              {/* Hidden Admin Entry Flower Trigger: double-click / double-tap */}
              <button 
                type="button" 
                className="id-admin-flower"
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setPasskeyModalOpen(true);
                }}
                onTouchEnd={handleFlowerTouchEnd}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.stopPropagation();
                    e.preventDefault();
                    setPasskeyModalOpen(true);
                  }
                }}
                aria-label="Decorative flower"
                title=""
              >
                ✿
              </button>
            </div>
          </div>

          {/* Corner Sakura Branches */}
          <img src="public/assets/sakura-branch.png" className="sakura-branch-corner branch-left" alt="" aria-hidden="true" />
          <img src="public/assets/sakura-branch.png" className="sakura-branch-corner branch-right" alt="" aria-hidden="true" />
        </section>

        {/* About Section */}
        <section id="about" className="about-section">
          <div className="section-head reveal">
            <div className="section-kicker">01 / ABOUT ME</div>
            <h2>Curiosity meets<br /><em>thoughtful code</em></h2>
          </div>

          <div className="about-grid">
            <div className="about-card tilt-card reveal">
              <span className="about-num">01</span>
              <h3>Creative Mindset</h3>
              <p>I build web interfaces where visual charm and technical precision coexist naturally.</p>
            </div>
            <div className="about-card tilt-card reveal">
              <span className="about-num">02</span>
              <h3>B.Tech Academic Journey</h3>
              <p>Pursuing Computer Science &amp; Engineering at Narasaraopeta Engineering College.</p>
            </div>
            <div className="about-card tilt-card reveal">
              <span className="about-num">03</span>
              <h3>Modern Frontend Stack</h3>
              <p>Hands-on work across JavaScript, React, TypeScript, responsive layouts, and animations.</p>
            </div>
          </div>
        </section>

        {/* Education Section */}
        <section id="education" className="education-section">
          <div className="section-head reveal">
            <div className="section-kicker">02 / EDUCATION</div>
            <h2>Academic<br /><em>milestones</em></h2>
          </div>

          <div className="education-timeline">
            <div className="edu-card tilt-card reveal">
              <div className="edu-period">2022 — 2026</div>
              <h3>B.Tech in Computer Science &amp; Engineering</h3>
              <p className="edu-inst">Narasaraopeta Engineering College</p>
            </div>
            <div className="edu-card tilt-card reveal">
              <div className="edu-period">2020 — 2022</div>
              <h3>Intermediate (Class XII) &bull; 96.3%</h3>
              <p className="edu-inst">Sri Chaitanya Junior College</p>
            </div>
          </div>
        </section>

        {/* Work / Projects Section */}
        <section id="work" className="work-section">
          <div className="section-head reveal">
            <div className="section-kicker">03 / SELECTED WORK</div>
            <h2>Ideas brought to life<br /><em>on the screen</em></h2>
          </div>

          <div className="filter-row">
            {['all', 'web', 'extensions', 'systems'].map((f) => (
              <button 
                key={f}
                type="button" 
                className={`filter-btn ${activeFilter === f ? 'active' : ''}`}
                onClick={() => setActiveFilter(f)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          <div className="projects-grid">
            {/* Project 1: Prompt Tech */}
            {(activeFilter === 'all' || activeFilter === 'web') && (
              <article className="project-card tilt-card reveal">
                <div className="project-art art-prompt-tech">
                  <div style={{ background: 'var(--surface)', borderRadius: '18px', padding: '24px 28px', width: '82%', boxShadow: '0 12px 30px rgba(0,0,0,0.06)' }}>
                    <div style={{ fontFamily: 'var(--font-hand)', fontSize: 20, color: 'var(--accent)' }}>ai assistant ♡</div>
                    <div style={{ fontWeight: 800, fontSize: 22, color: 'var(--ink)' }}>Prompt Tech</div>
                  </div>
                </div>
                <div className="project-content">
                  <div className="project-eyebrow">01 &bull; WEB APPLICATION</div>
                  <div className="project-title-row">
                    <h3>Prompt Tech</h3>
                    <a className="project-arrow" target="_blank" rel="noopener noreferrer" href="https://github.com/amruthadivvela-droid/prompt-tech">↗</a>
                  </div>
                  <p>A smart prompt generation and technical utility platform designed to streamline AI prompting workflows.</p>
                  <div className="project-bottom">
                    <div className="chip-row">
                      <span className="tech-chip">React</span>
                      <span className="tech-chip">TypeScript</span>
                    </div>
                    <a className="btn-live-glow" href="https://prompt-tech-chi.vercel.app" target="_blank" rel="noopener noreferrer">
                      <span>Live Demo</span> <span className="arrow-icon">↗</span>
                    </a>
                  </div>
                </div>
              </article>
            )}

            {/* Project 2: Watch */}
            {(activeFilter === 'all' || activeFilter === 'web') && (
              <article className="project-card tilt-card reveal">
                <div className="project-art art-watch">
                  <div style={{ width: 130, height: 130, borderRadius: 36, background: 'linear-gradient(135deg, #7868a3, #b3a6df)', display: 'grid', placeItems: 'center', color: '#fff', fontSize: 36 }}>
                    ⌚
                  </div>
                </div>
                <div className="project-content">
                  <div className="project-eyebrow">02 &bull; INTERACTIVE WEB EXPERIMENT</div>
                  <div className="project-title-row">
                    <h3>Watch</h3>
                    <a className="project-arrow" target="_blank" rel="noopener noreferrer" href="https://github.com/amruthadivvela-droid/watch">↗</a>
                  </div>
                  <p>A TypeScript frontend experiment exploring interactive frame components and dynamic dials.</p>
                  <div className="project-bottom">
                    <div className="chip-row">
                      <span className="tech-chip">TypeScript</span>
                      <span className="tech-chip">CSS Animations</span>
                    </div>
                    <a className="btn-live-glow" href="https://watch-rosy-mu.vercel.app" target="_blank" rel="noopener noreferrer">
                      <span>Live Demo</span> <span className="arrow-icon">↗</span>
                    </a>
                  </div>
                </div>
              </article>
            )}

            {/* Project 3: Smart Classroom Attendance */}
            {(activeFilter === 'all' || activeFilter === 'systems') && (
              <article className="project-card featured-project-card tilt-card reveal">
                <div className="project-art art-attendance">
                  <div style={{ background: 'var(--surface)', borderRadius: '18px', padding: '24px 28px', width: '82%', boxShadow: '0 12px 30px rgba(0,0,0,0.06)' }}>
                    <div style={{ fontFamily: 'var(--font-hand)', fontSize: 20, color: 'var(--accent)' }}>real-time analytics ♡</div>
                    <div style={{ fontWeight: 800, fontSize: 22, color: 'var(--ink)' }}>Smart Attendance</div>
                  </div>
                </div>
                <div className="project-content">
                  <div className="project-eyebrow">03 &bull; ACADEMIC SYSTEM</div>
                  <div className="project-title-row">
                    <h3>Smart Classroom Attendance</h3>
                    <a className="project-arrow" target="_blank" rel="noopener noreferrer" href={GITHUB_PROFILE}>↗</a>
                  </div>
                  <p>Interactive web application engineered for department faculty with automated percentage analytics and CSV reporting.</p>
                  <div className="project-bottom">
                    <div className="chip-row">
                      <span className="tech-chip">JavaScript</span>
                      <span className="tech-chip">CSV Engine</span>
                    </div>
                  </div>
                </div>
              </article>
            )}
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" className="skills-section">
          <div className="section-head reveal">
            <div className="section-kicker">04 / TOOLBOX</div>
            <h2>Technologies I work with<br /><em>every day</em></h2>
          </div>

          <div className="skills-cloud reveal">
            {['React', 'JavaScript (ES6+)', 'TypeScript', 'HTML5 & CSS3', 'Tailwind CSS', 'Git & GitHub', 'REST APIs', 'Vite', 'Responsive Design', 'UI/UX Design'].map(skill => (
              <span key={skill} className="skill-pill magnetic-btn">
                <span>✿</span> {skill}
              </span>
            ))}
          </div>
        </section>

        {/* Requirements-First Contact Flow & Digital Visiting Card */}
        <section id="contact" className="contact-section">
          <div className="contact-container reveal">
            <div className="section-kicker">05 / SAY HELLO</div>
            <h2>What are your requirements?<br /><em>Tell me what you'd love to create</em></h2>
            <p className="contact-desc">
              Have an idea, project collaboration, or anything you'd like to discuss? Fill out your requirements below and generate an instant Sakura Digital Visiting Card!
            </p>

            <div className="contact-requirements-layout">
              {/* Left Form */}
              <div className="contact-form-panel tilt-card">
                <form onSubmit={handleContactSubmit}>
                  <div className="form-group" style={{ marginBottom: 14 }}>
                    <label htmlFor="req-name" style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)' }}>Your Name *</label>
                    <input 
                      type="text" 
                      id="req-name" 
                      className="form-input" 
                      placeholder="e.g. Maya Chen" 
                      value={contactName} 
                      onChange={e => setContactName(e.target.value)} 
                      required 
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 14 }}>
                    <label htmlFor="req-email" style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)' }}>Your Email (for replies)</label>
                    <input 
                      type="email" 
                      id="req-email" 
                      className="form-input" 
                      placeholder="maya@example.com" 
                      value={contactEmail} 
                      onChange={e => setContactEmail(e.target.value)} 
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 16 }}>
                    <label htmlFor="req-msg" style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)' }}>Your Requirements *</label>
                    <textarea 
                      id="req-msg" 
                      className="form-input" 
                      style={{ minHeight: 110 }} 
                      placeholder="Tell me about your idea, project, collaboration, or anything you'd like to discuss..."
                      value={contactMsg} 
                      onChange={e => setContactMsg(e.target.value)} 
                      required
                    ></textarea>
                  </div>

                  <div className="form-group" style={{ marginBottom: 18 }}>
                    <label style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)', marginBottom: 8, display: 'block' }}>Preferred Contact Method</label>
                    <div className="requirements-channel-picker">
                      <button 
                        type="button" 
                        className={`channel-btn ${contactChannel === 'whatsapp' ? 'active' : ''}`}
                        onClick={() => setContactChannel('whatsapp')}
                      >
                        <span>WhatsApp ↗</span>
                      </button>
                      <button 
                        type="button" 
                        className={`channel-btn ${contactChannel === 'email' ? 'active' : ''}`}
                        onClick={() => setContactChannel('email')}
                      >
                        <span>Email Enquiry ✉</span>
                      </button>
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ width: '100%', minHeight: 48, justifyContent: 'center' }}>
                    {contactChannel === 'whatsapp' ? 'Send via WhatsApp ↗' : 'Send Email Enquiry ✉'}
                  </button>
                </form>

                {contactFeedback && (
                  <div style={{ marginTop: 14, fontWeight: 700, color: 'var(--accent)', fontSize: 13.5 }}>
                    {contactFeedback}
                  </div>
                )}
              </div>

              {/* Right Visiting Card Preview (1080 x 1350) */}
              <div className="visiting-card-preview-panel tilt-card">
                <div style={{ fontSize: 12.5, fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', marginBottom: 12 }}>
                  Digital Visiting Card Preview 🌸
                </div>
                <div className="visiting-card-canvas-wrap">
                  <canvas ref={cardCanvasRef} width="1080" height="1350" className="visiting-card-canvas"></canvas>
                </div>
                <div className="visiting-card-actions">
                  <button type="button" className="btn btn-outline" onClick={downloadCardPng} style={{ minHeight: 40, padding: '0 18px', fontSize: 12 }}>
                    <span>Download Card (PNG)</span> 📥
                  </button>
                  <button type="button" className="btn btn-outline" onClick={handleShareCard} style={{ minHeight: 40, padding: '0 18px', fontSize: 12 }}>
                    <span>Share Card</span> ↗
                  </button>
                </div>
              </div>
            </div>

            <div className="contact-actions" style={{ marginTop: 40 }}>
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

      {/* Developer ID Modal (Automatic Looping Pixel Dissolve, Clean Footer) */}
      {devModalOpen && (
        <div className="modal-backdrop is-open" onClick={() => setDevModalOpen(false)}>
          <div className="modal-card dev-modal-card" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="modal-close-btn" onClick={() => setDevModalOpen(false)}>✕</button>
            <div className="dev-modal-head">
              <div className="dev-modal-avatar">
                <img 
                  src="public/assets/amrutha-avatar.png" 
                  alt="Amrutha Avatar" 
                  className="modal-portrait-img"
                  style={{ opacity: modalStage === 'anime' || modalStage === 'dissolving-to-anime' ? 1 : 0, transition: 'opacity 0.4s ease' }} 
                />
                <img 
                  src="public/assets/ammu.webp" 
                  alt="Amrutha Photograph" 
                  className="modal-portrait-img"
                  style={{ opacity: modalStage === 'real' || modalStage === 'dissolving-to-real' ? 1 : 0, transition: 'opacity 0.4s ease' }} 
                />
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

            {/* ONLY Public Footer Buttons */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
              <a href={GITHUB_PROFILE} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ minHeight: 44, padding: '0 24px', fontSize: 13.5, flex: 1, justifyContent: 'center' }}>
                Open GitHub Profile ↗
              </a>
              <button 
                type="button" 
                className="btn btn-outline" 
                style={{ minHeight: 44, padding: '0 24px', fontSize: 13.5, flex: 1, justifyContent: 'center' }}
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

      {/* Passkey Security Gateway: Restricted Access Modal */}
      {passkeyModalOpen && (
        <div className="modal-backdrop is-open" onClick={() => setPasskeyModalOpen(false)}>
          <div className="modal-card passkey-modal-card" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="modal-close-btn" onClick={() => setPasskeyModalOpen(false)}>✕</button>

            <div className="passkey-icon-wrap" aria-hidden="true">
              <span style={{ fontSize: 36 }}>🌸</span>
            </div>

            <h3 className="passkey-title">Restricted Access</h3>
            <p className="passkey-desc">Enter your access key to continue.</p>

            <form onSubmit={handlePasskeySubmit} className="passkey-form" noValidate autoComplete="off">
              <div className="passkey-input-wrap">
                <input 
                  type="password"
                  className={`passkey-input ${passkeyError ? 'input-error' : ''}`}
                  placeholder="••••••••"
                  aria-label="Access Key"
                  value={passkeyInput}
                  onChange={(e) => {
                    setPasskeyInput(e.target.value);
                    if (passkeyError) setPasskeyError('');
                  }}
                  autoFocus
                  required
                />
              </div>
              {passkeyError && <div className="passkey-error" role="alert">{passkeyError}</div>}
              
              <button type="submit" className="btn btn-primary" style={{ width: '100%', minHeight: 48, justifyContent: 'center', fontSize: 14, fontWeight: 800 }}>
                Unlock Dashboard
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Mount React App if container exists
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
