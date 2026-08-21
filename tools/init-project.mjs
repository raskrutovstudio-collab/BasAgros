import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const args = process.argv.slice(2);
const getArg = (name) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
};

const name = getArg('--name');
const domainInput = getArg('--domain');
const force = args.includes('--force');

if (!name || !domainInput) {
  console.error('Использование: npm run init:project -- --name "Название проекта" --domain "https://example.kz"');
  process.exit(1);
}

let domain;
try {
  const url = new URL(domainInput.includes('://') ? domainInput : `https://${domainInput}`);
  if (!['http:', 'https:'].includes(url.protocol)) throw new Error('protocol');
  url.pathname = '/';
  url.search = '';
  url.hash = '';
  domain = url.origin;
} catch {
  console.error('ERROR: некорректный домен. Пример: https://example.kz');
  process.exit(1);
}

const profilePath = path.join(root, 'PROJECT_PROFILE.md');
const templatePath = path.join(root, 'PROJECT_PROFILE.template.md');
const configPath = path.join(root, 'site-standard.config.json');
const indexPath = path.join(root, 'site', 'index.html');
const manifestPath = path.join(root, 'starter-manifest.json');

if (!fs.existsSync(profilePath) || !fs.existsSync(templatePath) || !fs.existsSync(configPath)) {
  console.error('ERROR: команда должна запускаться из корня starter-проекта.');
  process.exit(1);
}

const currentProfile = fs.readFileSync(profilePath, 'utf8');
if (!currentProfile.includes('STATUS: NOT_INITIALIZED') && !force) {
  console.error('ERROR: PROJECT_PROFILE.md уже инициализирован. Для намеренной перезаписи используйте --force.');
  process.exit(1);
}

const template = fs.readFileSync(templatePath, 'utf8')
  .replaceAll('<PROJECT_NAME>', name)
  .replaceAll('<DOMAIN>', domain);
fs.writeFileSync(profilePath, template, 'utf8');

const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
config.siteUrl = domain;
fs.writeFileSync(configPath, `${JSON.stringify(config, null, 2)}\n`, 'utf8');

if (fs.existsSync(indexPath)) {
  const escapedName = name.replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const index = `<!doctype html>\n<html lang="ru">\n<head>\n  <meta charset="utf-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1">\n  <title>${escapedName} — техническая стартовая страница</title>\n  <meta name="description" content="Техническая стартовая страница проекта ${escapedName} до утверждения структуры, контента и SEO-карты сайта.">\n  <link rel="canonical" href="${domain}/">\n  <meta name="robots" content="noindex, nofollow">\n</head>\n<body>\n  <main>\n    <h1>${escapedName} — разработка сайта</h1>\n    <p>Стартовая техническая страница. Индексация отключена до готовности проекта к публикации.</p>\n  </main>\n</body>\n</html>\n`;
  fs.writeFileSync(indexPath, index, 'utf8');
}

if (fs.existsSync(manifestPath)) {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  manifest.project = domain.replace(/^https?:\/\//, '');
  manifest.initialized = true;
  fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
}

console.log('Проект инициализирован.');
console.log(`Название: ${name}`);
console.log(`Домен: ${domain}`);
console.log('Дальше: заполните пустые поля PROJECT_PROFILE.md, затем выполните npm run quality:all.');
