import { spawn, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const root = process.cwd();
const DEFAULT_URL = 'http://127.0.0.1:8765/';
const LH_CLI = path.join(root, 'node_modules', 'lighthouse', 'cli', 'index.js');
const LH_PATCH = path.join(root, 'tools', 'lighthouse-chrome-patch.mjs');
const SERVE_CLI = path.join(root, 'tools', 'serve.mjs');
const MAX_RETRIES = 8;
const RETRY_DELAY_MS = 250;
const TEMP_PREFIX = 'basagros-lh-';

const url = process.argv[2] || DEFAULT_URL;
const config = JSON.parse(fs.readFileSync(path.join(root, 'site-standard.config.json'), 'utf8'));

if (!fs.existsSync(LH_CLI)) {
  console.error(`Локальный Lighthouse CLI не найден: ${path.relative(root, LH_CLI)}`);
  process.exit(1);
}

function sleep(ms) {
  spawnSync(process.execPath, ['-e', `setTimeout(() => {}, ${Number(ms) || 0})`], {
    cwd: root,
    shell: false,
    stdio: 'ignore'
  });
}

function resolveSystemTemp() {
  const candidates = [
    process.env.LOCALAPPDATA && path.join(process.env.LOCALAPPDATA, 'Temp'),
    process.env.SystemRoot && path.join(process.env.SystemRoot, 'Temp'),
    os.tmpdir()
  ].filter(Boolean);

  for (const candidate of candidates) {
    const resolved = path.resolve(candidate);
    if (!resolved.startsWith(root + path.sep) && resolved !== root) {
      return resolved;
    }
  }

  return path.resolve(os.homedir(), 'AppData', 'Local', 'Temp');
}

const systemTemp = resolveSystemTemp();
const sessionTemp = path.join(systemTemp, `${TEMP_PREFIX}${process.pid}`);

function isSafeTempDir(dir) {
  const resolved = path.resolve(dir);
  const session = path.resolve(sessionTemp);
  return resolved === session || resolved.startsWith(session + path.sep);
}

function removeDirSafe(dir) {
  if (!dir || !isSafeTempDir(dir) || !fs.existsSync(dir)) return;
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt += 1) {
    try {
      fs.rmSync(dir, { recursive: true, force: true, maxRetries: 0 });
      return;
    } catch (error) {
      const retryable = error.code === 'EPERM' || error.code === 'EBUSY' || error.code === 'ENOTEMPTY';
      if (!retryable || attempt === MAX_RETRIES) {
        console.warn(`Не удалось удалить временный каталог Lighthouse: ${dir}`);
        return;
      }
      sleep(RETRY_DELAY_MS * (attempt + 1));
    }
  }
}

function waitForUrl(target, timeoutMs) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    const ok = spawnSync(process.execPath, ['-e', `
      fetch(${JSON.stringify(target)}).then((res) => {
        process.exit(res.status ? 0 : 1);
      }).catch(() => process.exit(1));
    `], { cwd: root, shell: false, stdio: 'ignore' });
    if (ok.status === 0) return true;
    sleep(200);
  }
  return false;
}

function startServerIfNeeded() {
  if (waitForUrl(url, 800)) return null;
  if (!fs.existsSync(SERVE_CLI)) {
    throw new Error('Локальный сервер tools/serve.mjs не найден');
  }
  const child = spawn(process.execPath, [SERVE_CLI], {
    cwd: root,
    shell: false,
    stdio: 'ignore'
  });
  if (!waitForUrl(url, 15000)) {
    child.kill();
    throw new Error(`Локальный сервер не ответил на ${url}`);
  }
  return child;
}

function stopServer(child) {
  if (!child || child.killed) return;
  child.kill();
  const started = Date.now();
  while (child.exitCode === null && Date.now() - started < 5000) {
    sleep(100);
  }
}

function runLighthouse(outFile, runTemp) {
  fs.mkdirSync(runTemp, { recursive: true });

  const args = [
    `--import=${pathToFileURL(LH_PATCH).href}`,
    LH_CLI,
    url,
    '--quiet',
    '--output=json',
    `--output-path=${outFile}`,
    '--only-categories=performance,accessibility,seo',
    '--form-factor=mobile',
    '--screenEmulation.mobile=true',
    '--chrome-flags=--headless=new --disable-gpu'
  ];

  const run = spawnSync(process.execPath, args, {
    cwd: root,
    shell: false,
    stdio: 'inherit',
    env: {
      ...process.env,
      TMP: runTemp,
      TEMP: runTemp,
      TMPDIR: runTemp
    }
  });

  sleep(RETRY_DELAY_MS * 2);
  return run;
}

fs.mkdirSync(sessionTemp, { recursive: true });

let server = null;
const results = [];

try {
  server = startServerIfNeeded();

  for (let i = 1; i <= config.lighthouse.runs; i += 1) {
    const outFile = path.join(sessionTemp, `report-${i}.json`);
    const runTemp = path.join(sessionTemp, `run-${i}`);
    const run = runLighthouse(outFile, runTemp);

    if (!fs.existsSync(outFile)) {
      throw new Error(`Lighthouse run ${i} не записал отчёт (status ${run.status})`);
    }

    const report = JSON.parse(fs.readFileSync(outFile, 'utf8'));
    results.push({
      performance: Math.round(report.categories.performance.score * 100),
      accessibility: Math.round(report.categories.accessibility.score * 100),
      seo: Math.round(report.categories.seo.score * 100),
      lcp: Math.round(report.audits['largest-contentful-paint'].numericValue),
      cls: report.audits['cumulative-layout-shift'].numericValue,
      tbt: Math.round(report.audits['total-blocking-time'].numericValue)
    });

    removeDirSafe(runTemp);
  }
} finally {
  stopServer(server);
  removeDirSafe(sessionTemp);
}

const median = (key) => results.map((row) => row[key]).sort((a, b) => a - b)[Math.floor(results.length / 2)];
const med = {
  performance: median('performance'),
  accessibility: median('accessibility'),
  seo: median('seo'),
  lcp: median('lcp'),
  cls: median('cls'),
  tbt: median('tbt')
};

console.table(results);
console.log('Медиана:', med);

const b = config.lighthouse;
const everyPass = results.every((row) => row.performance >= b.performance * 100);
const ok = everyPass &&
  med.performance >= b.performance * 100 &&
  med.accessibility >= b.accessibility * 100 &&
  med.seo >= b.seo * 100 &&
  med.lcp <= b.lcpMs &&
  med.cls <= b.cls &&
  med.tbt <= b.tbtMs;

if (med.performance >= (b.targetPerformance ?? b.performance) * 100) {
  console.log('TARGET: mobile performance target достигнут.');
} else {
  console.warn('TARGET: целевая mobile performance ещё не достигнута.');
}

process.exit(ok ? 0 : 1);
