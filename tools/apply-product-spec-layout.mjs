import fs from 'node:fs';
import path from 'node:path';

const cssPath = path.join(process.cwd(), 'site', 'assets', 'css', 'product.css');
const marker = '/* Product specs: label above value. */';

if (!fs.existsSync(cssPath)) {
  throw new Error('Не найден site/assets/css/product.css');
}

let css = fs.readFileSync(cssPath, 'utf8');
if (!css.includes(marker)) {
  css += `\n${marker}\n.product-spec-list-compact > div {\n  grid-template-columns: 1fr !important;\n  align-content: start;\n  gap: .24rem;\n  min-height: 0;\n  padding: .72rem .82rem;\n}\n.product-spec-list-compact dt {\n  display: block;\n  margin: 0;\n  color: #7a857e;\n  font-size: .72rem;\n  font-weight: 700;\n  line-height: 1.2;\n  letter-spacing: .035em;\n  text-transform: uppercase;\n}\n.product-spec-list-compact dd {\n  display: block;\n  margin: 0;\n  color: #173f2c;\n  font-size: .92rem;\n  font-weight: 750;\n  line-height: 1.32;\n}\n@media (max-width: 47.99rem) {\n  .product-spec-list-compact > div {\n    grid-template-columns: 1fr !important;\n    gap: .2rem;\n    padding: .68rem .74rem;\n  }\n}\n`;
  fs.writeFileSync(cssPath, css, 'utf8');
}

console.log('Product specification labels stacked above values.');
