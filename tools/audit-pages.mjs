import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const config = JSON.parse(fs.readFileSync(path.join(root, 'site-standard.config.json'), 'utf8'));
const excludedDirs = new Set(config.excludeDirs || []);
const htmlFileNames = new Set((config.htmlFileNames || ['index.html']).map(x => x.toLowerCase()));
const excludeFilePatterns = (config.excludeFilePatterns || []).map(x => String(x).toLowerCase());
const walkRoots = (config.roots?.length ? config.roots : ['.']).map(r => path.resolve(root, r));

const files = [];
function walk(dir) {
  let entries;
  try { entries = fs.readdirSync(dir, {withFileTypes:true}); } catch { return; }
  for (const e of entries) {
    if (excludedDirs.has(e.name)) continue;
    const abs = path.join(dir, e.name);
    if (e.isDirectory()) walk(abs);
    else if (
      e.isFile() &&
      e.name.toLowerCase().endsWith('.html') &&
      htmlFileNames.has(e.name.toLowerCase()) &&
      !excludeFilePatterns.some(p => e.name.toLowerCase().includes(p))
    ) files.push(path.relative(root, abs));
  }
}

for (const r of walkRoots) {
  if (!fs.existsSync(r)) {
    console.error(`ERROR root не найден: ${path.relative(root, r) || r}`);
    process.exit(1);
  }
  walk(r);
}

const errors = [];
const warnings = [];
const attr = (tag, name) => new RegExp(`\\b${name}\\s*=\\s*["'][^"']+["']`, 'i').test(tag);
const count = (text, re) => (text.match(re) || []).length;

for (const file of files.sort()) {
  const html = fs.readFileSync(path.join(root, file), 'utf8');
  const fail = m => errors.push(`${file}: ${m}`);
  const warn = m => warnings.push(`${file}: ${m}`);

  if (!/<html\b[^>]*\blang=/i.test(html)) fail('нет lang у html');
  if (!/<meta\b[^>]*charset=/i.test(html)) fail('нет charset');
  if (!/<meta\b[^>]*name=["']viewport["']/i.test(html)) fail('нет viewport');
  if (count(html, /<h1\b/gi) !== 1) fail(`должен быть ровно один H1 (сейчас ${count(html, /<h1\b/gi)})`);
  if (!/<title>[^<]{8,}<\/title>/is.test(html)) fail('нет содержательного title');

  const desc =
    /<meta\b[^>]*name=["']description["'][^>]*content=["'][^"']{30,}["']/i.test(html) ||
    /<meta\b[^>]*content=["'][^"']{30,}["'][^>]*name=["']description["']/i.test(html);
  if (!desc) fail('нет содержательного meta description');

  const canonical =
    /<link\b[^>]*rel=["']canonical["'][^>]*href=["']https?:\/\//i.test(html) ||
    /<link\b[^>]*href=["']https?:\/\/[^"']+["'][^>]*rel=["']canonical["']/i.test(html);
  if (!canonical) fail('нет абсолютного canonical');

  if (/<script\b[^>]*src=["'][^"']*(lpmotor|motor|public\.bundle|editor|builder)[^"']*/i.test(html))
    fail('обнаружена потенциальная runtime-зависимость конструктора');

  const imgs = html.match(/<img\b[^>]*>/gi) || [];
  imgs.forEach((tag, i) => {
    if (!/\balt\s*=\s*["'][^"']*["']/i.test(tag)) fail(`img #${i+1} без alt`);
    if (!(attr(tag, 'width') && attr(tag, 'height')) && !/aspect-ratio/i.test(tag))
      warn(`img #${i+1}: проверь dimensions/aspect-ratio`);
  });

  const highs = imgs.filter(tag => /fetchpriority\s*=\s*["']high["']/i.test(tag));
  if (highs.length > (config.limits?.maxHighPriorityImages ?? 1))
    fail(`fetchpriority=high указан ${highs.length} раз`);

  const forms = html.match(/<form\b[\s\S]*?<\/form>/gi) || [];
  forms.forEach((form, fi) => {
    const controls = form.match(/<(input|select|textarea)\b[^>]*>/gi) || [];
    controls
      .filter(t => !/type\s*=\s*["'](?:submit|button|hidden)["']/i.test(t))
      .forEach((tag, ci) => {
        if (!attr(tag, 'name')) fail(`форма #${fi+1}, поле #${ci+1} без name`);
        if (/^<input/i.test(tag) && !attr(tag, 'type'))
          fail(`форма #${fi+1}, input #${ci+1} без type`);
      });
  });
}

if (!files.length) errors.push('HTML-файлы не найдены; проверь roots/htmlFileNames');
warnings.forEach(m => console.warn(`WARN ${m}`));
errors.forEach(m => console.error(`ERROR ${m}`));
console.log(`Проверено HTML-файлов: ${files.length}; ошибок: ${errors.length}; предупреждений: ${warnings.length}`);
process.exit(errors.length ? 1 : 0);
