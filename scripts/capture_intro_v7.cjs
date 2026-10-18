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
  const targetUrl = 'http://localhost:8000/';
  const tempDir = `C:\\Users\\ashuc\\AppData\\Local\\Temp\\edge_intro_${Date.now()}`;
  const edge = spawn(EDGE_PATH, [
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    `--user-data-dir=${tempDir}`,
    '--remote-debugging-port=9229',
    '--window-size=1440,900',
    targetUrl
  ]);

  let wsUrl = '';
  for (let i = 0; i < 35; i++) {
    await wait(300);
    try {
      const list = await fetchJson('http://localhost:9229/json/list');
      const page = list.find(item => item.type === 'page' && !item.url.includes('chrome-extension'));
      if (page && page.webSocketDebuggerUrl) {
        wsUrl = page.webSocketDebuggerUrl;
        break;
      }
    } catch (e) {}
  }

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
    await new Promise(r => { ws.onopen = r; ws.onerror = r; });
  }

  await sendCmd('Page.enable');
  await sendCmd('Runtime.enable');

  async function snap(filename) {
    const res = await sendCmd('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`scripts/${filename}`, Buffer.from(res.data, 'base64'));
    console.log(`Saved screenshot scripts/${filename}`);
  }

  // 1. Butterfly arrival (~1.8s)
  await wait(1800);
  await snap('v7_intro_1_arrival.png');

  // 2. WELCOME formation (~3.2s)
  await wait(1800);
  await snap('v7_intro_2_welcome.png');

  // 3. Falling sign "to my world" (~4.5s)
  await wait(1400);
  await snap('v7_intro_3_hanging_sign.png');

  // 4. Petals & Cloud reveal (~6.2s)
  await wait(1600);
  await snap('v7_intro_4_cloud_reveal.png');

  ws.close();
  edge.kill();
  process.exit(0);
}

run().catch(e => { console.error(e); process.exit(1); });
