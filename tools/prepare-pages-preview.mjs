import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const source = path.join(root, 'site');
const target = path.join(root, '.pages-preview');
const basePath = '/BasAgros';

if (!fs.existsSync(source)) {
  throw new Error('Каталог site/ не найден. Сначала выполните npm run build:site.');
}

fs.rmSync(target, { recursive: true, force: true });
fs.cpSync(source, target, { recursive: true });

function rewriteHtml(filePath) {
  const sourceHtml = fs.readFileSync(filePath, 'utf8');
  const html = sourceHtml
    .replace(/((?:href|src)=["'])\/(?!\/)/g, `$1${basePath}/`)
    .replace(/srcset=(["'])([\s\S]*?)\1/g, (attribute, quote, value) => {
      const rewritten = value.replace(/(^|,\s*)\/(?!\/)/g, `$1${basePath}/`);
      return `srcset=${quote}${rewritten}${quote}`;
    });
  fs.writeFileSync(filePath, html);
}

const stack = [target];
let htmlCount = 0;
while (stack.length) {
  const current = stack.pop();
  for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
    const fullPath = path.join(current, entry.name);
    if (entry.isDirectory()) stack.push(fullPath);
    if (entry.isFile() && entry.name.endsWith('.html')) {
      rewriteHtml(fullPath);
      htmlCount += 1;
    }
  }
}

fs.writeFileSync(path.join(target, '.nojekyll'), '');
fs.writeFileSync(path.join(target, 'robots.txt'), 'User-agent: *\nDisallow: /\n');

console.log(`GitHub Pages preview: подготовлено HTML-страниц ${htmlCount}; base path ${basePath}/`);
