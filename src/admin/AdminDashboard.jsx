import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const DEFAULT_SKILLS = [
  { id: '1', name: 'HTML5', category: 'frontend', icon: 'code', desc: 'Semantic, accessible markup', order: 1, published: true },
  { id: '2', name: 'CSS3', category: 'frontend', icon: 'palette', desc: 'Modern responsive Flexbox & Grid', order: 2, published: true },
  { id: '3', name: 'JavaScript', category: 'frontend', icon: 'zap', desc: 'ES6+ interactivity, DOM manipulation', order: 3, published: true },
  { id: '4', name: 'C Language', category: 'languages', icon: 'cpu', desc: 'Core programming fundamentals', order: 4, published: true },
  { id: '5', name: 'UI & UX Design', category: 'workflow', icon: 'sparkles', desc: 'Typographic rhythm & color theory', order: 5, published: true },
  { id: '6', name: 'Responsive Web', category: 'workflow', icon: 'layout', desc: 'Fluid design across all viewports', order: 6, published: true }
];

const DEFAULT_PROJECTS = [
  { id: '1', title: 'Smart Classroom Attendance System', category: 'team', techs: 'HTML5, CSS3, JavaScript', github: 'https://github.com/amruthadivvela-droid', live: '', featured: true, published: true },
  { id: '2', title: 'Prompt Tech Showcase', category: 'frontend', techs: 'HTML5, CSS3, JavaScript', github: 'https://github.com/amruthadivvela-droid/prompt-tech', live: 'https://prompt-tech-chi.vercel.app', featured: false, published: true },
  { id: '3', title: 'Luxury Watch Experience', category: 'interactive', techs: 'HTML5, CSS3, CSS Motion', github: 'https://github.com/amruthadivvela-droid/watch', live: 'https://watch-rosy-mu.vercel.app', featured: false, published: true }
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('content');
  const [toastMsg, setToastMsg] = useState('');

  // Tab 1 state
  const [content, setContent] = useState({
    heroGreeting: 'Hi, I’m Amrutha. ♡',
    heroTitle: 'Frontend Developer & B.Tech Student',
    heroSub: 'I turn ideas into thoughtful web experiences with animated butterflies & blooming code.',
    aboutKicker: '01 / ABOUT ME',
    aboutTitle: 'Curiosity meets thoughtful code',
    aboutBody: 'I build web interfaces where visual charm and technical precision coexist naturally.',
    introGreeting: 'Welcome to Amrutha’s world',
    introSign: 'to my world',
    contactPrompt: 'What are your requirements?',
    contactSub: 'Send a message through the royal washi envelope or connect directly.'
  });

  // Tab 2 state
  const [skills, setSkills] = useState(DEFAULT_SKILLS);

  // Tab 3 state
  const [projects, setProjects] = useState(DEFAULT_PROJECTS);

  // Protected route session check
  useEffect(() => {
    try {
      const session = sessionStorage.getItem('amrutha_admin_session');
      let isValid = false;
      if (session === 'active') isValid = true;
      else if (session) {
        const parsed = JSON.parse(session);
        if (parsed && (parsed.authenticated || parsed.role === 'owner')) isValid = true;
      }
      if (!isValid) {
        navigate('/admin/login', { replace: true });
      }
    } catch {
      navigate('/admin/login', { replace: true });
    }
  }, [navigate]);

  // Load saved CMS data from localStorage
  useEffect(() => {
    try {
      const savedContent = localStorage.getItem('amrutha_cms_content');
      if (savedContent) setContent(JSON.parse(savedContent));
      const savedSkills = localStorage.getItem('amrutha_cms_skills');
      if (savedSkills) setSkills(JSON.parse(savedSkills));
      const savedProjects = localStorage.getItem('amrutha_cms_projects');
      if (savedProjects) setProjects(JSON.parse(savedProjects));
    } catch {}
  }, []);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3200);
  };

  const handleSaveContent = () => {
    localStorage.setItem('amrutha_cms_content', JSON.stringify({ ...content, updatedAt: new Date().toISOString() }));
    showToast('✿ Portfolio content published successfully!');
  };

  const handleToggleSkill = (id) => {
    const updated = skills.map((s) => (s.id === id ? { ...s, published: !s.published } : s));
    setSkills(updated);
    localStorage.setItem('amrutha_cms_skills', JSON.stringify(updated));
    showToast('Skill visibility updated!');
  };

  const handleDeleteSkill = (id) => {
    if (window.confirm('Delete this skill?')) {
      const updated = skills.filter((s) => s.id !== id);
      setSkills(updated);
      localStorage.setItem('amrutha_cms_skills', JSON.stringify(updated));
      showToast('Skill deleted!');
    }
  };

  const handleAddSkill = () => {
    const name = window.prompt('Skill Name:');
    if (!name) return;
    const category = window.prompt('Category (frontend, languages, workflow):', 'frontend') || 'frontend';
    const desc = window.prompt('Short description:', 'Clean responsive development') || '';
    const newSkill = {
      id: String(Date.now()),
      name,
      category,
      icon: 'code',
      desc,
      order: skills.length + 1,
      published: true
    };
    const updated = [...skills, newSkill];
    setSkills(updated);
    localStorage.setItem('amrutha_cms_skills', JSON.stringify(updated));
    showToast('New skill added!');
  };

  const handleToggleProject = (id) => {
    const updated = projects.map((p) => (p.id === id ? { ...p, published: !p.published } : p));
    setProjects(updated);
    localStorage.setItem('amrutha_cms_projects', JSON.stringify(updated));
    showToast('Project status updated!');
  };

  const handleDeleteProject = (id) => {
    if (window.confirm('Delete this project?')) {
      const updated = projects.filter((p) => p.id !== id);
      setProjects(updated);
      localStorage.setItem('amrutha_cms_projects', JSON.stringify(updated));
      showToast('Project deleted!');
    }
  };

  const handleAddProject = () => {
    const title = window.prompt('Project Title:');
    if (!title) return;
    const techs = window.prompt('Technologies (comma separated):', 'HTML5, CSS3, JavaScript') || '';
    const github = window.prompt('GitHub Repo URL:', 'https://github.com/amruthadivvela-droid') || '';
    const live = window.prompt('Live Demo URL (optional):', '') || '';
    const newProject = {
      id: String(Date.now()),
      title,
      category: 'frontend',
      techs,
      github,
      live,
      featured: false,
      published: true
    };
    const updated = [...projects, newProject];
    setProjects(updated);
    localStorage.setItem('amrutha_cms_projects', JSON.stringify(updated));
    showToast('New project created!');
  };

  const handleLogout = () => {
    sessionStorage.removeItem('amrutha_admin_session');
    navigate('/');
  };

  return (
    <div style={{ background: 'var(--bg)', color: 'var(--ink)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* CMS Top Header */}
      <header className="site-header" style={{ position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ width: '100%', maxWidth: '1280px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link to="/" style={{ fontFamily: 'var(--font-hand)', fontSize: '26px', fontWeight: 700, color: 'var(--ink)', textDecoration: 'none' }}>
              Amrutha <span style={{ color: 'var(--accent)' }}>✿</span>
            </Link>
            <span style={{ fontSize: '11px', fontWeight: 800, padding: '3px 8px', background: 'var(--accent-soft)', color: 'var(--accent)', borderRadius: '99px' }}>
              Sakura CMS
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link to="/" className="btn btn-outline" style={{ minHeight: '36px', padding: '0 16px', fontSize: '12px' }}>
              View Live Portfolio ↗
            </Link>
            <button type="button" onClick={handleLogout} className="btn btn-outline" style={{ minHeight: '36px', padding: '0 16px', fontSize: '12px', color: '#e0526e', borderColor: '#fba8bf' }}>
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main CMS Container */}
      <div className="cms-container" style={{ display: 'flex', flex: 1, minHeight: 'calc(100vh - 70px)' }}>
        {/* Sidebar */}
        <aside className="cms-sidebar" style={{ width: '260px', background: 'var(--surface)', borderRight: '1px solid var(--border)', padding: '24px 18px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button
            type="button"
            className={`cms-nav-item ${activeTab === 'content' ? 'active' : ''}`}
            onClick={() => setActiveTab('content')}
            style={{ width: '100%', padding: '12px 16px', borderRadius: '14px', border: activeTab === 'content' ? '1px solid var(--accent)' : '1px solid transparent', background: activeTab === 'content' ? 'var(--accent-soft)' : 'transparent', color: activeTab === 'content' ? 'var(--accent)' : 'var(--muted)', fontWeight: 700, fontSize: '13.5px', textAlign: 'left', cursor: 'pointer' }}
          >
            📝 Content Updates
          </button>
          <button
            type="button"
            className={`cms-nav-item ${activeTab === 'skills' ? 'active' : ''}`}
            onClick={() => setActiveTab('skills')}
            style={{ width: '100%', padding: '12px 16px', borderRadius: '14px', border: activeTab === 'skills' ? '1px solid var(--accent)' : '1px solid transparent', background: activeTab === 'skills' ? 'var(--accent-soft)' : 'transparent', color: activeTab === 'skills' ? 'var(--accent)' : 'var(--muted)', fontWeight: 700, fontSize: '13.5px', textAlign: 'left', cursor: 'pointer' }}
          >
            ⚡ Skills Management
          </button>
          <button
            type="button"
            className={`cms-nav-item ${activeTab === 'projects' ? 'active' : ''}`}
            onClick={() => setActiveTab('projects')}
            style={{ width: '100%', padding: '12px 16px', borderRadius: '14px', border: activeTab === 'projects' ? '1px solid var(--accent)' : '1px solid transparent', background: activeTab === 'projects' ? 'var(--accent-soft)' : 'transparent', color: activeTab === 'projects' ? 'var(--accent)' : 'var(--muted)', fontWeight: 700, fontSize: '13.5px', textAlign: 'left', cursor: 'pointer' }}
          >
            💻 Projects Management
          </button>
          <button
            type="button"
            className={`cms-nav-item ${activeTab === 'media' ? 'active' : ''}`}
            onClick={() => setActiveTab('media')}
            style={{ width: '100%', padding: '12px 16px', borderRadius: '14px', border: activeTab === 'media' ? '1px solid var(--accent)' : '1px solid transparent', background: activeTab === 'media' ? 'var(--accent-soft)' : 'transparent', color: activeTab === 'media' ? 'var(--accent)' : 'var(--muted)', fontWeight: 700, fontSize: '13.5px', textAlign: 'left', cursor: 'pointer' }}
          >
            🖼 Media Library
          </button>
        </aside>

        {/* Content Area */}
        <main style={{ flex: 1, padding: '32px 40px', overflowY: 'auto' }}>
          {/* TAB 1: Content Updates */}
          {activeTab === 'content' && (
            <section className="cms-panel">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                <div>
                  <h1 style={{ fontSize: '26px', fontWeight: 800 }}>Portfolio Content Updates</h1>
                  <p style={{ color: 'var(--muted)', fontSize: '13.5px' }}>Customize text strings across Hero, About, and Contact sections.</p>
                </div>
                <button type="button" className="btn btn-primary" onClick={handleSaveContent} style={{ minHeight: '40px', padding: '0 20px', fontSize: '13px' }}>
                  Save &amp; Publish ✿
                </button>
              </div>

              <div className="cms-card" style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '20px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Hero Handwritten Greeting</label>
                  <input
                    type="text"
                    className="form-input"
                    value={content.heroGreeting}
                    onChange={(e) => setContent({ ...content, heroGreeting: e.target.value })}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Hero Main Title</label>
                  <input
                    type="text"
                    className="form-input"
                    value={content.heroTitle}
                    onChange={(e) => setContent({ ...content, heroTitle: e.target.value })}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Hero Subtitle</label>
                  <input
                    type="text"
                    className="form-input"
                    value={content.heroSub}
                    onChange={(e) => setContent({ ...content, heroSub: e.target.value })}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>About Headline</label>
                  <input
                    type="text"
                    className="form-input"
                    value={content.aboutTitle}
                    onChange={(e) => setContent({ ...content, aboutTitle: e.target.value })}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>About Body Description</label>
                  <textarea
                    className="form-input"
                    rows="3"
                    value={content.aboutBody}
                    onChange={(e) => setContent({ ...content, aboutBody: e.target.value })}
                  />
                </div>
              </div>
            </section>
          )}

          {/* TAB 2: Skills Management */}
          {activeTab === 'skills' && (
            <section className="cms-panel">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                <div>
                  <h1 style={{ fontSize: '26px', fontWeight: 800 }}>Skills Management</h1>
                  <p style={{ color: 'var(--muted)', fontSize: '13.5px' }}>Add, edit, or toggle publication for technical proficiencies.</p>
                </div>
                <button type="button" className="btn btn-primary" onClick={handleAddSkill} style={{ minHeight: '40px', padding: '0 20px', fontSize: '13px' }}>
                  + Add New Skill
                </button>
              </div>

              <div className="cms-card" style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '20px', padding: '16px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13.5px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left', color: 'var(--muted)' }}>
                      <th style={{ padding: '12px' }}>Name</th>
                      <th style={{ padding: '12px' }}>Category</th>
                      <th style={{ padding: '12px' }}>Description</th>
                      <th style={{ padding: '12px' }}>Status</th>
                      <th style={{ padding: '12px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {skills.map((s) => (
                      <tr key={s.id} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '12px', fontWeight: 700 }}>{s.name}</td>
                        <td style={{ padding: '12px' }}>
                          <span style={{ padding: '3px 8px', borderRadius: '99px', background: 'var(--accent-soft)', color: 'var(--accent)', fontSize: '11px', fontWeight: 700 }}>
                            {s.category}
                          </span>
                        </td>
                        <td style={{ padding: '12px', color: 'var(--muted)' }}>{s.desc}</td>
                        <td style={{ padding: '12px' }}>
                          <span style={{ padding: '3px 8px', borderRadius: '99px', background: s.published ? '#e6f7ec' : '#f5f5f5', color: s.published ? '#1b873f' : '#888', fontSize: '11px', fontWeight: 700 }}>
                            {s.published ? 'Published ✓' : 'Draft'}
                          </span>
                        </td>
                        <td style={{ padding: '12px' }}>
                          <button type="button" onClick={() => handleToggleSkill(s.id)} style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontWeight: 700, marginRight: '10px' }}>
                            {s.published ? 'Hide' : 'Show'}
                          </button>
                          <button type="button" onClick={() => handleDeleteSkill(s.id)} style={{ background: 'none', border: 'none', color: '#e0526e', cursor: 'pointer', fontWeight: 700 }}>
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* TAB 3: Projects Management */}
          {activeTab === 'projects' && (
            <section className="cms-panel">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                <div>
                  <h1 style={{ fontSize: '26px', fontWeight: 800 }}>Projects Management</h1>
                  <p style={{ color: 'var(--muted)', fontSize: '13.5px' }}>Curate project cards, live demo URLs, and GitHub destinations.</p>
                </div>
                <button type="button" className="btn btn-primary" onClick={handleAddProject} style={{ minHeight: '40px', padding: '0 20px', fontSize: '13px' }}>
                  + Add New Project
                </button>
              </div>

              <div className="cms-card" style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '20px', padding: '16px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13.5px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left', color: 'var(--muted)' }}>
                      <th style={{ padding: '12px' }}>Title</th>
                      <th style={{ padding: '12px' }}>Technologies</th>
                      <th style={{ padding: '12px' }}>Live Demo</th>
                      <th style={{ padding: '12px' }}>Status</th>
                      <th style={{ padding: '12px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map((p) => (
                      <tr key={p.id} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '12px', fontWeight: 700 }}>{p.title}</td>
                        <td style={{ padding: '12px', color: 'var(--muted)' }}>{p.techs}</td>
                        <td style={{ padding: '12px' }}>
                          {p.live ? (
                            <a href={p.live} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)', fontWeight: 700, textDecoration: 'none' }}>
                              Live ↗
                            </a>
                          ) : (
                            <span style={{ color: 'var(--muted)' }}>—</span>
                          )}
                        </td>
                        <td style={{ padding: '12px' }}>
                          <span style={{ padding: '3px 8px', borderRadius: '99px', background: p.published ? '#e6f7ec' : '#f5f5f5', color: p.published ? '#1b873f' : '#888', fontSize: '11px', fontWeight: 700 }}>
                            {p.published ? 'Published ✓' : 'Draft'}
                          </span>
                        </td>
                        <td style={{ padding: '12px' }}>
                          <button type="button" onClick={() => handleToggleProject(p.id)} style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontWeight: 700, marginRight: '10px' }}>
                            {p.published ? 'Hide' : 'Show'}
                          </button>
                          <button type="button" onClick={() => handleDeleteProject(p.id)} style={{ background: 'none', border: 'none', color: '#e0526e', cursor: 'pointer', fontWeight: 700 }}>
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* TAB 4: Media Library */}
          {activeTab === 'media' && (
            <section className="cms-panel">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                <div>
                  <h1 style={{ fontSize: '26px', fontWeight: 800 }}>Media Library</h1>
                  <p style={{ color: 'var(--muted)', fontSize: '13.5px' }}>Verified static and storage media assets for Amrutha Portfolio.</p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
                <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '18px', padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <img src="/assets/ammu.webp" alt="Real Portrait" style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '12px' }} />
                  <div style={{ marginTop: '12px', fontWeight: 800, fontSize: '14px' }}>ammu.webp</div>
                  <div style={{ fontSize: '12px', color: 'var(--muted)' }}>Real Photograph &bull; 224 KB</div>
                </div>

                <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '18px', padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <img src="/assets/idcard_avatar.jpeg" alt="ID Avatar" style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '12px' }} />
                  <div style={{ marginTop: '12px', fontWeight: 800, fontSize: '14px' }}>idcard_avatar.jpeg</div>
                  <div style={{ fontSize: '12px', color: 'var(--muted)' }}>Default ID Avatar &bull; 57 KB</div>
                </div>

                <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '18px', padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <img src="/assets/amrutha-character.png" alt="Hero Character" style={{ width: '100%', height: '160px', objectFit: 'contain', borderRadius: '12px' }} />
                  <div style={{ marginTop: '12px', fontWeight: 800, fontSize: '14px' }}>amrutha-character.png</div>
                  <div style={{ fontSize: '12px', color: 'var(--muted)' }}>Chibi Hero Character &bull; 565 KB</div>
                </div>

                <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '18px', padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <img src="/assets/sakura-branch.png" alt="Sakura Branch" style={{ width: '100%', height: '160px', objectFit: 'contain', borderRadius: '12px' }} />
                  <div style={{ marginTop: '12px', fontWeight: 800, fontSize: '14px' }}>sakura-branch.png</div>
                  <div style={{ fontSize: '12px', color: 'var(--muted)' }}>Corner Branches &bull; 1.02 MB</div>
                </div>

                <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '18px', padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: '48px', margin: '30px 0' }}>📄</span>
                  <div style={{ fontWeight: 800, fontSize: '14px' }}>resume.pdf</div>
                  <div style={{ fontSize: '12px', color: 'var(--muted)' }}>Official Resume PDF</div>
                </div>
              </div>
            </section>
          )}
        </main>
      </div>

      {/* Toast Notification */}
      {toastMsg && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            background: 'var(--surface)',
            border: '1px solid var(--accent)',
            boxShadow: '0 10px 30px rgba(213, 101, 134, 0.25)',
            color: 'var(--accent)',
            fontWeight: 800,
            padding: '14px 24px',
            borderRadius: '99px',
            zIndex: 9999,
            animation: 'fadeIn 0.3s ease'
          }}
        >
          {toastMsg}
        </div>
      )}
    </div>
  );
}
