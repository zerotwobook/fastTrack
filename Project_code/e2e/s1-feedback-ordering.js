async (page) => {
  const url = new URL(page.url()); const id = /^\/submissions\/([a-f0-9-]{36})$/i.exec(url.pathname)?.[1];
  if (url.hostname !== '127.0.0.1' || url.searchParams.get('disposableReview') !== '1' || !id) throw new Error('Open a disposable review submission with ?disposableReview=1 as its assigned supervisor.');
  const endpoint = `/api/submissions/${id}/feedback`; const tag = `Review ordering ${Date.now()}`;
  const older = `${tag} existing`; const saved = `${tag} saved`; const afterFailure = `${tag} after stale failure`;
  const seeded = await page.evaluate(async ({ endpoint, older }) => {
    const me = await (await fetch('/api/auth/me')).json();
    const response = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': me.data.csrfToken }, body: JSON.stringify({ content: older, clientRequestId: crypto.randomUUID() }) });
    return response.status;
  }, { endpoint, older });
  if (seeded !== 201) throw new Error('Synthetic review feedback seed failed.');
  const entry = content => page.locator('article').getByText(content, { exact: true });
  const race = async (content, fail) => {
    let release; let captured; let once = false;
    const gate = new Promise(resolve => { release = resolve; }); const seen = new Promise(resolve => { captured = resolve; });
    const hold = async route => {
      if (route.request().method() !== 'GET' || once) return route.continue();
      once = true; const response = await route.fetch(); captured(); await gate;
      if (fail) await route.fulfill({ status: 503, contentType: 'application/json', body: JSON.stringify({ error: { code: 'TEMPORARILY_UNAVAILABLE', message: 'Synthetic delayed review read failure.' } }) });
      else await route.fulfill({ response });
    };
    try {
      await page.route(`**${endpoint}`, hold); await page.goto(url.href); await seen;
      await page.getByLabel('Your feedback', { exact: true }).fill(content); await page.getByRole('button', { name: 'Save feedback', exact: true }).click();
      await entry(content).waitFor();
      const applied = page.waitForResponse(response => new URL(response.url()).pathname === endpoint && response.request().method() === 'GET');
      release(); await (await applied).finished();
      await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
      await page.getByText('Loading feedback...', { exact: true }).waitFor({ state: 'hidden' });
      // Await the held request's React update, then compare the visible list with a fresh real API read.
      await page.waitForFunction(text => !document.body.innerText.includes(text), 'Synthetic delayed review read failure.');
      await entry(content).waitFor(); if (!fail) await entry(older).waitFor();
      const persisted = await page.evaluate(async endpoint => (await (await fetch(endpoint)).json()).data.map(row => row.content), endpoint);
      if (!persisted.includes(content) || !persisted.includes(older)) throw new Error('Real server rows are missing.');
      if (await entry(content).count() !== 1 || !fail && await entry(older).count() !== 1) throw new Error('Feedback was lost or duplicated after an older GET.');
    } finally { release(); await page.unroute(`**${endpoint}`, hold); }
  };
  await race(saved, false); await race(afterFailure, true);
  await page.reload(); await entry(saved).waitFor(); await entry(older).waitFor(); await entry(afterFailure).waitFor();
  const layouts = [];
  for (const width of [320, 390, 768, 1200, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    const measurements = await page.getByLabel('Your feedback', { exact: true }).evaluate(field => {
      const form = field.closest('form'); const button = form.querySelector('button[type="submit"]');
      return { field: field.getBoundingClientRect().width, button: button.getBoundingClientRect().width, hint: getComputedStyle(document.getElementById(field.id + '-hint')).fontSize, overflow: document.documentElement.scrollWidth > innerWidth };
    });
    if (measurements.overflow || measurements.hint !== '14px' || width < 768 && Math.abs(measurements.button - measurements.field) > 1) throw new Error(`Layout regression at ${width}: ${JSON.stringify(measurements)}`);
    layouts.push({ width, ...measurements });
  }
  return { passed: ['held genuine initial GET merges old and newly saved rows', 'delayed read failure cannot hide confirmed save', 'no duplicate feedback', 'real persisted rows match visible results', 'mobile CTA and helper sizing'], layouts, method: 'Actual compiled UI and API; GET success body captured from real server before the real POST. The delayed failure is deliberately injected.' };
}
