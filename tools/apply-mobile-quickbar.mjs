import fs from 'node:fs';
import path from 'node:path';

const siteRoot = path.join(process.cwd(), 'site');
const marker = 'data-mobile-quickbar';

const quickbar = `<nav class="mobile-quickbar" aria-label="Быстрые действия" ${marker}>
  <a class="mobile-quickbar__item" href="tel:+77059608987" aria-label="Позвонить в BAS Agros">
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M7.3 3.5 9.6 8l-1.8 1.6c1 2.3 2.7 4 5 5l1.7-1.8 4.4 2.3c.5.3.8.8.7 1.4-.3 2.1-1.8 3.5-3.9 3.5C9.2 20 4 14.8 4 8.3c0-2 1.4-3.6 3.5-3.9.6-.1 1.2.2 1.5.7Z"/></svg>
    <span>Позвонить</span>
  </a>
  <a class="mobile-quickbar__item" href="https://wa.me/77059608987" target="_blank" rel="noopener noreferrer" aria-label="Написать в WhatsApp">
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 3.25a8.4 8.4 0 0 0-7.24 12.67L3.6 20.4l4.58-1.1A8.4 8.4 0 1 0 12 3.25Zm0 1.8a6.6 6.6 0 1 1-3.36 12.28l-.3-.18-2.16.52.55-2.1-.2-.32A6.6 6.6 0 0 1 12 5.05Zm-2.1 2.7c-.17 0-.43.06-.66.31-.23.25-.87.85-.87 2.08s.9 2.42 1.02 2.59c.13.16 1.76 2.68 4.26 3.76.6.26 1.06.41 1.42.52.6.19 1.14.16 1.57.1.48-.07 1.48-.61 1.69-1.19.2-.58.2-1.08.14-1.18-.06-.1-.23-.16-.48-.29-.25-.12-1.48-.73-1.71-.81-.23-.09-.4-.13-.57.12-.16.25-.64.81-.79.98-.14.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23a7.5 7.5 0 0 1-1.39-1.72c-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.16.04-.31-.02-.43-.06-.13-.56-1.36-.77-1.86-.2-.49-.41-.42-.57-.43Z"/></svg>
    <span>WhatsApp</span>
  </a>
  <a class="mobile-quickbar__item" href="/catalog/" aria-label="Открыть каталог BAS Agros">
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4 4.5h6.5V11H4V4.5Zm9.5 0H20V11h-6.5V4.5ZM4 14h6.5v6.5H4V14Zm9.5 0H20v6.5h-6.5V14Z"/></svg>
    <span>Каталог</span>
  </a>
</nav>`;

function patchHtml(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      patchHtml(abs);
      continue;
    }
    if (!entry.isFile() || entry.name.toLowerCase() !== 'index.html') continue;

    const html = fs.readFileSync(abs, 'utf8');
    if (html.includes(marker)) continue;
    const next = html.replace('</body>', `${quickbar}\n</body>`);
    if (next !== html) fs.writeFileSync(abs, next, 'utf8');
  }
}

function patchCss() {
  const cssPath = path.join(siteRoot, 'assets', 'css', 'site.css');
  let css = fs.readFileSync(cssPath, 'utf8');
  const cssMarker = '/* Mobile fixed quick actions: phone, WhatsApp, catalog. */';
  if (css.includes(cssMarker)) return;

  css += `\n\n${cssMarker}\n.mobile-quickbar {\n  display: none;\n}\n\n@media (max-width: 47.99rem) {\n  html {\n    scroll-padding-bottom: calc(5.75rem + env(safe-area-inset-bottom));\n  }\n\n  body {\n    padding-bottom: calc(5.75rem + env(safe-area-inset-bottom)) !important;\n  }\n\n  .mobile-quickbar {\n    position: fixed;\n    z-index: 9999;\n    right: 0;\n    bottom: 0;\n    left: 0;\n    display: grid;\n    grid-template-columns: repeat(3, minmax(0, 1fr));\n    min-height: 4.25rem;\n    padding: .35rem .35rem calc(.35rem + env(safe-area-inset-bottom));\n    border-top: 1px solid rgba(23, 63, 44, .14);\n    background: rgba(255, 255, 255, .98);\n    box-shadow: 0 -.35rem 1.4rem rgba(17, 42, 29, .11);\n    backdrop-filter: blur(12px);\n    -webkit-backdrop-filter: blur(12px);\n  }\n\n  .mobile-quickbar__item {\n    display: flex;\n    min-width: 0;\n    min-height: 3.55rem;\n    flex-direction: column;\n    align-items: center;\n    justify-content: center;\n    gap: .2rem;\n    border-radius: .65rem;\n    color: #173f2c;\n    font-size: .72rem;\n    font-weight: 700;\n    line-height: 1.1;\n    text-align: center;\n    text-decoration: none;\n    -webkit-tap-highlight-color: transparent;\n  }\n\n  .mobile-quickbar__item + .mobile-quickbar__item {\n    border-left: 1px solid rgba(23, 63, 44, .1);\n    border-radius: 0;\n  }\n\n  .mobile-quickbar__item svg {\n    width: 1.35rem;\n    height: 1.35rem;\n    fill: currentColor;\n  }\n\n  .mobile-quickbar__item:active {\n    background: rgba(23, 63, 44, .07);\n  }\n\n  .mobile-quickbar__item:focus-visible {\n    outline: .15rem solid #173f2c;\n    outline-offset: -.15rem;\n  }\n}\n`;

  fs.writeFileSync(cssPath, css, 'utf8');
}

patchHtml(siteRoot);
patchCss();
console.log('Mobile quick action bar applied to all generated pages.');
