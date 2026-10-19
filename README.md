# Amrutha Sakura Developer Portfolio 🌸 — V7.0 Production Edition
**Divvela Jyoti Venkata Amrutha — Frontend Developer & B.Tech Student**

A personal, illustrated, interactive developer portfolio website matching the Sakura visual design reference with cinematic opening animations, hidden admin authentication, Sakura CMS, and dynamic digital visiting cards.

---

## 🌟 Live Access & Endpoints

- **Public Portfolio:** [http://localhost:8000](http://localhost:8000)
- **Direct Standalone Preview:** [http://localhost:8000/standalone.html](http://localhost:8000/standalone.html)
- **Sakura CMS Admin Dashboard:** [http://localhost:8000/admin.html](http://localhost:8000/admin.html) *(Passkey Protected)*

To launch or restart the local development server:
```bash
python -m http.server 8000
```
Or run with Vite:
```bash
cmd /c npm run dev
```

---

## 🌸 Master V7.0 Deliverables & Key Features

### 1. 🕊 100% Clean Public Navigation
- **Exact Public Layout:**
  `Amrutha ✿   About   Education   Work   Skills   Contact   │   ☼ Themes`
- **Zero Admin / Portal Exposure:** Public navbar, cards, and mobile menus are completely free of admin, portal, or attendance buttons.
- **Pill Alignment:** The Themes switcher is seamlessly integrated inside the translucent frosted navbar pill, with no detached elements or layout shifts.

### 2. 🪪 Physically Unified Developer ID Card
- **Unified Hardware Assembly:** Pink woven fabric straps smoothly converge into a metallic gold buckle and swivel spring clasp that visibly hooks through the badge's punched slot (`.badge-hole-slot`). Straps, clasp, and card move as one coherent physical coordinate system.
- **Natural Pendulum Motion:** Continuous restrained 1–3° physics sway responding gently to cursor position.
- **Clean Anime Portrait:** Displays the approved anime character portrait without camera icons, "Real Photo" tags, or photo-switch overlays.
- **Rotating Sakura Blossoms:** Decorative five-petal flowers rotating smoothly at varied speeds at card corners.

### 3. 🗝 Hidden Admin Entry & Restricted Access Gateway
- **Discreet Sakura Flower Trigger:** Positioned at the bottom-right corner of the Developer ID badge (`#id-admin-flower`). It appears as an ordinary decorative blossom with zero admin text, key icons, or hints.
- **Interaction Protocols:**
  - **Desktop:** Deliberate double-click (`dblclick`) opens the access key modal. Single click does NOT open admin.
  - **Mobile:** High-precision double-tap detection (<380ms tap interval).
  - **Accessibility:** Keyboard navigable with Enter or Space activation.
  - Event propagation is stopped so activating the flower never opens the developer profile modal.
- **Restricted Access Authentication Modal (`#passkey-modal`):**
  - Heading: **Restricted Access**
  - Subtitle: **Enter your access key to continue.**
  - Masked password input (`type="password"`) with label **Access Key**
  - Button: **Unlock Dashboard**
  - Zero password hints, zero example passkeys, and no eye-toggle password reveal.
  - Verification: Authorizes via backend/secure key verification (approved passkey: `2026`). On success, establishes authenticated session in `sessionStorage` (`amrutha_admin_session`) and redirects to separate `/admin.html` route.
  - On incorrect entry: Displays **Access denied. Please try again.** with input shake and no clue disclosures.

### 4. 🔄 Developer ID Automatic Looping Pixel Dissolve
Inside the Developer Profile Modal (`#dev-id-modal`):
- **Stage A (Hold ~2.0s):** Full anime portrait displayed with subtle sparkle shimmer.
- **Stage B (Dissolution ~800ms):** Anime portrait fragments into pink-tinted pixel particles on `#modal-pixel-loop-canvas`.
- **Stage C (Reveal ~800ms):** Amrutha's genuine photograph (`public/assets/ammu.webp`) unmasks from pixelated to sharp focus, preserving actual face, smile, and sunglasses.
- **Stage D (Hold ~2.0s):** Real photograph displayed sharp and unaltered.
- **Stage E (Reverse ~800ms):** Real photo dissolves into pixels as the anime character portrait re-emerges.
- **Stage F (Repeat):** Automatically loops while the modal is open. Pauses immediately on close or when tab is hidden.
- **Public Profile Modal Footer:** Strictly contains only **Open GitHub Profile ↗** and **Inspect Resume 📄** (old attendance admin button completely removed).

### 5. 🎬 Cinematic Opening Sequence & Falling Sign
1. **Butterfly Arrival & Curtains:** Solitary butterfly arrives, parting the deckle-edge storybook washi curtains.
2. **Coordinated Swarm:** Butterflies swarm and gather to form a very large, readable, spaced word:
   `W   E   L   C   O   M   E` (spanning 75–85vw with distinct letter kerning).
3. **Falling Hanging Sign ("to my world"):** Illustrated pastel hanging board descends with gentle acceleration and spring settling directly below WELCOME.
4. **Blossom Transformation:** WELCOME glyphs dissolve progressively into thousands of cherry blossom petals.
5. **Sign Gravity Drop:** The sign releases and drops downward naturally with gravity physics ($y = y_0 + \frac{1}{2}gt^2$).
6. **Cloud & Mist Reveal:** Soft translucent pastel clouds part laterally from screen edges, revealing the mounted hero without page flash or reloading.

### 6. 🌸 Giant AMRUTHA Background Particles & Cursor Flowers
- **Giant AMRUTHA Watermark:** Canvas particle targets dynamically measure the exact computed font size and coordinate metrics of `.giant-name`, spanning 85–95% of desktop hero width with pointer repulsion and gentle spring return.
- **Varied Cursor Blossom Trail:**
  - Small (10–14px ~50%), Medium (16–24px ~35%), Occasional Large (26–34px ~15%).
  - Rotating, drifting upward, and smoothly fading out.
  - Click burst creates an expanding accent ring with 4 blossom petals flying outward.

### 7. 📇 Requirements-First Contact & 1080×1350 Digital Visiting Card
- **Requirements Prompt:** *"What are your requirements? Tell me a little about what you'd love to create."*
- **Fields:** Visitor Name, Email, Requirements Message textarea, and Channel Selector (WhatsApp vs Email).
- **High-Resolution 1080 × 1350 Canvas Engine:**
  - Generates a branded Sakura Digital Visiting Card live on `#visiting-card-canvas`.
  - Cream and pastel pink gradient with gold and rose floral borders, Amrutha ✿ branding, visitor metadata, wrapped requirement lines, and creative world footer.
  - **Download Card (PNG):** Direct high-resolution image export.
  - **Native Web Share:** Uses `navigator.share({ files: [cardFile] })` where supported.
- **WhatsApp Integration:**
  - International destination: `+91 90323 16792` (`https://wa.me/919032316792`).
  - Pre-fills requirements message cleanly with URL encoding.
- **Resend Branded Email Integration:**
  - Validates requirements and email.
  - Submits to backend endpoint or Supabase `contact_enquiries`, sending responsive HTML emails with Sakura styling.

### 8. 🗄 Sakura CMS Admin Dashboard (`admin.html`)
An isolated productivity CMS connected to Supabase:
1. **Portfolio Updates:** Edit hero greetings, titles, about text, section headlines, and intro copy; preview live or publish directly.
2. **Skills Management:** Add, edit, reorder, delete, and toggle publication status of technical proficiencies.
3. **Projects Management:** Add/edit projects, categories, technology tags, GitHub URLs, and Live Demo links (Live Demo button appears publicly only when a valid URL is configured).
4. **Media Library:** Upload, preview, and replace portfolio media assets (`ammu.webp`, hero character, branches, resume PDF) using Supabase Storage.
- Protected by authenticated session checks (`amrutha_admin_session`). Unauthorized direct visits are safely redirected.

---

## 🛠 Database & Backend Configuration

### Environment Variables (`.env`)
Copy `.env.example` to `.env`:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key

SUPABASE_SERVICE_ROLE_KEY=your-server-side-service-role-key

RESEND_API_KEY=re_your_resend_api_key
RESEND_FROM_EMAIL=portfolio@amrutha.dev
ADMIN_NOTIFICATION_EMAIL=amrutha.divvela@example.com

PUBLIC_WHATSAPP_NUMBER=919032316792
```

### Database Setup
Execute `supabase_schema.sql` in your Supabase SQL Editor to initialize:
- `portfolio_content` — Editable section copy with RLS public read / admin write.
- `portfolio_skills` — Skills order, categories, and publication flags.
- `portfolio_projects` — Projects metadata, links, demo URLs, and featured order.
- `portfolio_media` — Media assets storage references.
- `portfolio_admins` — Authorized admin roles.
- `portfolio_revisions` — Audit log of published changes.
- `contact_enquiries` — Submitted requirements enquiries.

---

## 🧪 Automated QA Audit Suite

Run the headless Edge automation suite verifying all 6 core test areas:
```bash
node scripts/test_v7_complete.cjs
```

Verified Results:
- ✅ Public navbar free of Admin/Portal buttons; Themes aligned.
- ✅ ID lanyard physically unified, slot punched, badges removed.
- ✅ Single click does not open admin; double-click opens Restricted Access modal with masked input and zero hints.
- ✅ Profile modal cleaned; automatic anime-to-real (`ammu.webp`) pixel dissolve loop active.
- ✅ Requirements-first flow generates 1080×1350 PNG visiting card and connects to WhatsApp `+91 90323 16792`.
- ✅ Sakura CMS (`admin.html`) loads all 4 modules (Updates, Skills, Projects, Media) under session authentication.

---

## 📦 Production Build

```bash
cmd /c npm run build
```
Built bundle is emitted to `dist/` with optimized gzip compression and asset hashing.
Deliverable ZIP archive is generated at `../Amrutha_Sakura_Portfolio_Deliverable.zip`.
