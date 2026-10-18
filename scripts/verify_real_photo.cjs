const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

async function wait(ms) { return new Promise(r => setTimeout(r, ms)); }
function fetchJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });
}

(async () => {
  const edge = spawn('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', [
    '--headless=new', '--disable-gpu', '--remote-debugging-port=9224', '--window-size=1440,900', 'http://localhost:8000/'
  ]);
  let wsUrl = '';
  for (let i = 0; i < 20; i++) {
    await wait(300);
    try {
      const list = await fetchJson('http://localhost:9224/json/list');
      const p = list.find(x => x.type === 'page');
      if (p && p.webSocketDebuggerUrl) { wsUrl = p.webSocketDebuggerUrl; break; }
    } catch(e) {}
  }
  const ws = new WebSocket(wsUrl);
  let id = 1;
  const pending = new Map();
  ws.onmessage = e => {
    const m = JSON.parse(e.data);
    if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); }
  };
  await new Promise(r => ws.onopen = r);
  function send(method, params = {}) {
    return new Promise(r => {
      const cur = id++;
      pending.set(cur, r);
      ws.send(JSON.stringify({ id: cur, method, params }));
    });
  }
  await send('Runtime.enable');
  await send('Page.enable');
  await wait(800);

  // Skip intro immediately to test ID card
  await send('Runtime.evaluate', { expression: 'window.skipIntro()' });
  await wait(500);

  // Trigger click on photo switch button
  await send('Runtime.evaluate', {
    expression: "document.getElementById('photo-switch-btn').click()",
    returnByValue: true
  });

  await wait(600); // wait for 460ms pixel dissolve to complete

  const state = await send('Runtime.evaluate', {
    expression: "(() => {\n" +
      "const photoFrame = document.getElementById('id-photo-frame');\n" +
      "const real = document.getElementById('real-portrait-img');\n" +
      "const anime = document.getElementById('anime-portrait-img');\n" +
      "return {\n" +
      "  hasShowReal: photoFrame.classList.contains('show-real'),\n" +
      "  realOpacity: window.getComputedStyle(real).opacity,\n" +
      "  realSrc: real.getAttribute('src'),\n" +
      "  animeOpacity: window.getComputedStyle(anime).opacity\n" +
      "};\n" +
    "})()",
    returnByValue: true
  });

  console.log('REAL PHOTO STATE AFTER DISSOLVE:', state.result.result.value);

  const shot = await send('Page.captureScreenshot');
  fs.writeFileSync('scripts/cinematic_real_photo_confirmed.png', Buffer.from(shot.result.data, 'base64'));
  console.log('Saved screenshot: scripts/cinematic_real_photo_confirmed.png');

  ws.close();
  edge.kill();
  process.exit(0);
})();
