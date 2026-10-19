# Amrutha Sakura Developer Portfolio 🌸 — V12.0 Complete React Migration
**Divvela Jyoti Venkata Amrutha — Frontend Developer & B.Tech Student**

A personal, illustrated, interactive developer portfolio website matching the Sakura visual design reference with cinematic opening animations, hidden admin authentication, Sakura CMS, and dynamic digital visiting cards. Fully migrated to a modern React 19 + Vite single-page application with 100% pixel-perfect preservation of design and animation physics.

---

## 🌟 Live Access & Endpoints

- **Public Portfolio:** `/` ([http://localhost:5173/](http://localhost:5173/))
- **Sakura CMS Admin Login:** `/admin/login` ([http://localhost:5173/admin/login](http://localhost:5173/admin/login)) *(Passkey: `170311`)*
- **Protected Admin Dashboard:** `/admin` ([http://localhost:5173/admin](http://localhost:5173/admin)) *(Session-guarded)*

To launch local development server:
```bash
cmd /c npm run dev
```

To build production bundle:
```bash
cmd /c npm run build
```

To run preview server:
```bash
cmd /c npm run preview
```

To run automated migration test suite:
```bash
cmd /c npm test
```

---

## 🌸 Master V12.0 Architecture & Features

### 1. ⚛️ Complete HTML to React Component Migration
- **Minimal `index.html`:** Clean 23-line HTML entry point with `<div id="root"></div>`, Google Fonts preconnect, and SEO meta tags.
- **Componentized Structure:**
  ```text
  src/
  ├── main.jsx (React 19 createRoot + BrowserRouter)
  ├── App.jsx (Routes + 10-theme persistence)
  ├── styles.css (Preserved CSS tokens, palettes & keyframes)
  ├── components/
  │   ├── layout/
  │   │   ├── Navbar.jsx (Floating navbar, 10-theme dropdown, mobile drawer)
  │   │   └── Footer.jsx (Site footer, back to top)
  │   ├── intro/
  │   │   └── CinematicIntro.jsx (Curtains, clouds, canvas flight, swarm, WELCOME, falling sign)
  │   ├── hero/
  │   │   ├── Hero.jsx (Hero text, character with quote bubble, corner branches, ambient canvas)
  │   │   └── DeveloperID.jsx (Hanging lanyard, tilt, hover pixel dissolve, hidden admin flower)
  │   ├── sections/
  │   │   ├── About.jsx (About cards with 3D tilt)
  │   │   ├── Education.jsx (Education timeline milestones)
  │   │   ├── WorkProjects.jsx (Project filters, cards, live links)
  │   │   ├── SkillsCollaboration.jsx (Skills pills, strengths cards)
  │   │   ├── ButterflyFAQ.jsx (6 butterfly triggers, flying animation, expanding wings answer modal)
  │   │   └── OutroFinale.jsx (Canvas particles, automated continuous loop without Replay button)
  │   ├── contact/
  │   │   ├── ContactSection.jsx (Left social composition + Right envelope enquiry form)
  │   │   └── VisitingCardModal.jsx (1080x1350 canvas generation, PNG download, WhatsApp handoff)
  │   ├── modals/
  │   │   ├── DeveloperProfileModal.jsx (Automatic looping anime <-> real photo dissolve)
  │   │   ├── ResumeModal.jsx (Iframe PDF preview, download button)
  │   │   └── PasskeyModal.jsx (Restricted access modal, passkey validation)
  │   └── effects/
  │       └── AmbientGlow.jsx (Mouse spotlight glow & click petal burst)
  └── admin/
      ├── AdminLogin.jsx (Access key login at /admin/login)
      └── AdminDashboard.jsx (Protected CMS tabs: Content, Skills, Projects, Media)
  ```

### 2. 🎨 Ten-Theme System (Zero Flash & Preserved)
- **10 Curated Palettes:**
  - `sakura` (Sakura Dream 🌸)
  - `lavender` (Lavender Mist 🦋)
  - `strawberry` (Strawberry Milk 🍓)
  - `midnight` (Midnight Sakura 🌙)
  - `matcha` (Matcha Garden 🍃)
  - `ocean` (Ocean Pearl 🐚)
  - `peach` (Peach Blossom 🍑)
  - `moonlight` (Moonlight Blue ⭐)
  - `rosegold` (Rose Gold 🥀)
  - `candypop` (Candy Pop 🍬)
- Persistent in `localStorage.getItem('amrutha-theme')`.
- Applied via `data-theme` attribute on document root.

### 3. 🕊 100% Clean Public Navigation
- **Exact Public Layout:**
  `Amrutha ✿   About   Education   Work   Skills   Contact   │   ☼ Themes`
- **Zero Admin / Portal Exposure:** Public navbar is completely free of admin buttons.
- **Pill Alignment:** The Themes switcher is seamlessly integrated inside the translucent frosted navbar pill.

### 4. 🪪 Physically Unified Developer ID Card
- **Unified Hardware Assembly:** Pink woven fabric straps smoothly converge into a metallic gold buckle and swivel spring clasp that visibly hooks through the badge's punched slot (`.badge-hole-slot`).
- **Natural Pendulum Motion:** Continuous physics sway responding gently to cursor position.
- **Hover Pixel Dissolve:** Default avatar (`idcard_avatar.jpeg`) unmasks into genuine photograph (`ammu.webp`) through a 520ms canvas pixel dissolution. Reverses smoothly on pointer exit.
- **Hidden Admin Blossom (`#id-admin-flower`):** Double-click (desktop) or double-tap (<380ms on mobile) opens the access key modal. Event propagation stopped to avoid triggering profile modal.

### 5. 💌 Royal Washi Envelope Contact Flow & Resend Integration
- **3-Field Envelope Form:** Name, Email, Requirements.
- **Backend API (`POST /api/contact`):**
  - Rate-limited and idempotency-cached.
  - Generates high-res digital visiting card reference.
  - Submits owner notification via Resend (`notifications@codeaxisapply.xyz` -> `amruthadivvela@gmail.com`).
  - Submits visitor thank-you email.
  - Stores enquiry in Supabase PostgreSQL table `contact_enquiries` (NO Supabase Auth).
  - Directly opens WhatsApp (`+91 90323 16792`) with formatted message & visiting card URL.

### 6. 🦋 Butterfly FAQ Transformed Modal
- **Constellation of 6 Questions:**
  - CTO role at CodeXa Agency
  - Technical stack & frameworks
  - Engineering opportunities
  - Motion & web performance
  - Academic background
  - Direct communication
- Clicking a butterfly trigger activates smooth flying animation to center, expanding into a butterfly-shaped answer interface with vector wing backdrop and orbiting mini butterfly close button.

### 7. 🌸 Grand Cinematic Finale Outro (Continuous Loop)
- **150 Canvas Particles:** Fluttering butterflies and sakura petals.
- **Automated Sequence:**
  - State A: "Thanks for visiting my portfolio"
  - State B: Handwritten strikethrough animates across "portfolio"
  - State C & D: "world ♡" blooms & floral celebration
  - State E: Hold 6.5s to read "Thanks for visiting my world! ♡"
  - State F: Dissolve message into butterflies & petals
  - State G: Reform after 1.5s and loop seamlessly!
- **No Replay Motion Button:** Automatically loops while visible; paused when offscreen via IntersectionObserver.

### 8. 🚀 Production Deployment & Vercel Configuration
- **Vercel Rewrite (`vercel.json`):**
  ```json
  {
    "framework": "vite",
    "buildCommand": "npm run build",
    "outputDirectory": "dist",
    "rewrites": [
      {
        "source": "/((?!api/).*)",
        "destination": "/index.html"
      }
    ]
  }
  ```
  - Standard SPA fallback for `/`, `/admin/login`, `/admin`.
  - `/api/*` endpoints are never intercepted by HTML rewrite.

---

## 🛡 Environment Configuration

In Vercel Project Settings or local `.env`:

```env
# Public Frontend Variables
VITE_SITE_URL=https://amrutha-sakura.vercel.app
VITE_PUBLIC_CONTACT_EMAIL=amruthadivvela@gmail.com
VITE_PUBLIC_WHATSAPP_NUMBER=919032316792
VITE_PUBLIC_INSTAGRAM_URL=https://www.instagram.com/amrutha.d344/
VITE_PUBLIC_GITHUB_URL=https://github.com/amruthadivvela-droid

# Server-Only Supabase Database (NO Supabase Auth)
SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
SUPABASE_SECRET_KEY=YOUR_SUPABASE_SECRET_KEY

# Server-Only Resend Email
RESEND_API_KEY=YOUR_RESEND_API_KEY
RESEND_FROM_EMAIL=notifications@codeaxisapply.xyz
RESEND_OWNER_EMAIL=amruthadivvela@gmail.com

# Server Admin Authentication
ADMIN_PASSWORD_HASH=YOUR_PASSKEY_HASH
```
