import fs from 'node:fs';
import path from 'node:path';

const siteRoot = path.join(process.cwd(), 'site');
const oldButton = '<a href="/o-kompanii/" class="home-btn home-btn-outline">Связаться</a>';
const phoneIcon = '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false" style="flex:0 0 auto;margin-right:.45rem"><path d="M7.3 3.5 9.6 8l-1.8 1.6c1 2.3 2.7 4 5 5l1.7-1.8 4.4 2.3c.5.3.8.8.7 1.4-.3 2.1-1.8 3.5-3.9 3.5C9.2 20 4 14.8 4 8.3c0-2 1.4-3.6 3.5-3.9.6-.1 1.2.2 1.5.7Z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const phoneButton = `<a href="tel:+77059608987" class="home-btn home-btn-outline" aria-label="Позвонить по номеру +7 705 960 89 87">${phoneIcon}<span>+7 705 960 89 87</span></a>`;
const firstNavItem = '<li><a href="/">Главная</a></li>';
const lastNavItem = '<li><a href="#contacts">Контакты</a></li>';

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

    if (path.resolve(abs) === path.resolve(siteRoot, 'index.html')) {
      if (!next.includes(firstNavItem)) {
        next = next.replace('<nav class="home-nav" id="home-navigation" aria-label="Основная навигация" data-mobile-nav><ul>', `<nav class="home-nav" id="home-navigation" aria-label="Основная навигация" data-mobile-nav><ul>${firstNavItem}`);
      }
      if (!next.includes(lastNavItem)) {
        next = next.replace('</li></ul><div class="home-nav-actions">', `</li>${lastNavItem}</ul><div class="home-nav-actions">`);
      }
      next = next.replace('<div><h2>Контакты</h2>', '<div id="contacts"><h2>Контакты</h2>');
    }

    if (next !== html) fs.writeFileSync(abs, next, 'utf8');
  }
}

function patchHomeCss() {
  const cssPath = path.join(siteRoot, 'assets', 'css', 'home.css');
  let css = fs.readFileSync(cssPath, 'utf8');

  const headerMarker = '/* Header nav links use the same deep green as the hero offer. */';
  const headerRule = `\n${headerMarker}\n.home-nav li a { color: var(--color-green-deep); }\n`;
  if (!css.includes(headerMarker)) css += headerRule;

  const catalogMarker = '/* Align catalog card action links to a common bottom baseline. */';
  const catalogRule = `\n${catalogMarker}\n.home-category > div {\n  display: flex;\n  flex: 1 1 auto;\n  flex-direction: column;\n  padding-bottom: 15px;\n}\n.home-category > div > a {\n  margin-top: auto;\n  align-self: flex-start;\n}\n`;
  if (!css.includes(catalogMarker)) css += catalogRule;

  const guideHeadingMarker = '/* Prevent awkward word breaking in the guide heading. */';
  const guideHeadingRule = `\n${guideHeadingMarker}\n.home-guide h2 {\n  max-width: 27rem;\n  font-size: clamp(1.9rem, 2.25vw, 2.35rem);\n  line-height: 1.08;\n  overflow-wrap: normal;\n  word-break: normal;\n}\n.home-guide-grid > div > p {\n  max-width: 27rem;\n}\n`;
  if (!css.includes(guideHeadingMarker)) css += guideHeadingRule;

  fs.writeFileSync(cssPath, css, 'utf8');
}

patchHtml(siteRoot);
patchHomeCss();
console.log('Header navigation, aligned catalog card actions and guide heading typography applied.');
