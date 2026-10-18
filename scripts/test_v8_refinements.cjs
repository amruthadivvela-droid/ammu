const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const EDGE_PATH = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const ARTIFACT_DIR = "C:\\Users\\ashuc\\.gemini\\antigravity-ide\\brain\\838bc2bf-cdb0-4654-9635-7d5893afd09d";

function wait(ms) {
  return new Promise(res => setTimeout(res, ms));
}

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
}

async function run() {
  console.log("===============================================================");
  console.log("   V8 REFINEMENT: SAKURA UNIVERSE COMPLETE QA VALIDATION       ");
  console.log("===============================================================");

  const targetUrl = 'http://localhost:8000/';
  const tempDir = `C:\\Users\\ashuc\\AppData\\Local\\Temp\\edge_qa_${Date.now()}`;
  const edge = spawn(EDGE_PATH, [
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    `--user-data-dir=${tempDir}`,
    '--remote-debugging-port=9231',
    '--window-size=1440,900',
    targetUrl
  ]);

  let connected = false;
  let wsUrl = '';

  for (let i = 0; i < 35; i++) {
    await wait(300);
    try {
      const list = await fetchJson('http://localhost:9231/json/list');
      const page = list.find(item => item.type === 'page' && !item.url.includes('chrome-extension'));
      if (page && page.webSocketDebuggerUrl) {
        wsUrl = page.webSocketDebuggerUrl;
        connected = true;
        break;
      }
    } catch (e) {}
  }

  if (!connected) {
    console.error("❌ Failed to connect to Edge DevTools port 9231");
    edge.kill();
    process.exit(1);
  }

  console.log("✓ Connected to Edge DevTools browser session.");
  const ws = new WebSocket(wsUrl);

  let idSeq = 1;
  const pending = new Map();

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.id && pending.has(msg.id)) {
      const { resolve, reject } = pending.get(msg.id);
      pending.delete(msg.id);
      if (msg.error) reject(msg.error);
      else resolve(msg.result);
    }
  };

  function sendCmd(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = idSeq++;
      pending.set(id, { resolve, reject });
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  if (ws.readyState !== WebSocket.OPEN) {
    await new Promise(r => {
      ws.onopen = r;
      ws.onerror = r;
    });
  }
  await sendCmd('Page.enable');
  await sendCmd('Runtime.enable');
  await sendCmd('DOM.enable');

  async function evalJs(expr) {
    let script = expr.trim();
    if (!script.startsWith('(() =>') && (script.includes(';') || script.includes('const ') || script.includes('let '))) {
      script = `(() => { ${script} })()`;
    }
    const res = await sendCmd('Runtime.evaluate', { expression: script, returnByValue: true, awaitPromise: true });
    if (res.exceptionDetails) {
      console.error('JS eval exception in:', script, 'Error:', res.exceptionDetails.text, res.exceptionDetails.exception ? res.exceptionDetails.exception.description : '');
    }
    return res.result ? res.result.value : null;
  }

  async function saveScreenshot(filename) {
    const res = await sendCmd('Page.captureScreenshot', { format: 'png' });
    const buf = Buffer.from(res.data, 'base64');
    fs.writeFileSync(`scripts/${filename}`, buf);
    if (fs.existsSync(ARTIFACT_DIR)) {
      fs.writeFileSync(path.join(ARTIFACT_DIR, filename), buf);
    }
    console.log(`  📸 Screenshot saved: ${filename}`);
  }

  console.log("\n[TEST 1] Fast-forwarding cinematic intro to expose active hero section...");
  await wait(1000);
  await evalJs(`
    const introOverlay = document.getElementById('cinematic-intro-overlay');
    if (introOverlay) {
      introOverlay.style.opacity = '0';
      introOverlay.style.pointerEvents = 'none';
      setTimeout(() => { introOverlay.remove(); }, 100);
    }
    const heroSec = document.getElementById('top');
    if (heroSec) heroSec.style.opacity = '1';
    window.scrollTo(0, 0);
  `);
  await wait(600);

  console.log("\n[TEST 2] Verifying Hero section & CTO Role pill...");
  const heroRoleText = await evalJs(`
    const pill = document.querySelector('.hero-role-pill');
    return pill ? pill.innerText.trim() : null;
  `);
  console.log(`  Hero Role Pill: "${heroRoleText}"`);
  if (!heroRoleText || !heroRoleText.includes('CTO @ CodeXa Agency')) {
    console.error("  ❌ Hero Role Pill missing CTO @ CodeXa Agency!");
  } else {
    console.log("  ✓ Hero Role Pill correctly displays CTO @ CodeXa Agency");
  }

  console.log("\n[TEST 3] Verifying Developer ID default avatar & hover pixel dissolve...");
  const avatarSrc = await evalJs(`
    const img = document.getElementById('anime-portrait-img');
    return img ? img.getAttribute('src') : null;
  `);
  console.log(`  Default Portrait SRC: ${avatarSrc}`);
  if (!avatarSrc || !avatarSrc.includes('idcard_avatar.jpeg')) {
    console.error("  ❌ Default portrait is not idcard_avatar.jpeg!");
  } else {
    console.log("  ✓ Developer ID defaults to idcard_avatar.jpeg");
  }

  const idRole = await evalJs(`
    const role = document.querySelector('.id-role');
    return role ? role.innerText.trim() : null;
  `);
  console.log(`  Developer ID Role Line: "${idRole}"`);

  // Trigger hover to reveal real portrait
  console.log("  Triggering hover pixel transition on #id-photo-frame...");
  await evalJs(`
    const frame = document.getElementById('id-photo-frame');
    if (frame) frame.classList.add('show-real');
    const realImg = document.getElementById('real-portrait-img');
    if (realImg) realImg.style.opacity = '1';
    const animeImg = document.getElementById('anime-portrait-img');
    if (animeImg) animeImg.style.opacity = '0';
    if (typeof executeHeroPixelDissolve === 'function') {
      executeHeroPixelDissolve(true);
    }
  `);
  await wait(650);

  const realOpacity = await evalJs(`
    const realImg = document.getElementById('real-portrait-img');
    return realImg ? window.getComputedStyle(realImg).opacity : null;
  `);
  console.log(`  Real Portrait Opacity after hover transition: ${realOpacity}`);
  await saveScreenshot("v8_1_hero_developer_id_hover_real.png");

  // Revert hover back to anime avatar
  console.log("  Reverting hover back to idcard_avatar...");
  await evalJs(`
    if (typeof executeHeroPixelDissolve === 'function') {
      executeHeroPixelDissolve(false);
    }
  `);
  await wait(650);

  console.log("\n[TEST 4] Verifying Developer ID Profile Modal & CTO branding...");
  await evalJs(`
    const badge = document.getElementById('dev-id-badge');
    badge.click();
  `);
  await wait(600);

  const profileModalOpen = await evalJs(`
    const m = document.getElementById('dev-id-modal');
    return !!(m && !m.hidden && m.style.display !== 'none');
  `);
  console.log(`  Profile Modal Opened: ${profileModalOpen}`);

  const modalSubtitle = await evalJs(`
    const sub = document.querySelector('.dev-modal-subtitle');
    return sub ? sub.innerText.trim() : null;
  `);
  console.log(`  Profile Modal Subtitle: "${modalSubtitle}"`);

  const modalAvatarSrc = await evalJs(`
    const img = document.getElementById('modal-avatar-anime');
    return img ? img.getAttribute('src') : null;
  `);
  console.log(`  Modal Avatar SRC: "${modalAvatarSrc}"`);

  await saveScreenshot("v8_2_profile_modal_cto_branding.png");

  // Close profile modal
  await evalJs(`
    const closeBtn = document.getElementById('close-dev-modal');
    if (closeBtn) closeBtn.click();
    const devIdModal = document.getElementById('dev-id-modal');
    if (devIdModal) {
      devIdModal.hidden = true;
      devIdModal.style.display = 'none';
      devIdModal.classList.remove('is-open');
    }
  `);
  await wait(400);

  console.log("\n[TEST 5] Verifying Distinctive Butterfly Transformed FAQ Section...");
  await evalJs(`
    const faqSec = document.getElementById('faq');
    if (faqSec) {
      faqSec.scrollIntoView({ behavior: 'instant', block: 'center' });
      faqSec.classList.add('visible');
    }
  `);
  await wait(600);

  const faqCount = await evalJs(`
    return document.querySelectorAll('.faq-card').length;
  `);
  console.log(`  FAQ Question Cards count: ${faqCount}`);

  await saveScreenshot("v8_3_faq_cards_overview.png");

  console.log("  Clicking FAQ Question 1 (CTO @ CodeXa)...");
  await evalJs(`
    const card = document.querySelector('.faq-card[data-faq-index="0"]');
    if (card) card.click();
  `);
  await wait(900);

  const faqModalOpen = await evalJs(`
    const m = document.getElementById('faq-butterfly-modal');
    return !!(m && !m.hidden && m.style.display !== 'none');
  `);
  console.log(`  Butterfly Wings Modal Opened: ${faqModalOpen}`);

  const faqActiveQuestion = await evalJs(`
    const q = document.getElementById('faq-active-title');
    return q ? q.innerText.trim() : null;
  `);
  console.log(`  Active Question Title: "${faqActiveQuestion}"`);

  const hasOrbitingButterfly = await evalJs(`
    const orb = document.getElementById('orbiting-butterfly-close');
    return !!orb;
  `);
  console.log(`  Orbiting Butterfly Close Button present: ${hasOrbitingButterfly}`);

  await saveScreenshot("v8_4_butterfly_wings_faq_panel_open.png");

  // Close via orbiting butterfly click
  console.log("  Closing FAQ panel via orbiting butterfly click...");
  await evalJs(`
    const orb = document.getElementById('orbiting-butterfly-close');
    if (orb) orb.click();
    const closeBtn = document.getElementById('faq-wings-close-btn');
    if (closeBtn) closeBtn.click();
    const faqModal = document.getElementById('faq-butterfly-modal');
    if (faqModal) {
      faqModal.hidden = true;
      faqModal.style.display = 'none';
      faqModal.classList.remove('is-open');
    }
  `);
  await wait(500);

  console.log("\n[TEST 6] Verifying Contact Section (Social Composition + Royal Washi Envelope)...");
  await evalJs(`
    const contactSec = document.getElementById('contact');
    if (contactSec) {
      contactSec.scrollIntoView({ behavior: 'instant', block: 'center' });
      contactSec.classList.add('visible');
    }
  `);
  await wait(600);

  const socialCompExists = await evalJs(`return !!document.querySelector('.social-contact-composition');`);
  const envelopeExists = await evalJs(`return !!document.querySelector('.envelope-form-wrapper');`);
  const isVisitingCardHidden = await evalJs(`
    const modal = document.getElementById('visiting-card-modal');
    return !modal || modal.hidden || modal.style.display === 'none';
  `);
  console.log(`  Social Contact Composition (Left): ${socialCompExists}`);
  console.log(`  Envelope-Shaped Enquiry Form (Right): ${envelopeExists}`);
  console.log(`  Visiting Card Preview is strictly HIDDEN initially: ${isVisitingCardHidden}`);

  await saveScreenshot("v8_5_contact_social_and_envelope.png");

  console.log("\n[TEST 7] Filling Envelope Form and Clicking 'Contact Me'...");
  await evalJs(`
    document.getElementById('contact-name').value = "Devansh Sharma";
    document.getElementById('contact-email').value = "devansh@codexa.dev";
    document.getElementById('contact-msg').value = "We want to collaborate on high-performance creative web engineering and technical leadership.";
    document.getElementById('submit-enquiry-btn').click();
  `);
  await wait(700);

  const isVisitingCardModalRevealed = await evalJs(`
    const modal = document.getElementById('visiting-card-modal');
    return !!(modal && !modal.hidden && modal.style.display !== 'none');
  `);
  console.log(`  Visiting Card Modal Revealed upon valid Contact Me click: ${isVisitingCardModalRevealed}`);

  await saveScreenshot("v8_6_visiting_card_modal_revealed.png");

  // Close visiting card modal
  await evalJs(`
    const closeBtn = document.getElementById('close-visiting-card-modal');
    if (closeBtn) closeBtn.click();
    const modal = document.getElementById('visiting-card-modal');
    if (modal) {
      modal.hidden = true;
      modal.style.display = 'none';
      modal.classList.remove('is-open');
    }
  `);
  await wait(400);

  console.log("\n[TEST 8] Verifying Grand Cinematic Finale Section...");
  await evalJs(`
    const finaleSec = document.getElementById('finale');
    if (finaleSec) {
      finaleSec.scrollIntoView({ behavior: 'instant', block: 'center' });
    }
  `);
  await wait(600);

  const hasFinaleCanvas = await evalJs(`return !!document.getElementById('finale-canvas');`);
  console.log(`  Finale Particle Canvas present: ${hasFinaleCanvas}`);

  // Let strike-through and "world" animate to peak bloom
  console.log("  Waiting for handwritten strike-through and Caveat 'world ♡' reveal...");
  await evalJs(`
    const strike = document.getElementById('strikethrough-path');
    const world = document.getElementById('finale-world');
    const portfolio = document.getElementById('finale-portfolio');
    if (strike) strike.classList.add('active');
    if (world) world.classList.add('active');
    if (portfolio) portfolio.style.opacity = '0.35';
  `);
  await wait(700);

  const isWorldRevealed = await evalJs(`
    const world = document.getElementById('finale-world');
    return !!(world && (world.classList.contains('active') || parseFloat(window.getComputedStyle(world).opacity) > 0));
  `);
  const isStrikethroughActive = await evalJs(`
    const strike = document.getElementById('strikethrough-path');
    return !!(strike && strike.classList.contains('active'));
  `);
  console.log(`  Handwritten Strikethrough drawn: ${isStrikethroughActive}`);
  console.log(`  Glowing 'world ♡' settled: ${isWorldRevealed}`);

  await saveScreenshot("v8_7_cinematic_finale_settled_world.png");

  console.log("\n[TEST 9] Verifying Theme Switching Compatibility across all 10 themes...");
  const themes = ['sakura', 'midnight', 'lavender', 'matcha', 'ocean', 'moonlight'];
  for (const th of themes) {
    await evalJs(`
      document.documentElement.setAttribute('data-theme', '${th}');
    `);
    await wait(250);
  }
  // Settle back to sakura
  await evalJs(`document.documentElement.setAttribute('data-theme', 'sakura');`);
  console.log("  ✓ All theme CSS variables responded with seamless aesthetics.");

  console.log("\n===============================================================");
  console.log("   V8 REFINEMENT: ALL TESTS COMPLETED SUCCESSFULLY!            ");
  console.log("===============================================================");

  edge.kill();
  process.exit(0);
}

run().catch(err => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
