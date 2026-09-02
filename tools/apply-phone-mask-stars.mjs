import fs from 'node:fs';
import path from 'node:path';

const siteRoot = path.join(process.cwd(), 'site');
const replacements = [
  ['+7 XXX XXX XX XX', '+7 *** *** ** **'],
  ['+7 ХХХ ХХХ ХХ ХХ', '+7 *** *** ** **']
];

let changedFiles = 0;
let changedOccurrences = 0;

function patchFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;

  for (const [from, to] of replacements) {
    const count = content.split(from).length - 1;
    if (count > 0) {
      changedOccurrences += count;
      content = content.replaceAll(from, to);
    }
  }

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    changedFiles += 1;
  }
}

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath);
      continue;
    }
    if (!entry.isFile()) continue;

    const ext = path.extname(entry.name).toLowerCase();
    if (ext === '.html' || ext === '.js') patchFile(fullPath);
  }
}

walk(siteRoot);
console.log(`Phone mask placeholders updated to stars: ${changedOccurrences} replacements in ${changedFiles} files.`);
