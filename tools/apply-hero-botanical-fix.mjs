import fs from 'node:fs';
import path from 'node:path';

const cssPath = path.join(process.cwd(), 'site', 'assets', 'css', 'home.css');
let css = fs.readFileSync(cssPath, 'utf8');

const leftoverOverridePatterns = [
  /\/\* Hero botanical placement matched to the approved reference:[\s\S]*?@media \(min-width: 80rem\) \{[\s\S]*?\n\}\n/,
  /\/\* Hero botanical placement measured from the approved reference crop:[\s\S]*?@media \(min-width: 80rem\) \{[\s\S]*?\n\}\n/,
  /\/\* Final hero botanical positioning:[\s\S]*?@media \(min-width: 80rem\) \{[\s\S]*?\n\}\n/
];
for (const pattern of leftoverOverridePatterns) {
  css = css.replace(pattern, '');
}

if (/height:\s*91%/.test(css)) {
  throw new Error('home.css still contains height: 91% for botanical; remove the leftover rule instead of stacking another override.');
}

fs.writeFileSync(cssPath, css, 'utf8');
console.log('Hero botanical leftover overrides removed; source CSS keeps the single reference placement.');
