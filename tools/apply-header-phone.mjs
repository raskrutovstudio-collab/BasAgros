import fs from 'node:fs';
import path from 'node:path';

const siteRoot = path.join(process.cwd(), 'site');
const oldButton = '<a href="/o-kompanii/" class="home-btn home-btn-outline">Связаться</a>';
const phoneIcon = '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false" style="flex:0 0 auto;margin-right:.45rem"><path d="M7.3 3.5 9.6 8l-1.8 1.6c1 2.3 2.7 4 5 5l1.7-1.8 4.4 2.3c.5.3.8.8.7 1.4-.3 2.1-1.8 3.5-3.9 3.5C9.2 20 4 14.8 4 8.3c0-2 1.4-3.6 3.5-3.9.6-.1 1.2.2 1.5.7Z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const phoneButton = `<a href="tel:+77059608987" class="home-btn home-btn-outline" aria-label="Позвонить по номеру +7 705 960 89 87">${phoneIcon}<span>+7 705 960 89 87</span></a>`;

function patchHtml(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      patchHtml(abs);
      continue;
    }
    if (!entry.isFile() || entry.name.toLowerCase() !== 'index.html') continue;

    const html = fs.readFileSync(abs, 'utf8');
    let next = html.replaceAll(oldButton, phoneButton);
    next = next.replaceAll(
      '<a href="tel:+77059608987" class="home-btn home-btn-outline" aria-label="Позвонить по номеру 8 705 960 89 87">8 705 960 89 87</a>',
      phoneButton
    );
    if (next !== html) fs.writeFileSync(abs, next, 'utf8');
  }
}

function patchHeaderColors() {
  const cssPath = path.join(siteRoot, 'assets', 'css', 'home.css');
  let css = fs.readFileSync(cssPath, 'utf8');
  const marker = '/* Header nav links use the same deep green as the hero offer. */';
  const rule = `\n${marker}\n.home-nav li a { color: var(--color-green-deep); }\n`;
  if (!css.includes(marker)) css += rule;
  fs.writeFileSync(cssPath, css, 'utf8');
}

patchHtml(siteRoot);
patchHeaderColors();
console.log('Header phone button applied and nav links matched to hero offer color.');
