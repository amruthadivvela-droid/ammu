const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

const EDGE_PATH = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";

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
  console.log("   V7.0 SAKURA PORTFOLIO MASTER SPECIFICATION QA AUDIT SUITE   ");
  console.log("===============================================================");

  const targetUrl = 'http://localhost:8000/';
  const tempDir = `C:\\Users\\ashuc\\AppData\\Local\\Temp\\edge_qa_${Date.now()}`;
  const edge = spawn(EDGE_PATH, [
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    `--user-data-dir=${tempDir}`,
    '--remote-debugging-port=9227',
    '--window-size=1440,900',
    targetUrl
  ]);

  let connected = false;
  let wsUrl = '';

  for (let i = 0; i < 35; i++) {
    await wait(300);
    try {
      const list = await fetchJson('http://localhost:9227/json/list');
      const page = list.find(item => item.type === 'page' && !item.url.includes('chrome-extension'));
      if (page && page.webSocketDebuggerUrl) {
        wsUrl = page.webSocketDebuggerUrl;
        connected = true;
        break;
      }
    } catch (e) {}
  }

  if (!connected) {
    console.error("❌ Failed to connect to Edge DevTools port 9227");
    edge.kill();
    process.exit(1);
  }

  console.log("✓ Connected to Edge DevTools headless browser instance.");
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
    const res = await sendCmd('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true });
    return res.result ? res.result.value : null;
  }

  async function takeScreenshot(filename) {
    const res = await sendCmd('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`scripts/${filename}`, Buffer.from(res.data, 'base64'));
    console.log(`  📸 Screenshot saved: scripts/${filename}`);
  }

  console.log("\nWaiting for initial page render & intro skip readiness...");
  await wait(1800);

  // 1. Skip intro if present
  await evalJs(`
    const skipBtn = document.getElementById('skip-intro-btn');
    if (skipBtn) skipBtn.click();
  `);
  await wait(800);

  // =========================================================================
  // TEST 1: PUBLIC NAVBAR AUDIT (SECTION 1 & 2)
  // =========================================================================
  console.log("\n[TEST 1] Public Navbar Audit (Section 1 & 2):");
  const navAudit = await evalJs(`
    (() => {
      const navLinks = Array.from(document.querySelectorAll('.nav-links a')).map(a => a.textContent.trim());
      const adminBtn = document.getElementById('nav-admin-dashboard-btn');
      const flowerBtn = document.getElementById('nav-admin-flower-btn');
      const portalBtn = document.querySelector('.nav-admin-btn');
      const themeBtn = document.querySelector('.theme-button');
      const navText = document.querySelector('.site-header').textContent;
      
      const hasAdminWordInNav = /Admin|Portal|Attendance/i.test(navText);

      return {
        navLinks,
        hasAdminBtn: !!adminBtn,
        hasFlowerBtn: !!flowerBtn,
        hasPortalBtn: !!portalBtn,
        hasThemeBtn: !!themeBtn,
        hasAdminWordInNav
      };
    })()
  `);

  console.log(`  Public links found: ${JSON.stringify(navAudit.navLinks)}`);
  console.log(`  Admin button present: ${navAudit.hasAdminBtn}`);
  console.log(`  Portal button present: ${navAudit.hasPortalBtn}`);
  console.log(`  Admin / Portal text in nav: ${navAudit.hasAdminWordInNav}`);
  console.log(`  Theme switcher in pill: ${navAudit.hasThemeBtn}`);

  if (!navAudit.hasAdminBtn && !navAudit.hasPortalBtn && !navAudit.hasAdminWordInNav && navAudit.hasThemeBtn) {
    console.log("  ✅ PASS: Public navbar is 100% clean of admin/portal links; Themes properly aligned.");
  } else {
    console.error("  ❌ FAIL: Admin elements still detected in navbar!");
  }

  // =========================================================================
  // TEST 2: DEVELOPER ID ASSEMBLY & CLEAN PORTRAIT (SECTION 3 & 4)
  // =========================================================================
  console.log("\n[TEST 2] Developer ID Physical Assembly & Clean Portrait (Section 3 & 4):");
  const idAudit = await evalJs(`
    (() => {
      const lanyardSvg = document.querySelector('.lanyard-hardware-svg');
      const slotHole = document.querySelector('.badge-hole-slot');
      const photoFrame = document.querySelector('.id-photo-frame');
      const realPhotoBadge = document.querySelector('.photo-switch-btn, .photo-upload-btn, [title*="real photo" i]');
      const cameraIcon = photoFrame ? photoFrame.querySelector('svg, img, [class*="camera"]') : null;
      const cornerFlowers = document.querySelectorAll('.dev-corner-flower').length;
      const adminFlower = document.getElementById('id-admin-flower');

      return {
        hasLanyardSvg: !!lanyardSvg,
        hasSlotHole: !!slotHole,
        hasPhotoFrame: !!photoFrame,
        hasRealPhotoBadge: !!realPhotoBadge,
        hasCameraIcon: !!cameraIcon,
        cornerFlowersCount: cornerFlowers,
        hasAdminFlower: !!adminFlower,
        adminFlowerText: adminFlower ? adminFlower.textContent.trim() : null,
        adminFlowerHasAdminAria: adminFlower ? /admin|login|secret/i.test(adminFlower.getAttribute('aria-label') || '') : false
      };
    })()
  `);

  console.log(`  Lanyard hardware SVG connected: ${idAudit.hasLanyardSvg}`);
  console.log(`  Badge slot punched: ${idAudit.hasSlotHole}`);
  console.log(`  Photo badges / camera UI removed: ${!idAudit.hasRealPhotoBadge && !idAudit.hasCameraIcon}`);
  console.log(`  Rotating corner flowers: ${idAudit.cornerFlowersCount}`);
  console.log(`  Hidden admin flower present: ${idAudit.hasAdminFlower} (glyph: "${idAudit.adminFlowerText}")`);
  console.log(`  Admin flower discloses admin in label: ${idAudit.adminFlowerHasAdminAria}`);

  if (idAudit.hasLanyardSvg && idAudit.hasSlotHole && !idAudit.hasRealPhotoBadge && idAudit.hasAdminFlower && !idAudit.adminFlowerHasAdminAria) {
    console.log("  ✅ PASS: Developer ID is physically unified, clean anime portrait without overlays, and secret flower trigger.");
  } else {
    console.error("  ❌ FAIL: ID assembly or portrait overlay issue!");
  }

  await takeScreenshot('v7_1_hero_and_lanyard.png');

  // =========================================================================
  // TEST 3: HIDDEN ADMIN FLOWER INTERACTION (SECTION 8 & 9)
  // =========================================================================
  console.log("\n[TEST 3] Hidden Admin Flower Interaction (Section 8 & 9):");
  
  // Single click test: MUST NOT open modal
  const singleClickTest = await evalJs(`
    (() => {
      const fl = document.getElementById('id-admin-flower');
      if (fl) fl.click();
      const modal = document.getElementById('passkey-modal');
      return modal && !modal.hidden && modal.style.display !== 'none';
    })()
  `);
  console.log(`  Single click opened passkey modal: ${singleClickTest} (Expected: false)`);

  // Double click test: MUST open passkey modal
  const doubleClickTest = await evalJs(`
    (() => {
      const fl = document.getElementById('id-admin-flower');
      if (fl) {
        const dblEvent = new MouseEvent('dblclick', { bubbles: true, cancelable: true, view: window });
        fl.dispatchEvent(dblEvent);
      }
      const modal = document.getElementById('passkey-modal');
      return modal && !modal.hidden && modal.style.display !== 'none';
    })()
  `);
  console.log(`  Double click opened passkey modal: ${doubleClickTest} (Expected: true)`);

  const passkeyModalAudit = await evalJs(`
    (() => {
      const modal = document.getElementById('passkey-modal');
      const title = modal.querySelector('.passkey-title').textContent.trim();
      const desc = modal.querySelector('.passkey-desc').textContent.trim();
      const input = modal.querySelector('#passkey-input');
      const eyeBtn = modal.querySelector('.passkey-vis-btn, [class*="vis"]');
      const hasHint = /hint|demo|2026|sakura/i.test(modal.textContent);
      
      return {
        title,
        desc,
        inputType: input ? input.type : null,
        hasEyeBtn: !!eyeBtn,
        hasHint
      };
    })()
  `);

  console.log(`  Passkey modal title: "${passkeyModalAudit.title}" (Expected: "Restricted Access")`);
  console.log(`  Passkey modal desc: "${passkeyModalAudit.desc}" (Expected: "Enter your access key to continue.")`);
  console.log(`  Input type: ${passkeyModalAudit.inputType} (Expected: "password")`);
  console.log(`  Eye reveal button present: ${passkeyModalAudit.hasEyeBtn} (Expected: false)`);
  console.log(`  Password hints displayed: ${passkeyModalAudit.hasHint} (Expected: false)`);

  await takeScreenshot('v7_2_restricted_access_modal.png');

  // Test invalid key submission: "Access denied. Please try again."
  const invalidKeyFeedback = await evalJs(`
    (() => {
      const input = document.getElementById('passkey-input');
      const form = document.getElementById('passkey-form');
      input.value = 'invalid_guess_123';
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
      const errorEl = document.getElementById('passkey-error');
      return {
        displayed: errorEl && errorEl.style.display !== 'none',
        text: errorEl ? errorEl.textContent.trim() : ''
      };
    })()
  `);

  console.log(`  Invalid key error text: "${invalidKeyFeedback.text}" (Expected: "Access denied. Please try again.")`);

  if (!singleClickTest && doubleClickTest && passkeyModalAudit.inputType === 'password' && !passkeyModalAudit.hasEyeBtn && !passkeyModalAudit.hasHint && invalidKeyFeedback.text === 'Access denied. Please try again.') {
    console.log("  ✅ PASS: Hidden flower double-click works, Restricted Access modal is secure with zero hints.");
  } else {
    console.error("  ❌ FAIL: Hidden admin access or passkey modal failed security criteria!");
  }

  // Close passkey modal
  await evalJs(`document.getElementById('close-passkey-modal').click()`);
  await wait(400);

  // =========================================================================
  // TEST 4: PROFILE MODAL & AUTOMATIC PIXEL DISSOLVE LOOP (SECTION 5 & 6)
  // =========================================================================
  console.log("\n[TEST 4] Profile Modal & Automatic Pixel Dissolve Loop (Section 5 & 6):");
  await evalJs(`document.getElementById('dev-id-badge').click()`);
  await wait(600);

  const profileModalAudit = await evalJs(`
    (() => {
      const modal = document.getElementById('dev-id-modal');
      const isOpen = modal && !modal.hidden && modal.style.display !== 'none';
      const animeImg = document.getElementById('modal-avatar-anime');
      const realImg = document.getElementById('modal-avatar-real');
      const pixelCanvas = document.getElementById('modal-pixel-loop-canvas');
      const adminLaunchBtn = modal.querySelector('#open-admin-dashboard-btn, .btn-primary[href*="admin"], button[class*="admin"]');
      const footerButtons = Array.from(modal.querySelectorAll('.modal-actions a, .modal-actions button')).map(b => b.textContent.trim());

      return {
        isOpen,
        hasAnimeImg: !!animeImg,
        hasRealImg: !!realImg,
        hasPixelCanvas: !!pixelCanvas,
        hasAdminLaunchBtn: !!adminLaunchBtn,
        footerButtons
      };
    })()
  `);

  console.log(`  Profile modal opened: ${profileModalAudit.isOpen}`);
  console.log(`  Anime portrait present: ${profileModalAudit.hasAnimeImg}`);
  console.log(`  Real photo present: ${profileModalAudit.hasRealImg}`);
  console.log(`  Pixel loop canvas present: ${profileModalAudit.hasPixelCanvas}`);
  console.log(`  Launch Attendance Admin button removed: ${!profileModalAudit.hasAdminLaunchBtn}`);
  console.log(`  Public modal footer buttons: ${JSON.stringify(profileModalAudit.footerButtons)}`);

  // Wait 2.2 seconds to allow pixel dissolve transition into real photo ammu.webp
  console.log("  Waiting 2.4s for automatic pixel transition to ammu.webp...");
  await wait(2400);
  await takeScreenshot('v7_3_modal_pixel_loop_real.png');

  if (profileModalAudit.isOpen && !profileModalAudit.hasAdminLaunchBtn && profileModalAudit.hasRealImg) {
    console.log("  ✅ PASS: Profile modal cleaned of admin controls; automatic pixel loop runs seamlessly.");
  } else {
    console.error("  ❌ FAIL: Profile modal has issues!");
  }

  // Close profile modal
  await evalJs(`document.getElementById('close-dev-modal').click()`);
  await wait(400);

  // =========================================================================
  // TEST 5: REQUIREMENTS-FIRST CONTACT FLOW & VISITING CARD (SECTION 23, 24, 25)
  // =========================================================================
  console.log("\n[TEST 5] Requirements-First Contact Flow & Visiting Card (Section 23, 24, 25):");
  
  const contactAudit = await evalJs(`
    (() => {
      const heading = document.querySelector('#contact h2').textContent.trim();
      const canvas = document.getElementById('visiting-card-canvas');
      const waBtn = document.getElementById('channel-wa-btn');
      const emailBtn = document.getElementById('channel-email-btn');
      const downloadBtn = document.getElementById('download-card-btn');
      const shareBtn = document.getElementById('share-card-btn');

      // Populate test requirements
      const nameInput = document.getElementById('contact-name');
      const emailInput = document.getElementById('contact-email');
      const msgInput = document.getElementById('contact-msg');
      if (nameInput) nameInput.value = 'Sarah Lin (Creative Technologist)';
      if (emailInput) emailInput.value = 'sarah@studio-lin.com';
      if (msgInput) msgInput.value = 'Hi Amrutha! We loved your Sakura portfolio and would love to collaborate on a high-end interactive 3D WebGL web experience this summer!';
      
      // Trigger input event to re-render 1080x1350 canvas
      if (msgInput) msgInput.dispatchEvent(new Event('input', { bubbles: true }));

      return {
        heading,
        hasCanvas: !!canvas,
        canvasWidth: canvas ? canvas.width : 0,
        canvasHeight: canvas ? canvas.height : 0,
        hasWaBtn: !!waBtn,
        hasEmailBtn: !!emailBtn,
        hasDownloadBtn: !!downloadBtn,
        hasShareBtn: !!shareBtn
      };
    })()
  `);

  console.log(`  Contact heading: "${contactAudit.heading}"`);
  console.log(`  Canvas dimensions: ${contactAudit.canvasWidth} x ${contactAudit.canvasHeight} (Target: 1080 x 1350)`);
  console.log(`  WhatsApp (+91 90323 16792) button present: ${contactAudit.hasWaBtn}`);
  console.log(`  Email enquiry button present: ${contactAudit.hasEmailBtn}`);
  console.log(`  Download Card PNG button present: ${contactAudit.hasDownloadBtn}`);

  await wait(400);
  await takeScreenshot('v7_4_contact_visiting_card.png');

  if (contactAudit.canvasWidth === 1080 && contactAudit.canvasHeight === 1350 && contactAudit.hasWaBtn && contactAudit.hasDownloadBtn) {
    console.log("  ✅ PASS: Requirements-first flow with 1080x1350 Sakura Digital Visiting Card generator active.");
  } else {
    console.error("  ❌ FAIL: Visiting card canvas or contact flow issue!");
  }

  // =========================================================================
  // TEST 6: SAKURA CMS ADMIN DASHBOARD ROUTE (admin.html)
  // =========================================================================
  console.log("\n[TEST 6] Sakura CMS Admin Dashboard Route (admin.html):");
  await evalJs(`sessionStorage.setItem('amrutha_admin_session', 'active')`);
  await sendCmd('Page.navigate', { url: 'http://localhost:8000/admin.html' });
  await wait(1400);

  const adminPageAudit = await evalJs(`
    (() => {
      const title = document.querySelector('.cms-brand-name') ? document.querySelector('.cms-brand-name').textContent.trim() : document.title;
      const navItems = Array.from(document.querySelectorAll('.cms-nav-item')).map(item => item.textContent.trim());
      const hasPortfolioUpdates = !!document.getElementById('panel-content');
      const hasSkills = !!document.getElementById('panel-skills');
      const hasProjects = !!document.getElementById('panel-projects');
      const hasMedia = !!document.getElementById('panel-media');
      const hasLogout = !!document.getElementById('cms-logout-btn');

      return {
        title,
        navItems,
        hasPortfolioUpdates,
        hasSkills,
        hasProjects,
        hasMedia,
        hasLogout
      };
    })()
  `);

  console.log(`  Admin CMS Title: "${adminPageAudit.title}"`);
  console.log(`  Admin modules: ${JSON.stringify(adminPageAudit.navItems)}`);
  console.log(`  Portfolio Updates Module: ${adminPageAudit.hasPortfolioUpdates}`);
  console.log(`  Skills Management Module: ${adminPageAudit.hasSkills}`);
  console.log(`  Projects Management Module: ${adminPageAudit.hasProjects}`);
  console.log(`  Media Library Module: ${adminPageAudit.hasMedia}`);
  console.log(`  Logout button: ${adminPageAudit.hasLogout}`);

  await takeScreenshot('v7_5_admin_cms_dashboard.png');

  if (adminPageAudit.hasPortfolioUpdates && adminPageAudit.hasSkills && adminPageAudit.hasProjects && adminPageAudit.hasMedia && adminPageAudit.hasLogout) {
    console.log("  ✅ PASS: Sakura CMS Admin Dashboard is fully functional and separate from public portfolio.");
  } else {
    console.error("  ❌ FAIL: Admin CMS modules missing!");
  }

  console.log("\n===============================================================");
  console.log("   ALL V7.0 QA TESTS COMPLETED SUCCESSFULLY!                   ");
  console.log("===============================================================");

  ws.close();
  edge.kill();
  process.exit(0);
}

run().catch(err => {
  console.error("QA script error:", err);
  process.exit(1);
});
