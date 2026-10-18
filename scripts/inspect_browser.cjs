(async () => {
  const json = await fetch('http://localhost:9231/json').then(r => r.json());
  const ws = new WebSocket(json[0].webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);
  let id = 1;
  function send(method, params) {
    return new Promise((resolve) => {
      const curId = id++;
      const onMsg = (event) => {
        const data = JSON.parse(event.data);
        if (data.id === curId) {
          ws.removeEventListener('message', onMsg);
          resolve(data.result);
        }
      };
      ws.addEventListener('message', onMsg);
      ws.send(JSON.stringify({ id: curId, method, params }));
    });
  }

  const res = await send('Runtime.evaluate', {
    expression: `(() => {
      const m = document.getElementById('faq-butterfly-modal');
      return {
        exists: !!m,
        display: m ? m.style.display : null,
        hidden: m ? m.hidden : null,
        classes: m ? Array.from(m.classList) : []
      };
    })()`,
    returnByValue: true
  });
  console.log('FAQ modal inspection:', res.result ? res.result.value : res);
  process.exit(0);
})();
