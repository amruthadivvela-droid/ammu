const { spawn } = require('child_process');
const http = require('http');

const EDGE_PATH = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";

async function run() {
  const edge = spawn(EDGE_PATH, [
    '--headless=new',
    '--disable-gpu',
    '--remote-debugging-port=9223',
    'http://localhost:8000/'
  ]);

  await new Promise(r => setTimeout(r, 1200));

  const list = await new Promise((res, rej) => {
    http.get('http://localhost:9223/json/list', r => {
      let d = '';
      r.on('data', c => d += c);
      r.on('end', () => res(JSON.parse(d)));
    }).on('error', rej);
  });

  const page = list.find(p => p.type === 'page' && !p.url.includes('chrome-extension'));
  const ws = new WebSocket(page.webSocketDebuggerUrl);

  let id = 1;
  const pending = new Map();
  ws.onmessage = e => {
    const msg = JSON.parse(e.data);
    if (msg.method === 'Runtime.consoleAPICalled') {
      console.log('CONSOLE:', msg.params.type, msg.params.args.map(a => a.value || a.description));
    }
    if (msg.method === 'Runtime.exceptionThrown') {
      console.log('EXCEPTION:', msg.params.exceptionDetails.text, msg.params.exceptionDetails.exception);
    }
    if (msg.id && pending.has(msg.id)) {
      pending.get(msg.id)(msg.result);
      pending.delete(msg.id);
    }
  };

  const send = (method, params = {}) => new Promise(res => {
    const i = id++;
    pending.set(i, res);
    ws.send(JSON.stringify({ id: i, method, params }));
  });

  await new Promise(r => ws.onopen = r);
  await send('Page.enable');
  await send('Runtime.enable');

  await new Promise(r => setTimeout(r, 1000));

  // Check what happens when double clicking id-admin-flower
  const dblRes = await send('Runtime.evaluate', {
    expression: `
      (() => {
        try {
          const fl = document.getElementById('id-admin-flower');
          const dbl = new MouseEvent('dblclick', { bubbles: true, cancelable: true });
          fl.dispatchEvent(dbl);
          const modal = document.getElementById('passkey-modal');
          return {
            modalFound: !!modal,
            display: modal.style.display,
            hidden: modal.hidden,
            classes: modal.className
          };
        } catch (err) {
          return { error: err.message, stack: err.stack };
        }
      })()
    `,
    returnByValue: true
  });
  console.log('DBLCLICK RESULT:', JSON.stringify(dblRes.result ? dblRes.result.value : null));

  // Check what happens when clicking dev-id-badge
  const badgeRes = await send('Runtime.evaluate', {
    expression: `
      (() => {
        try {
          const badge = document.getElementById('dev-id-badge');
          badge.click();
          const modal = document.getElementById('dev-id-modal');
          return {
            modalFound: !!modal,
            display: modal.style.display,
            hidden: modal.hidden,
            classes: modal.className
          };
        } catch (err) {
          return { error: err.message, stack: err.stack };
        }
      })()
    `,
    returnByValue: true
  });
  console.log('BADGE CLICK RESULT:', JSON.stringify(badgeRes.result ? badgeRes.result.value : null));

  ws.close();
  edge.kill();
  process.exit(0);
}

run().catch(e => { console.error(e); process.exit(1); });
