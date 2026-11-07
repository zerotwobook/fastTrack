async (page) => {
  const url = new URL(page.url());
  if (url.hostname !== '127.0.0.1' || url.searchParams.get('disposableReview') !== '1') throw new Error('Use the disposable student review overview with ?disposableReview=1.');
  const data = await page.evaluate(async () => {
    const me = await (await fetch('/api/auth/me')).json(); if (me.data.user.role !== 'student') throw new Error('Student session required.');
    const teams = (await (await fetch('/api/teams')).json()).data;
    if (teams.length !== 1) throw new Error('One synthetic review team required.');
    return await (await fetch(`/api/teams/${teams[0].id}/milestones`)).json();
  });
  const headings = ['Work to submit', 'Overdue', 'Submitted work', 'Cancelled'];
  const expected = { 'Work to submit': [], Overdue: [], 'Submitted work': [], Cancelled: [] };
  for (const item of data.data) expected[item.cancelledAt ? 'Cancelled' : item.latestSubmission ? 'Submitted work' : Date.parse(item.dueAt) < Date.parse(data.meta.serverTime) ? 'Overdue' : 'Work to submit'].push(item);
  for (const heading of headings) {
    if (!expected[heading].length) throw new Error(`Prepare at least one ${heading} review fixture first.`);
    const section = page.getByRole('region', { name: heading, exact: true }); await section.waitFor();
    const links = section.getByRole('heading', { level: 4 }).getByRole('link');
    if (JSON.stringify(await links.allTextContents()) !== JSON.stringify(expected[heading].map(item => item.title))) throw new Error(`Wrong order/membership in ${heading}.`);
    if (await section.getByRole('link', { name: 'Submit work', exact: true }).count() !== (heading === 'Work to submit' ? expected[heading].length : 0)) throw new Error(`Wrong submit eligibility in ${heading}.`);
  }
  const actualOrder = await page.locator('section[aria-label="Milestones"] h3').allTextContents();
  if (JSON.stringify(actualOrder) !== JSON.stringify(headings)) throw new Error('Actionable group is not first.');
  const widths = [];
  for (const width of [320, 390, 768, 1200, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    if (await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)) throw new Error(`Horizontal overflow at ${width}.`);
    widths.push(width);
  }
  return { passed: ['actionable first', 'separate overdue/submitted/cancelled groups', 'canonical ordering and complete membership', 'direct submit only for eligible work', 'no horizontal overflow'], widths, groups: Object.fromEntries(Object.entries(expected).map(([heading, rows]) => [heading, rows.length])) };
}
