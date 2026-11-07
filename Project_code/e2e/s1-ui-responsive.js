async (page) => {
  const start = new URL(page.url());
  if (start.hostname !== '127.0.0.1' || start.searchParams.get('disposableReview') !== '1') {
    throw new Error('Use the authenticated disposable review with ?disposableReview=1.');
  }
  const context = await page.evaluate(async () => {
    const read = async path => {
      const response = await fetch(`/api${path}`);
      if (!response.ok) throw new Error(`Review read failed: ${path}`);
      return (await response.json()).data;
    };
    const auth = await read('/auth/me');
    const teams = await read('/teams');
    if (teams.length !== 1) throw new Error('Use a synthetic account with one review team.');
    return { role: auth.user.role, team: teams[0], items: await read(`/teams/${teams[0].id}/milestones`) };
  });
  const pending = context.items.find(item => !item.cancelledAt && !item.latestSubmission && Date.parse(item.dueAt) > Date.now());
  const saved = context.items.find(item => item.latestSubmission);
  const overdue = context.items.find(item => !item.latestSubmission && Date.parse(item.dueAt) < Date.now());
  if (!pending || !saved || !overdue) throw new Error('Prepare pending, submitted and overdue synthetic milestones first.');
  const routes = [
    ['overview', '/'],
    ['team', `/teams/${context.team.id}`],
    ['milestone', `/milestones/${pending.id}`],
    ['overdue', `/milestones/${overdue.id}`],
    ['submission', `/submissions/${saved.latestSubmission.id}`],
    [context.role === 'supervisor' ? 'create' : 'submit', context.role === 'supervisor'
      ? `/teams/${context.team.id}/milestones/new` : `/milestones/${pending.id}/submissions/new`],
  ];
  const viewports = [[320, 900], [390, 844], [768, 1024], [1199, 900], [1200, 900], [1280, 900], [1440, 1000], [844, 390], [640, 900]];
  const checks = [];
  for (const [name, path] of routes) {
    await page.goto(`${start.origin}${path}?disposableReview=1`);
    await page.locator('main h1').waitFor();
    if (name === 'overview') await page.getByRole('link', { name: context.role === 'supervisor' ? 'Open team' : 'View milestone', exact: true }).first().waitFor();
    if (name === 'team') await page.getByRole('heading', { name: 'Milestones', exact: true }).waitFor();
    if (name === 'submission') await page.getByRole('heading', { name: 'Feedback for version 1', exact: true }).waitFor();
    if (name === 'create' || name === 'submit') await page.getByRole('textbox', { name: 'Title', exact: true }).waitFor();
    for (const [width, height] of viewports) {
      await page.setViewportSize({ width, height });
      await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
      const issues = await page.evaluate(() => {
        const issues = [];
        if (document.documentElement.scrollWidth > innerWidth) issues.push('page overflow');
        for (const control of document.querySelectorAll('button, input, textarea')) {
          if (!control.checkVisibility()) continue;
          const bounds = control.getBoundingClientRect();
          if (bounds.height < 44 || bounds.width < 44) issues.push(`small control: ${control.textContent || control.id}`);
          if (bounds.left < -1 || bounds.right > innerWidth + 1) issues.push(`clipped control: ${control.textContent || control.id}`);
          if (control.matches('input, textarea') && parseFloat(getComputedStyle(control).fontSize) < 16) issues.push('input text below 16px');
        }
        return issues;
      });
      if (issues.length) throw new Error(`${context.role}/${name}/${width}x${height}: ${issues.join(', ')}`);
      checks.push(`${name}:${width}x${height}`);
      if ((width === 390 || width === 1440) && ['overview', 'submission', 'create', 'submit'].includes(name)) {
        await page.screenshot({ path: `../output/playwright/ui-${context.role}-${name}-${width}.png`, fullPage: true });
      }
    }
    const field = page.locator('input, textarea').first();
    if (await field.count()) {
      await field.focus();
      const focused = await field.evaluate(element => ({ width: getComputedStyle(element).outlineWidth, style: getComputedStyle(element).outlineStyle }));
      if (parseFloat(focused.width) < 2 || focused.style === 'none') throw new Error(`${name}: missing visible input focus`);
    }
  }
  await page.setViewportSize({ width: 390, height: 844 });
  // Native modal dialogs make the background inert, so inspect the trigger by
  // its element while it is intentionally absent from the accessibility tree.
  const menu = page.locator('.menu-button');
  await menu.waitFor();
  await menu.click();
  const dialog = page.getByRole('dialog', { name: 'Navigation' });
  await dialog.waitFor();
  if (await menu.getAttribute('aria-expanded') !== 'true') throw new Error('Menu expansion was not announced.');
  const focusable = dialog.locator('button, a');
  await focusable.last().focus(); await page.keyboard.press('Tab');
  if (!await focusable.first().evaluate(element => element === document.activeElement)) throw new Error('Drawer focus escaped.');
  await page.keyboard.press('Shift+Tab');
  if (!await focusable.last().evaluate(element => element === document.activeElement)) throw new Error('Reverse drawer focus escaped.');
  await page.keyboard.press('Escape');
  if (!await menu.evaluate(element => element === document.activeElement) || await menu.getAttribute('aria-expanded') !== 'false') throw new Error('Drawer focus/expanded state was not restored.');
  await menu.click();
  await page.setViewportSize({ width: 1280, height: 900 });
  await dialog.waitFor({ state: 'hidden' });
  await page.setViewportSize({ width: 390, height: 844 });
  await menu.waitFor();
  if (await menu.getAttribute('aria-expanded') !== 'false') throw new Error('Resizing left stale modal state.');
  if (context.role === 'student' && await page.getByRole('link', { name: 'Create milestone', exact: true }).count()) throw new Error('Student has a supervisor action.');
  return { role: context.role, layoutChecks: checks, keyboard: ['focus trap in both directions', 'Escape and focus return', 'expanded state', 'desktop resize closes modal'], reflowMethod: '640 CSS px approximates 200% reflow at 1280; native browser zoom is separate.' };
}
