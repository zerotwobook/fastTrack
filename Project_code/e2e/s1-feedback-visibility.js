async (page) => {
  const url = new URL(page.url()); const id = /^\/submissions\/([a-f0-9-]{36})$/i.exec(url.pathname)?.[1];
  if (url.hostname !== '127.0.0.1' || url.searchParams.get('disposableReview') !== '1' || !id) throw new Error('Open a disposable review submission as its assigned supervisor.');
  const path = `/api/submissions/${id}/feedback`; const content = `Review frozen intent ${Date.now()}`;
  const field = page.getByLabel('Your feedback', { exact: true }); await field.fill(content);
  let posts = 0; let intent; let blockReads = true;
  const lostResponse = async route => {
    if (route.request().method() === 'POST') {
      posts++; intent = route.request().postDataJSON();
      const response = await route.fetch(); if (response.status() !== 201) throw new Error('Real review write failed.');
      await route.abort('failed');
    } else if (blockReads) await route.abort('failed');
    else await route.continue();
  };
  const visibility = value => page.evaluate(state => {
    Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => state });
    document.dispatchEvent(new Event('visibilitychange'));
  }, value);
  let release; let captured;
  const gate = new Promise(resolve => { release = resolve; }); const seen = new Promise(resolve => { captured = resolve; });
  const holdMe = async route => { const response = await route.fetch(); captured(); await gate; await route.fulfill({ response }); };
  try {
    await page.route(`**${path}`, lostResponse);
    await page.getByRole('button', { name: 'Save feedback', exact: true }).click();
    const check = page.getByRole('button', { name: 'Check saved feedback', exact: true }); await check.waitFor();
    if (await field.inputValue() !== content || !await field.evaluate(element => element.readOnly)) throw new Error('Unknown-save intent was not frozen.');
    await page.route('**/api/auth/me', holdMe); await visibility('hidden'); await visibility('visible'); await seen;
    if (await field.isVisible()) throw new Error('Frozen private intent visible while checking the session.');
    release(); await field.waitFor({ state: 'visible' });
    if (await field.inputValue() !== content || !await field.evaluate(element => element.readOnly)) throw new Error('Revalidation discarded or unlocked the frozen intent.');
    blockReads = false; await check.click(); await page.locator('article').getByText(content, { exact: true }).waitFor();
    const rows = await page.evaluate(async path => (await (await fetch(path)).json()).data, path);
    if (posts !== 1 || rows.filter(row => row.clientRequestId === intent.clientRequestId && row.content === intent.content).length !== 1) throw new Error('Recovery changed the intent or duplicated a write.');
    if (await field.inputValue() !== '' || await field.evaluate(element => element.readOnly)) throw new Error('Confirmed recovery did not release the form.');
    return { passed: ['real committed POST with lost response', 'failed reconciliation freezes original body and UUID', 'same-session verification masks and preserves frozen intent', 'explicit check finds the exact saved row without another POST', 'one persisted write and usable cleared form'], method: 'Real compiled UI/API; deliberately abort the POST response after server commit and the first reconciliation read.' };
  } finally { release(); await page.unroute(`**${path}`, lostResponse); await page.unroute('**/api/auth/me', holdMe); await page.evaluate(() => { delete document.visibilityState; }); }
}
