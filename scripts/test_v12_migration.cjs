const http = require('http');

function get(path) {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:5173${path}`, (res) => {
      let data = [];
      res.on('data', chunk => data.push(chunk));
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body: Buffer.concat(data)
        });
      });
    }).on('error', reject);
  });
}

function post(path, body, headers = {}) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(body);
    const req = http.request(`http://localhost:5173${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
        ...headers
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

async function runTests() {
  console.log('--- TESTING AMRUTHA SAKURA PORTFOLIO V12.0 REACT MIGRATION ---');
  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      await fn();
      console.log(`[PASS] ${name}`);
      passed++;
    } catch (e) {
      console.error(`[FAIL] ${name}: ${e.message}`);
      failed++;
    }
  }

  // 1. Root page
  await test('GET / returns 200 and loads root HTML', async () => {
    const res = await get('/');
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
    const text = res.body.toString('utf8');
    if (!text.includes('id="root"')) throw new Error('Missing #root container in HTML');
    if (!text.includes('src="/src/main.jsx"')) throw new Error('Missing Vite main.jsx entry');
  });

  // 2. Direct SPA Route: /admin/login
  await test('GET /admin/login directly loads SPA HTML', async () => {
    const res = await get('/admin/login');
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
    const text = res.body.toString('utf8');
    if (!text.includes('id="root"')) throw new Error('Missing #root container in SPA fallback');
  });

  // 3. Direct SPA Route: /admin
  await test('GET /admin directly loads SPA HTML', async () => {
    const res = await get('/admin');
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
    const text = res.body.toString('utf8');
    if (!text.includes('id="root"')) throw new Error('Missing #root container in SPA fallback');
  });

  // 4. Static Assets
  await test('GET /assets/ammu.webp loads image', async () => {
    const res = await get('/assets/ammu.webp');
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
    if (res.body.length < 50000) throw new Error(`File too small: ${res.body.length} bytes`);
  });

  await test('GET /assets/idcard_avatar.jpeg loads image', async () => {
    const res = await get('/assets/idcard_avatar.jpeg');
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
    if (res.body.length < 10000) throw new Error(`File too small: ${res.body.length} bytes`);
  });

  await test('GET /resume.pdf loads PDF', async () => {
    const res = await get('/resume.pdf');
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
    if (res.body.length < 1000) throw new Error(`File too small: ${res.body.length} bytes`);
  });

  // 5. Contact API - Validation Failure
  await test('POST /api/contact validation error on empty fields', async () => {
    const res = await post('/api/contact', { name: '', email: '', message: '' });
    if (res.status !== 400) throw new Error(`Expected 400 but got ${res.status}`);
    const parsed = JSON.parse(res.body);
    if (!parsed.message) throw new Error('Missing error message in response');
  });

  // 6. Contact API - Live Submission
  await test('POST /api/contact valid submission returns WhatsApp URL', async () => {
    const testId = `test_${Date.now()}`;
    const res = await post('/api/contact', {
      name: 'Automated Migration Test',
      email: 'notifications@codeaxisapply.xyz',
      message: 'Testing complete React V12.0 architecture and WhatsApp routing.'
    }, { 'Idempotency-Key': testId });

    if (res.status !== 200) throw new Error(`Expected 200 but got ${res.status}: ${res.body}`);
    const parsed = JSON.parse(res.body);
    if (!parsed.readyForWhatsApp) throw new Error('readyForWhatsApp is not true');
    if (!parsed.whatsappUrl || !parsed.whatsappUrl.includes('919032316792')) {
      throw new Error(`Invalid whatsappUrl: ${parsed.whatsappUrl}`);
    }
  });

  console.log(`\nRESULTS: ${passed} passed, ${failed} failed.`);
  if (failed > 0) process.exit(1);
}

runTests();
