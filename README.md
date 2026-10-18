# Amrutha Sakura Developer Portfolio 🌸
**Divvela Jyoti Venkata Amrutha — Frontend Developer & B.Tech Student**

A personal, illustrated, interactive developer portfolio website matching the Sakura visual design reference.

---

## 🌟 Live Local Access

The local development server is running and accessible at:
- **Main Portfolio:** [http://localhost:8000](http://localhost:8000)
- **Direct Standalone Preview:** [http://localhost:8000/standalone.html](http://localhost:8000/standalone.html)

To launch the server manually at any time:
```bash
python -m http.server 8000
```

---

## ✨ Features Implemented

### 1. 🌸 Visual Identity & Hero Section
- **Warm Cream & Pastel Pink Palette**: Tailored HSL tokens with subtle radial pink glow.
- **Oversized Background Lettering**: Giant fluid typography watermark `AMRUTHA` behind the composition.
- **Handwritten Personal Introduction**: `Hi, I'm Amrutha.` in Caveat script with pink brush underline and heart flourish.
- **Bold Role Typography**: Prominent `Frontend Developer` heading with clean modern sans-serif.
- **Illustrated Anime Character**: High-resolution transparent character (Anya chibi aesthetic with sunglasses), subtle floating/breathing animation, ground shadow, and interactive speech bubble cycling through quotes on tap/click.
- **Hanging Developer ID Badge**:
  - Pink woven lanyard straps and gold clasp link.
  - Interactive portrait badge with avatar photo, verified credentials, barcode, and blossom decoration.
  - **Click-to-Inspect**: Opens the accessible Developer Profile Modal.
- **Animated Cherry Blossoms & Butterflies**:
  - Three pink butterflies with animated flapping wings and curved flight paths.
  - Blooming sakura branches framing lower corners.
  - Lightweight, GPU-accelerated falling petals particle system (respects `prefers-reduced-motion`).

### 2. 📖 About Section (`01 / A LITTLE ABOUT ME`)
- Two-column editorial composition: `Curious mind. Creative heart.`
- Verified bio based on academic enrollment at **Narasaraopeta Engineering College**.
- Pinned washi-tape aesthetic note card: *"Oh, hello there! I'm Amrutha..."*
- Value highlights: *Design meets development*, *Details are everything*, *Always learning*.

### 3. 🎓 Academic Journey Timeline (`02 / ACADEMIC JOURNEY`)
Sakura-themed vertical milestone timeline with verified factual records:
- **Bachelor of Technology (B.Tech)**: Narasaraopeta Engineering College *(Currently Pursuing)*
- **Class XII — Intermediate (MPC)**: Sri Chaitanya Junior College *(Score: **96.3%**)*
- **Class X — Secondary School Certificate (SSC)**: Sri Chaitanya Techno School *(Score: **95.0%**)*

### 4. 💻 Selected Work & Featured Project (`03 / SELECTED WORK`)
- **Primary Featured Showcase**: **Smart Classroom Attendance System** (Team Project — HTML, CSS, JavaScript)
  - **Interactive Admin Dashboard Modal**: Click either the `attendance-portal.local` mockup window or the **Launch Admin Dashboard ⚡** button (also available via the **⚡ Admin Portal** button in the top navigation and Developer ID badge modal).
  - **Live Dynamic Roll Call**: Toggle student attendance between **Present ✓**, **Absent ✗**, and **Late ⏰** with instantaneous metric recalculations across total students, present count, and attendance percentage.
  - **Real-Time Student Roster Search & Filter**: Instant search by student name or roll number (e.g. `21NEC01`) and status filters (*All*, *Present*, *Absent*).
  - **Action Tools**: *Mark All Present*, *Reset Roll Call*, and *Export CSV Report* (downloads a structured attendance CSV).
  - Confirmed contributions: Frontend UI layouts, JavaScript state & attendance toggling, responsive usability, collaborative module integration.
- **Public Verified GitHub Projects**:
  - **Prompt Tech**: AI Document Intelligence frontend (`React`, `TypeScript`, `AI`) — [Live Demo](https://prompt-tech-chi.vercel.app)
  - **Watch**: Interactive web experiment with frame components (`TypeScript`) — [Live Demo](https://watch-rosy-mu.vercel.app)
  - **Portfolio**: Personal creative web layout codebase (`HTML5`, `CSS3`, `JavaScript`)
  - **Sanjay**: Deployed JavaScript web project — [Live Demo](https://sanjay-bachhe-gay.vercel.app)
- Category filter buttons: *All Projects*, *Team Projects*, *AI & Retrieval*, *Web Experiments*.

### 5. 🛠 Technical Skills & Toolbox (`04 / MY TOOLBOX`)
- **Programming Foundation**: C Language
- **Frontend Development**: HTML5 Semantic Markup, CSS3 & Modern Layouts, JavaScript (ES6+), Responsive Web Design
- **Practices & Collaboration**: UI Implementation, Git & GitHub, Problem Solving, Team Collaboration

### 6. 🤝 Strengths & Collaboration (`Better ideas bloom together.`)
Six core collaborative competencies:
- Team Collaboration, Fast Learner, Attention to Detail, Problem Solving, Reliability & Focus, Thoughtful Communication.

### 7. 💌 Contact Section (`05 / SAY HELLO`)
- Interactive contact form with input validation and friendly mailto client fallback.
- **Copy GitHub Link Button**: Copies `https://github.com/amruthadivvela-droid` to clipboard with animated toast notification.
- Quick direct links to GitHub and Resume.

### 8. 🎨 Ten Real Switchable Themes
Transforms colors, backgrounds, panels, text, borders, shadows, lanyard, and badge:
1. **Sakura Dream** 🌸 (Default Reference Theme)
2. **Lavender Mist** 🦋 (Dreamy violet pastels)
3. **Strawberry Milk** 🍓 (Sweet blush & berry red)
4. **Midnight Sakura** 🌙 (Deep floral dark mode)
5. **Matcha Garden** 🍃 (Refreshing botanical sage)
6. **Ocean Pearl** 🐚 (Calm coastal cyan & teal)
7. **Peach Blossom** 🍑 (Warm sunset apricot)
8. **Moonlight Blue** ⭐ (Sleek navy night mode)
9. **Rose Gold** 🥀 (Champagne & bronze elegance)
10. **Candy Pop** 🍬 (Playful lilac, mint & coral)
*Persists selections across sessions via `localStorage`.*

### 9. 📄 Verified Resume Integration
- Generated professional resume PDF located at `public/resume.pdf`.
- Accessible Resume Viewer Modal with embedded preview, **Download PDF**, and **Open in New Tab** actions.

---

## 📁 Project Structure

```
Amrutha_Sakura_Portfolio/
├── index.html                  # Direct production root entry
├── standalone.html             # Fully self-contained zero-dependency edition
├── package.json                # Project dependencies and npm scripts
├── README.md                   # Complete documentation & deployment guide
├── public/
│   ├── resume.pdf              # Verified compiled resume PDF
│   └── assets/
│       ├── amrutha-character.png   # Full-body character with transparent alpha
│       ├── amrutha-avatar.png      # Cropped badge portrait avatar
│       ├── sakura-branch.png       # Transparent cherry blossom corner branches
│       └── design-reference.png    # Original high-resolution design screenshot
├── src/
│   ├── main.jsx                # Complete React application & components
│   └── styles.css              # Theme tokens, fluid typography, responsive layout
└── scripts/
    └── generate_resume.py      # Python ReportLab script to regenerate resume.pdf
```

---

## 🚀 Deployment to Vercel

1. Push this repository to GitHub or upload the directory.
2. Go to [Vercel](https://vercel.com) and click **Add New Project**.
3. Import the repository.
4. Set **Framework Preset**: `Other` (or `Vite`).
5. Set **Output Directory**: `.` (or `dist` if building with Vite).
6. Click **Deploy**.
