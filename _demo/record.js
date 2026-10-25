/* מקליט וידאו של עמוד הדמו ב-1920x1080 באמצעות Playwright.
   שימוש:
     node record.js <outDir> <scriptName>          → מדידה בלבד (ללא וידאו)
     node record.js <outDir> <scriptName> record   → הקלטה לפי <scriptName>.durations.json

   תסריט (scripts/<name>.js) רץ *בתוך הדף ומגדיר:
     window.SCENARIO = { steps: [{ caption, narration, action: async (demo) => {...} }] }

   המדידה מריצה כל פעולה עד סופה ומדווחת כמה זמן היא נמשכה בפועל, כדי שאורך
   כל שלב בהקלטה ייקבע לפי הארוך מבין השניים: הקריינות או הפעולה עצמה. */
const { chromium } = require('playwright-core');
const fs = require('fs');
const path = require('path');

const VIEWPORT = { width: 1920, height: 1080 };
const VIDEO = { width: 1920, height: 1080 };

(async () => {
  const outDir = process.argv[2] || path.join(__dirname, 'out');
  const scriptName = process.argv[3];
  const mode = process.argv[4] || 'measure';
  const baseUrl = process.env.DEMO_URL || 'http://127.0.0.1:8899/_demo/dashboard.html';
  if (!scriptName) throw new Error('missing script name');

  fs.mkdirSync(outDir, { recursive: true });

  const scenarioPath = path.join(__dirname, 'scripts', scriptName + '.js');
  if (!fs.existsSync(scenarioPath)) throw new Error('scenario not found: ' + scenarioPath);

  let durations = null;
  if (mode === 'record') {
    const p = path.join(outDir, scriptName + '.durations.json');
    if (!fs.existsSync(p)) throw new Error('missing durations: ' + p);
    durations = JSON.parse(fs.readFileSync(p, 'utf8'));
  }

  const browser = await chromium.launch({
    channel: process.env.BROWSER_CHANNEL || 'chrome',
    headless: true,
    args: ['--force-device-scale-factor=1', '--hide-scrollbars']
  });

  const t0 = Date.now();
  const ctxOpts = { viewport: VIEWPORT, deviceScaleFactor: 1, locale: 'he-IL' };
  if (mode === 'record') ctxOpts.recordVideo = { dir: outDir, size: VIDEO };
  const context = await browser.newContext(ctxOpts);

  const page = await context.newPage();
  page.on('pageerror', (e) => console.log('[pageerror]', e.message));
  page.on('console', (m) => { if (m.type() === 'error') console.log('[console]', m.text()); });

  await page.goto(baseUrl, { waitUntil: 'load' });
  await page.waitForFunction(() => window.demo && window.demo.ready, null, { timeout: 20000 });
  await page.waitForTimeout(mode === 'record' ? 1200 : 300);

  await page.addScriptTag({ path: path.join(__dirname, 'scripts', '_lib.js') });
  await page.addScriptTag({ path: scenarioPath });
  await page.waitForFunction(() => window.SCENARIO && window.SCENARIO.steps, null, { timeout: 5000 });

  const preMs = Date.now() - t0;

  const result = await page.evaluate(async (dur) => {
    const stepCount = window.SCENARIO.steps.length;
    const plan = dur || new Array(stepCount).fill(0);
    await window.demo.run(window.SCENARIO.steps, plan);
    return {
      done: window.demo.state.done,
      error: window.demo.state.error,
      steps: window.demo.state.step,
      timings: window.demo.state.timings
    };
  }, durations);

  await page.waitForTimeout(mode === 'record' ? 700 : 100);

  let videoPath = null;
  if (mode === 'record') {
    const video = page.video();
    await context.close();
    videoPath = video ? await video.path() : null;
  } else {
    await context.close();
  }
  await browser.close();

  fs.writeFileSync(path.join(outDir, scriptName + '.timings.json'),
    JSON.stringify({ mode, preMs, ...result }, null, 1));
  console.log(JSON.stringify({ mode, videoPath, preMs, steps: result.steps, error: result.error }));
})().catch((e) => { console.error(e); process.exit(1); });
