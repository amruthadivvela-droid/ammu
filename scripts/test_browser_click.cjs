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
  console.log("Starting Edge directly with http://localhost:8000/ ...");
  const edge = spawn(EDGE_PATH, [
    '--headless=new',
    '--disable-gpu',
    '--remote-debugging-port=9222',
    '--window-size=1440,900',
    'http://localhost:8000/'
  ]);

  let connected = false;
  let wsUrl = '';

  for (let i = 0; i < 30; i++) {
    await wait(300);
    try {
      const list = await fetchJson('http://localhost:9222/json/list');
      const page = list.find(item => item.type === 'page' && item.url.includes('localhost:8000'));
      if (page && page.webSocketDebuggerUrl) {
        wsUrl = page.webSocketDebuggerUrl;
        connected = true;
        break;
      } else if (list.length > 0 && list[0].webSocketDebuggerUrl) {
        wsUrl = list[0].webSocketDebuggerUrl;
        connected = true;
        break;
      }
    } catch (e) {}
  }

  if (!connected) {
    console.error("Could not connect to Edge DevTools port 9222");
    edge.kill();
    return;
  }

  console.log("Connected to page WebSocket:", wsUrl);
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
      console.log('[BROWSER CONSOLE]', msg.params.type, msg.params.args.map(a => a.value || a.description).join(' '));
    }
    if (msg.method === 'Runtime.exceptionThrown') {
      console.error('[BROWSER EXCEPTION]', msg.params.exceptionDetails.text, msg.params.exceptionDetails.exception ? msg.params.exceptionDetails.exception.description : '');
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
  await send('DOM.enable');

  console.log("Reloading page to catch any initialization exceptions...");
  await send('Page.reload');
  await wait(2000);

  const state = await send('Runtime.evaluate', {
    expression: `(() => {
      const badge = document.getElementById('dev-id-badge');
      const modal = document.getElementById('dev-id-modal');
      const r = badge ? badge.getBoundingClientRect() : null;
      const el = r ? document.elementFromPoint(r.x + r.width/2, r.y + r.height/2) : null;
      return {
        url: window.location.href,
        badgeFound: !!badge,
        badgeRect: r ? { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) } : null,
        topElement: el ? (el.id ? '#' + el.id : (el.className || el.tagName)) : null,
        modalFound: !!modal,
        modalHidden: modal ? modal.hidden : null,
        modalDisplay: modal ? window.getComputedStyle(modal).display : null,
        modalOpacity: modal ? window.getComputedStyle(modal).opacity : null,
        modalClass: modal ? modal.className : null
      };
    })()`,
    returnByValue: true
  });

  const res = state.result && state.result.result ? state.result.result.value : state;
  console.log("State before click:", JSON.stringify(res, null, 2));

  // Now trigger click on badge
  console.log("Clicking badge via JS badge.click()...");
  const clickRes = await send('Runtime.evaluate', {
    expression: `(() => {
      const badge = document.getElementById('dev-id-badge');
      if (badge) badge.click();
      const modal = document.getElementById('dev-id-modal');
      return {
        modalHidden: modal ? modal.hidden : null,
        modalDisplay: modal ? window.getComputedStyle(modal).display : null,
        modalClass: modal ? modal.className : null,
        modalStyleAttr: modal ? modal.getAttribute('style') : null
      };
    })()`,
    returnByValue: true
  });
  console.log("After badge.click():", JSON.stringify(clickRes.result.result.value, null, 2));

  // Now test mouse dispatch click
  if (res.badgeRect) {
    const cx = res.badgeRect.x + res.badgeRect.w / 2;
    const cy = res.badgeRect.y + 40;
    console.log(`Dispatching physical mouse click at (${cx}, ${cy})...`);
    await send('Input.dispatchMouseEvent', { type: 'mousePressed', x: cx, y: cy, button: 'left', clickCount: 1 });
    await wait(100);
    await send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: cx, y: cy, button: 'left', clickCount: 1 });
    await wait(600);

    const mouseRes = await send('Runtime.evaluate', {
      expression: `(() => {
        const modal = document.getElementById('dev-id-modal');
        return {
          modalHidden: modal ? modal.hidden : null,
          modalDisplay: modal ? window.getComputedStyle(modal).display : null,
          modalClass: modal ? modal.className : null
        };
      })()`,
      returnByValue: true
    });
    console.log("After physical mouse click:", JSON.stringify(mouseRes.result.result.value, null, 2));
  }

  // Take screenshot
  const screenshot = await send('Page.captureScreenshot');
  if (screenshot.result && screenshot.result.data) {
    fs.writeFileSync('scripts/test_modal_screenshot.png', Buffer.from(screenshot.result.data, 'base64'));
    console.log("Screenshot saved to scripts/test_modal_screenshot.png");
  }

  ws.close();
  edge.kill();
  console.log("Test finished.");
}

run().catch(console.error);
