import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const htmlPath = path.join(root, 'site', 'catalog', 'travosmesi', 'index.html');
const cssPath = path.join(root, 'site', 'assets', 'css', 'travosmesi.css');

if (!fs.existsSync(htmlPath)) {
  throw new Error('Travosmesi page was not found: site/catalog/travosmesi/index.html');
}
if (!fs.existsSync(cssPath)) {
  throw new Error('Travosmesi stylesheet was not found: site/assets/css/travosmesi.css');
}

let html = fs.readFileSync(htmlPath, 'utf8');

function applyProductHeadings(source) {
  const existing = (source.match(/class="mix-card-title"/g) || []).length;
  if (existing === 5) return source;

  let count = 0;
  const next = source.replace(
    /(<span class="mix-card-body">)<strong>([\s\S]*?)<\/strong>(<span>)/g,
    (_, before, title, after) => {
      count += 1;
      return `${before}<h3 class="mix-card-title">${title}</h3>${after}`;
    }
  );

  if (count !== 5) {
    throw new Error(`Expected 5 H3 product headings on travosmesi page, got ${count}`);
  }
  return next;
}

function applyCriteriaHeadings(source) {
  const sectionPattern = /<section class="mix-section mix-criteria"[\s\S]*?<\/section>/;
  const match = source.match(sectionPattern);
  if (!match) throw new Error('Travosmesi criteria section was not found');

  let section = match[0];
  if (!section.includes('class="mix-criteria-subtitle"')) {
    section = section.replace(
      '<h2 id="mix-criteria-title">Как выбрать травосмесь под задачу</h2>',
      '<h2 id="mix-criteria-title">Как выбрать травосмесь под задачу</h2><h3 class="mix-criteria-subtitle">Параметры подбора травосмеси</h3>'
    );
  }

  if (!section.includes('class="mix-criteria-item-title"')) {
    let count = 0;
    section = section.replace(
      /<strong>(Назначение|Площадь|Объём|Доставка)<\/strong>/g,
      (_, title) => {
        count += 1;
        return `<h4 class="mix-criteria-item-title">${title}</h4>`;
      }
    );
    if (count !== 4) {
      throw new Error(`Expected 4 H4 criteria headings on travosmesi page, got ${count}`);
    }
  }

  return source.replace(sectionPattern, section);
}

function applyCommercialHeadings(source) {
  const sectionPattern = /<div class="mix-commercial-links">[\s\S]*?<\/div>/;
  const match = source.match(sectionPattern);
  if (!match) throw new Error('Travosmesi commercial links section was not found');

  let section = match[0];
  if (!section.includes('class="mix-commercial-link-title"')) {
    let count = 0;
    section = section.replace(
      /<strong>(Доставка и оплата|Качество и документы)<\/strong>/g,
      (_, title) => {
        count += 1;
        return `<h3 class="mix-commercial-link-title">${title}</h3>`;
      }
    );
    if (count !== 2) {
      throw new Error(`Expected 2 H3 commercial headings on travosmesi page, got ${count}`);
    }
  }

  return source.replace(sectionPattern, section);
}

html = applyProductHeadings(html);
html = applyCriteriaHeadings(html);
html = applyCommercialHeadings(html);

const h1Count = (html.match(/<h1\b/g) || []).length;
const h2Count = (html.match(/<h2\b/g) || []).length;
const h3Count = (html.match(/<h3\b/g) || []).length;
const h4Count = (html.match(/<h4\b/g) || []).length;

if (h1Count !== 1 || h2Count < 1 || h3Count < 8 || h4Count !== 4) {
  throw new Error(`Unexpected travosmesi heading hierarchy: H1=${h1Count}, H2=${h2Count}, H3=${h3Count}, H4=${h4Count}`);
}

fs.writeFileSync(htmlPath, html, 'utf8');

let css = fs.readFileSync(cssPath, 'utf8');
const marker = '/* Travosmesi semantic H3/H4 hierarchy. */';
if (!css.includes(marker)) {
  css += `\n\n${marker}\n.mix-card-body .mix-card-title {\n  margin: 0;\n  color: var(--color-green-deep);\n  font-size: 1.08rem;\n  font-weight: 700;\n  line-height: 1.25;\n}\n.mix-criteria-subtitle {\n  margin: 1rem 0 0;\n  color: #fff;\n  font-size: 1.05rem;\n  font-weight: 700;\n  line-height: 1.35;\n}\n.mix-criteria-item-title {\n  margin: 0;\n  color: #fff;\n  font-size: 1rem;\n  font-weight: 700;\n  line-height: 1.4;\n}\n.mix-commercial-links .mix-commercial-link-title {\n  margin: 0;\n  color: var(--color-green-deep);\n  font-size: 1rem;\n  font-weight: 700;\n  line-height: 1.35;\n}\n`;
  fs.writeFileSync(cssPath, css, 'utf8');
}

console.log(`Travosmesi heading hierarchy applied: H1=${h1Count}, H2=${h2Count}, H3=${h3Count}, H4=${h4Count}`);
