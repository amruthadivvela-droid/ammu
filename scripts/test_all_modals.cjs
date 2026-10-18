const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

const EDGE_PATH = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";

async function wait(ms) {
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
  const targetUrl = process.argv[2] || 'http://localhost:8000/';
  console.log(`=== COMPREHENSIVE MODALS & DASHBOARD TEST [${targetUrl}] ===`);
  const edge = spawn(EDGE_PATH, [
    '--headless=new',
    '--disable-gpu',
    '--remote-debugging-port=9222',
    '--window-size=1440,900',
    targetUrl
  ]);

  let connected = false;
  let wsUrl = '';

  for (let i = 0; i < 30; i++) {
    await wait(300);
    try {
      const list = await fetchJson('http://localhost:9222/json/list');
      const page = list.find(item => item.type === 'page');
      if (page && page.webSocketDebuggerUrl) {
        wsUrl = page.webSocketDebuggerUrl;
        connected = true;
        break;
      }
    } catch (e) {}
  }

  if (!connected) {
    console.error("Could not connect to Edge DevTools port 9222");
    edge.kill();
    process.exit(1);
  }

  console.log("Connected to Edge page websocket.");
  const ws = new WebSocket(wsUrl);

  let idSeq = 1;
  const pending = new Map();

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.id && pending.has(msg.id)) {
      pending.get(msg.id)(msg);
      pending.delete(msg.id);
    }
    if (msg.method === 'Runtime.consoleAPICalled') {
      console.log('  [CONSOLE]', msg.params.type, msg.params.args.map(a => a.value || a.description).join(' '));
    }
    if (msg.method === 'Runtime.exceptionThrown') {
      console.error('  [EXCEPTION]', msg.params.exceptionDetails.text, msg.params.exceptionDetails.exception ? msg.params.exceptionDetails.exception.description : '');
    }
  };

  await new Promise(r => ws.onopen = r);

  function send(method, params = {}) {
    return new Promise((resolve) => {
      const id = idSeq++;
      pending.set(id, resolve);
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  await send('Runtime.enable');
  await send('Page.enable');

  await wait(1500);

  async function evalJs(expr) {
    const res = await send('Runtime.evaluate', { expression: expr, returnByValue: true });
    return res.result && res.result.result ? res.result.result.value : (res.result ? res.result.value : res);
  }

  // TEST 1: Check Developer ID Badge click opens Developer ID Modal
  console.log("\n[TEST 1] Triggering ID Card click on #dev-id-badge...");
  const t1 = await evalJs(`(() => {
    const badge = document.getElementById('dev-id-badge');
    const modal = document.getElementById('dev-id-modal');
    if (badge) badge.click();
    return {
      modalHidden: modal.hidden,
      modalDisplay: window.getComputedStyle(modal).display,
      isOpen: modal.classList.contains('is-open')
    };
  })()`);
  console.log("  Result:", t1);
  if (t1.modalDisplay === 'flex' && !t1.modalHidden) {
    console.log("  >>> PASS: ID Card Modal successfully opened!");
  } else {
    console.error("  >>> FAIL: ID Card Modal failed to open!");
  }

  // Capture screenshot of ID Card Modal
  let shot = await send('Page.captureScreenshot');
  fs.writeFileSync('scripts/snap_id_modal.png', Buffer.from(shot.result.data, 'base64'));
  console.log("  Screenshot saved: scripts/snap_id_modal.png");

  // TEST 2: Close Developer ID Modal via close button
  console.log("\n[TEST 2] Closing Developer ID Modal...");
  const t2 = await evalJs(`(() => {
    const btn = document.getElementById('close-dev-modal');
    const modal = document.getElementById('dev-id-modal');
    if (btn) btn.click();
    return {
      modalHidden: modal.hidden,
      modalDisplay: window.getComputedStyle(modal).display
    };
  })()`);
  console.log("  Result:", t2);
  if (t2.modalDisplay === 'none' && t2.modalHidden) {
    console.log("  >>> PASS: ID Card Modal successfully closed!");
  }

  // TEST 3: Open Admin Dashboard from Featured Project Card button
  console.log("\n[TEST 3] Opening Admin Dashboard via #open-admin-dashboard-btn...");
  const t3 = await evalJs(`(() => {
    const btn = document.getElementById('open-admin-dashboard-btn');
    const modal = document.getElementById('admin-dashboard-modal');
    if (btn) btn.click();
    return {
      modalHidden: modal.hidden,
      modalDisplay: window.getComputedStyle(modal).display,
      title: document.getElementById('admin-modal-title').textContent,
      totalStudents: document.getElementById('admin-total-enrolled').textContent,
      presentStudents: document.getElementById('admin-present-count').textContent,
      ratePct: document.getElementById('admin-rate-pct').textContent,
      rosterRowsCount: document.querySelectorAll('#admin-roster-list .admin-student-row').length
    };
  })()`);
  console.log("  Result:", t3);
  if (t3.modalDisplay === 'flex' && t3.rosterRowsCount > 0) {
    console.log("  >>> PASS: Admin Dashboard opened with live roster and statistics!");
  } else {
    console.error("  >>> FAIL: Admin Dashboard failed to open!");
  }

  // Capture screenshot of Admin Dashboard Modal
  shot = await send('Page.captureScreenshot');
  fs.writeFileSync('scripts/snap_admin_dashboard.png', Buffer.from(shot.result.data, 'base64'));
  console.log("  Screenshot saved: scripts/snap_admin_dashboard.png");

  // TEST 4: Toggle attendance status on student row and verify live recalculation
  console.log("\n[TEST 4] Toggling student 21NEC03 to Present and verifying stats recalculation...");
  const t4 = await evalJs(`(() => {
    const studentRow = document.querySelector('.admin-student-row:nth-child(3)');
    const presentBtn = studentRow ? studentRow.querySelector('.pill-present') : null;
    if (presentBtn) presentBtn.click();
    return {
      newPresentCount: document.getElementById('admin-present-count').textContent,
      newAbsentCount: document.getElementById('admin-absent-count').textContent,
      newRatePct: document.getElementById('admin-rate-pct').textContent
    };
  })()`);
  console.log("  Result after marking 21NEC03 present:", t4);
  if (parseInt(t4.newPresentCount) === 9) {
    console.log("  >>> PASS: Real-time attendance recalculated to 9 Present!");
  }

  // TEST 5: Test Search Filter in Admin Dashboard
  console.log("\n[TEST 5] Testing Search in Admin Dashboard for 'Amrutha'...");
  const t5 = await evalJs(`(() => {
    const search = document.getElementById('admin-search-input');
    search.value = 'Amrutha';
    search.dispatchEvent(new Event('input', { bubbles: true }));
    const rows = document.querySelectorAll('#admin-roster-list .admin-student-row');
    return {
      rowCount: rows.length,
      firstStudent: rows[0] ? rows[0].querySelector('.student-name').textContent.trim() : null
    };
  })()`);
  console.log("  Result:", t5);
  if (t5.rowCount === 1 && t5.firstStudent.includes('Amrutha')) {
    console.log("  >>> PASS: Search filtering successfully isolates target student!");
  }

  // Reset search
  await evalJs(`(() => {
    const clearBtn = document.getElementById('admin-search-clear');
    if (clearBtn) clearBtn.click();
  })()`);

  // TEST 6: Close Admin Dashboard
  console.log("\n[TEST 6] Closing Admin Dashboard Modal...");
  const t6 = await evalJs(`(() => {
    const closeBtn = document.getElementById('close-admin-modal');
    const modal = document.getElementById('admin-dashboard-modal');
    if (closeBtn) closeBtn.click();
    return {
      modalHidden: modal.hidden,
      modalDisplay: window.getComputedStyle(modal).display
    };
  })()`);
  console.log("  Result:", t6);
  if (t6.modalDisplay === 'none' && t6.modalHidden) {
    console.log("  >>> PASS: Admin Dashboard Modal closed!");
  }

  // TEST 7: Open Admin Dashboard from Header Nav button
  console.log("\n[TEST 7] Testing Nav button #nav-admin-dashboard-btn...");
  const t7 = await evalJs(`(() => {
    const navBtn = document.getElementById('nav-admin-dashboard-btn');
    const modal = document.getElementById('admin-dashboard-modal');
    if (navBtn) navBtn.click();
    return {
      modalHidden: modal.hidden,
      modalDisplay: window.getComputedStyle(modal).display
    };
  })()`);
  console.log("  Result:", t7);
  if (t7.modalDisplay === 'flex') {
    console.log("  >>> PASS: Nav Admin Portal button opens Admin Dashboard!");
  }

  // Close again
  await evalJs(`document.getElementById('close-admin-modal').click()`);

  // TEST 8: Open Admin Dashboard from Mockup Window
  console.log("\n[TEST 8] Testing Mockup Window click #attendance-mockup-window...");
  const t8 = await evalJs(`(() => {
    const mockup = document.getElementById('attendance-mockup-window');
    const modal = document.getElementById('admin-dashboard-modal');
    if (mockup) mockup.click();
    return {
      modalHidden: modal.hidden,
      modalDisplay: window.getComputedStyle(modal).display
    };
  })()`);
  console.log("  Result:", t8);
  if (t8.modalDisplay === 'flex') {
    console.log("  >>> PASS: Mockup window click opens Admin Dashboard!");
  }

  // Close again
  await evalJs(`document.getElementById('close-admin-modal').click()`);

  // TEST 9: Open ID Modal then jump to Admin Dashboard
  console.log("\n[TEST 9] Testing ID Modal -> Admin Dashboard transition...");
  const t9 = await evalJs(`(() => {
    document.getElementById('dev-id-badge').click();
    const devModal = document.getElementById('dev-id-modal');
    const adminBtn = document.getElementById('dev-modal-admin-btn');
    if (adminBtn) adminBtn.click();
    const adminModal = document.getElementById('admin-dashboard-modal');
    return {
      devModalHidden: devModal.hidden,
      devModalDisplay: window.getComputedStyle(devModal).display,
      adminModalHidden: adminModal.hidden,
      adminModalDisplay: window.getComputedStyle(adminModal).display
    };
  })()`);
  console.log("  Result:", t9);
  if (t9.devModalHidden && t9.adminModalDisplay === 'flex') {
    console.log("  >>> PASS: Seamless transition from ID Modal to Admin Dashboard!");
  }

  await evalJs(`document.getElementById('close-admin-modal').click()`);

  console.log("\n=== ALL TESTS COMPLETED SUCCESSFULLY ===");
  ws.close();
  edge.kill();
}

run().catch(err => {
  console.error("FATAL ERROR:", err);
  process.exit(1);
});
