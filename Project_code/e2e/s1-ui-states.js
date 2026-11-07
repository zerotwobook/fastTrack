async (page) => {
  const start = new URL(page.url());
  if (start.hostname !== '127.0.0.1' || start.searchParams.get('disposableReview') !== '1') throw new Error('Use the authenticated disposable review.');
  let release; let captured;
  const gate = new Promise(resolve => { release = resolve; });
  const seen = new Promise(resolve => { captured = resolve; });
  const holdTeams = async route => { const response = await route.fetch(); captured(); await gate; await route.fulfill({ response }); };
  try {
    await page.route('**/api/teams', holdTeams);
    await page.goto(`${start.origin}/?disposableReview=1`); await seen;
    await page.getByRole('status').filter({ hasText: 'Loading your team workspace' }).waitFor();
    await page.screenshot({ path: '../output/playwright/ui-workspace-loading.png' });
    release(); await page.locator('.team-row').first().waitFor();
  } finally { release(); await page.unroute('**/api/teams', holdTeams); }
  const failTeams = route => route.fulfill({ status: 503, contentType: 'application/json', body: JSON.stringify({ error: { code: 'TEMPORARILY_UNAVAILABLE', message: 'Synthetic review connection failure.' } }) });
  try {
    await page.route('**/api/teams', failTeams);
    await page.goto(`${start.origin}/?disposableReview=1`);
    await page.getByRole('alert').filter({ hasText: 'Synthetic review connection failure.' }).waitFor();
    await page.setViewportSize({ width: 320, height: 900 });
    await page.screenshot({ path: '../output/playwright/ui-workspace-error-320.png', fullPage: true });
  } finally { await page.unroute('**/api/teams', failTeams); }
  await page.getByRole('button', { name: 'Try again', exact: true }).click();
  await page.locator('.team-row').first().waitFor();
  if (await page.getByRole('alert').count()) throw new Error('Successful retry retained the error.');
  await page.goto(`${start.origin}/milestones/00000000-0000-4000-8000-000000000000?disposableReview=1`);
  await page.getByRole('heading', { name: 'Milestone unavailable' }).waitFor();
  await page.getByRole('link', { name: 'Back to overview', exact: true }).waitFor();
  if (await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)) throw new Error('Unavailable state overflowed.');
  return { passed: ['visible loading state', 'scoped read failure', 'mobile recovery actions', 'retry clears failure', 'unavailable milestone recovery'], method: 'Real API reads with deliberately held and injected failed team responses; genuine unavailable milestone.' };
}
