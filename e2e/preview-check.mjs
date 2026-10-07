import { chromium } from 'playwright';
import fs from 'node:fs';

const BASE = process.env.BASE_URL || 'http://localhost:12001';
const OUT = 'e2e/report';
fs.mkdirSync(OUT, { recursive: true });

const routes = [
  '/', '/login', '/register', '/forgot-password', '/haraj', '/haraj/post',
  '/catalog/all', '/about', '/faq', '/contact', '/branches',
  '/dashboard', '/advertisements', '/terms', '/wanted-dress',
];

const viewports = [
  { name: 'mobile', width: 375, height: 812 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
];

const results = [];
const failures = [];

const browser = await chromium.launch({
  executablePath: '/usr/bin/chromium',
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
});

for (const vp of viewports) {
  const context = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    locale: 'ar',
  });
  const page = await context.newPage();
  const consoleErrors = [];
  page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text()); });
  page.on('pageerror', (e) => consoleErrors.push('PAGEERROR: ' + e.message));

  for (const route of routes) {
    consoleErrors.length = 0;
    let status = 'ok', note = '';
    try {
      const resp = await page.goto(BASE + route, { waitUntil: 'domcontentloaded', timeout: 20000 });
      await page.waitForTimeout(500);
      const finalUrl = page.url();
      const httpStatus = resp ? resp.status() : 0;

      const dims = await page.evaluate(() => ({
        sw: document.documentElement.scrollWidth,
        cw: document.documentElement.clientWidth,
        bodyTextLen: document.body.innerText.trim().length,
      }));
      const overflow = dims.sw - dims.cw;

      const counts = await page.evaluate(() => ({
        buttons: document.querySelectorAll('button').length,
        links: document.querySelectorAll('a').length,
        inputs: document.querySelectorAll('input').length,
      }));

      if (dims.bodyTextLen < 5) { status = 'fail'; note += 'blank page; '; }
      if (overflow > 4) { status = 'fail'; note += `horizontal-overflow ${overflow}px; `; }

      if (vp.name === 'desktop') {
        await page.screenshot({ path: `${OUT}/${route.replace(/[^a-z0-9]/gi, '_') || 'root'}.png`, fullPage: true });
      }

      results.push({ vp: vp.name, route, httpStatus, finalUrl, overflow, ...counts, status, note, consoleErrors: [...consoleErrors] });
      if (status === 'fail') failures.push(`${vp.name} ${route}: ${note}`);
    } catch (e) {
      status = 'fail'; note = String(e.message).slice(0, 120);
      results.push({ vp: vp.name, route, status, note });
      failures.push(`${vp.name} ${route}: ${note}`);
    }
  }
  await context.close();
}

const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'ar' });
const p = await ctx.newPage();
const interaction = [];
await p.goto(BASE + '/login', { waitUntil: 'domcontentloaded' });
await p.waitForTimeout(600);

const emailInput = p.locator('input[type="email"]').first();
{
  const cnt = await emailInput.count();
  interaction.push({ check: 'login email input present', pass: cnt > 0 });
  if (cnt > 0) {
    await emailInput.fill('e2e-test@example.com');
    const val = await emailInput.inputValue();
    interaction.push({ check: 'login email accepts typing', pass: val === 'e2e-test@example.com' });
  }
}
const pwdInput = p.locator('input[type="password"]').first();
{
  const cnt = await pwdInput.count();
  interaction.push({ check: 'login password input present', pass: cnt > 0 });
  if (cnt > 0) { await pwdInput.fill('Secret123!'); interaction.push({ check: 'password accepts typing', pass: (await pwdInput.inputValue()).length > 0 }); }
}
const btns = await p.locator('button:visible').all();
let clickable = 0;
for (const b of btns.slice(0, 8)) {
  try { await b.scrollIntoViewIfNeeded(); await b.click({ timeout: 1500, noWaitAfter: true }); clickable++; await p.waitForTimeout(150); } catch { /* ignore */ }
  if (p.url() !== BASE + '/login') { await p.goto(BASE + '/login', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(300); }
}
interaction.push({ check: `login buttons clickable (${clickable}/${Math.min(btns.length, 8)})`, pass: clickable > 0 });

await ctx.close();
await browser.close();

const pass = failures.length === 0 && interaction.every((i) => i.pass);
const report = { base: BASE, generatedAt: new Date().toISOString(), pass, failures, interaction, results };
fs.writeFileSync(`${OUT}/e2e-report.json`, JSON.stringify(report, null, 2));

console.log('\n===== E2E SUMMARY =====');
console.log('routes tested:', routes.length, 'x viewports:', viewports.length, '=', results.length, 'checks');
console.log('failures:', failures.length);
failures.forEach((f) => console.log('  x', f));
console.log('interaction checks:');
interaction.forEach((i) => console.log('  ', i.pass ? 'OK' : 'NO', i.check));
console.log('OVERALL:', pass ? 'PASS' : 'FAIL');
process.exit(pass ? 0 : 1);
