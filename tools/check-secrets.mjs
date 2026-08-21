import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const ignored = new Set(['.git','node_modules','reports','dist','coverage']);
const allowed = new Set(['.html','.js','.mjs','.json','.md','.css','.txt','.yml','.yaml']);
const patterns = [
  ['Supabase service role', /\bservice[_-]?role\b\s*[:=]\s*["'][^"']{20,}/ig],
  ['Resend API key', /\bre_[A-Za-z0-9_-]{20,}\b/g],
  ['OpenAI-style secret', /\bsk-(?:proj-)?[A-Za-z0-9_-]{20,}\b/g],
  ['Private key', /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/g]
];
const findings = [];

function walk(dir) {
  for (const e of fs.readdirSync(dir, {withFileTypes:true})) {
    if (ignored.has(e.name)) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.isFile() && allowed.has(path.extname(e.name).toLowerCase())) {
      const text = fs.readFileSync(p, 'utf8');
      for (const [name, re] of patterns) {
        if (re.test(text)) findings.push(`${path.relative(root,p)}: ${name}`);
        re.lastIndex = 0;
      }
    }
  }
}
walk(root);
if (findings.length) {
  findings.forEach(x => console.error(`ERROR possible secret: ${x}`));
  process.exit(1);
}
console.log('Проверка секретов: явных секретов не найдено.');
