async (page) => {
  // Run only against the explicitly selected disposable review server, signed in as Supervisor A.
  const url = new URL(page.url());
  if (url.hostname !== '127.0.0.1' || url.searchParams.get('disposableReview') !== '1' || !url.pathname.endsWith('/milestones/new')) throw new Error('Open a disposable review milestone form with ?disposableReview=1.');
  const title = page.getByLabel('Title', { exact: true });
  const description = page.getByLabel('Description', { exact: true });
  await title.fill('Review draft retained'); await description.fill('Private unsaved milestone description');
  await page.getByLabel('Deadline in Asia/Bangkok').fill('2030-01-02T18:30');
  const visibility = async value => page.evaluate(state => {
    Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => state });
    document.dispatchEvent(new Event('visibilitychange'));
  }, value);
  let release; let captured;
  const gate = new Promise(resolve => { release = resolve; });
  const seen = new Promise(resolve => { captured = resolve; });
  const hold = async route => { const response = await route.fetch(); captured(); await gate; await route.fulfill({ response }); };
  try {
    await page.route('**/api/auth/me', hold);
    await visibility('hidden'); await page.getByText('Checking your session…', { exact: true }).waitFor();
    if (await title.isVisible()) throw new Error('Private form remained visible while suspended.');
    await visibility('visible'); await seen;
    if (await title.isVisible()) throw new Error('Private form revealed before session verification.');
    release(); await title.waitFor({ state: 'visible' });
    if (await title.inputValue() !== 'Review draft retained' || await description.inputValue() !== 'Private unsaved milestone description' || await page.getByLabel('Deadline in Asia/Bangkok').inputValue() !== '2030-01-02T18:30') throw new Error('Same-session verification lost a draft field.');
  } finally { release(); await page.unroute('**/api/auth/me', hold); }
  const offline = route => route.abort('failed');
  await page.route('**/api/auth/me', offline);
  await visibility('hidden'); await visibility('visible'); await page.getByRole('heading', { name: 'Unable to continue' }).waitFor();
  if (await title.isVisible()) throw new Error('Private form visible after verification failure.');
  await page.unroute('**/api/auth/me', offline); await page.getByRole('button', { name: 'Try again', exact: true }).click();
  await title.waitFor({ state: 'visible' }); if (await title.inputValue() !== 'Review draft retained') throw new Error('Retry lost the same-session draft.');
  await page.setViewportSize({ width: 390, height: 844 }); await page.getByRole('button', { name: 'Menu', exact: true }).click();
  await page.getByRole('dialog').waitFor({ state: 'visible' }); await visibility('hidden');
  await page.getByRole('dialog').waitFor({ state: 'hidden' }); await visibility('visible'); await title.waitFor({ state: 'visible' });
  const expired = await page.evaluate(async () => {
    const me = await (await fetch('/api/auth/me')).json();
    return (await fetch('/api/auth/logout', { method: 'POST', headers: { 'X-CSRF-Token': me.data.csrfToken } })).status;
  });
  if (expired !== 204) throw new Error('Could not revoke the disposable session.');
  await visibility('hidden'); await visibility('visible'); await page.getByRole('heading', { name: 'Sign in', exact: true }).waitFor();
  if (await title.count() !== 0) throw new Error('Expired-session draft remains mounted.');
  await page.evaluate(() => { delete document.visibilityState; });
  return { passed: ['same-session draft fields', 'private UI masked during verification', 'failed verification masked', 'retry preserves draft', 'modal closed while masked', 'revoked session discards draft'], method: 'Controlled document.visibilityState and visibilitychange events on the real compiled app; not a native tab-switch claim.' };
}
