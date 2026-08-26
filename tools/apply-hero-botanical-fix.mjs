import fs from 'node:fs';
import path from 'node:path';

const cssPath = path.join(process.cwd(), 'site', 'assets', 'css', 'home.css');
let css = fs.readFileSync(cssPath, 'utf8');

const marker = '/* Final hero botanical positioning: reference-sized, bottom-aligned, no stretching. */';
const rule = `
${marker}
@media (min-width: 48rem) {
  .home-botanical {
    left: auto;
    right: 100%;
    top: auto;
    bottom: 0;
    width: 7.5rem;
    height: auto;
    max-width: none;
    max-height: none;
    opacity: .44;
    transform: none;
    object-fit: contain;
    object-position: right bottom;
  }
}
@media (min-width: 80rem) {
  .home-botanical {
    right: 100%;
    bottom: 0;
    width: 7.5rem;
    height: auto;
    opacity: .42;
  }
}
`;

if (!css.includes(marker)) {
  css += rule;
}

fs.writeFileSync(cssPath, css, 'utf8');
console.log('Final hero botanical placement applied: 120px intrinsic-width image, bottom aligned at the photo seam.');
