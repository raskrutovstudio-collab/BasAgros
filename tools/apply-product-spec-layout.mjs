import fs from 'node:fs';
import path from 'node:path';

const cssPath = path.join(process.cwd(), 'site', 'assets', 'css', 'product.css');
const marker = '/* Product specs: label above value. */';

if (!fs.existsSync(cssPath)) {
  throw new Error('Не найден site/assets/css/product.css');
}

let css = fs.readFileSync(cssPath, 'utf8');
if (!css.includes(marker)) {
  css += `\n${marker}\n.product-specs-compact {\n  padding-block: clamp(2.4rem, 4vw, 3.6rem);\n}\n.product-specs-compact .product-two-col {\n  align-items: start;\n  gap: 1.5rem 3rem;\n}\n.product-spec-list-compact {\n  gap: .45rem .55rem;\n}\n.product-spec-list-compact > div {\n  grid-template-columns: 1fr !important;\n  align-content: start;\n  gap: .16rem;\n  min-height: 0;\n  padding: .54rem .66rem;\n}\n.product-spec-list-compact dt {\n  display: block;\n  margin: 0;\n  color: #7a857e;\n  font-size: .68rem;\n  font-weight: 700;\n  line-height: 1.15;\n  letter-spacing: .035em;\n  text-transform: uppercase;\n}\n.product-spec-list-compact dd {\n  display: block;\n  margin: 0;\n  color: #173f2c;\n  font-size: .86rem;\n  font-weight: 750;\n  line-height: 1.22;\n}\n@media (min-width: 64rem) {\n  .product-specs-compact .product-two-col {\n    grid-template-columns: minmax(20rem, .68fr) minmax(0, 1.32fr);\n  }\n  .product-specs-compact .product-spec-list-compact {\n    grid-template-columns: repeat(3, minmax(0, 1fr));\n  }\n}\n@media (max-width: 47.99rem) {\n  .product-specs-compact {\n    padding-block: 2.25rem;\n  }\n  .product-spec-list-compact > div {\n    grid-template-columns: 1fr !important;\n    gap: .14rem;\n    padding: .52rem .62rem;\n  }\n}\n`;
  fs.writeFileSync(cssPath, css, 'utf8');
}

console.log('Product specification labels stacked above values.');
