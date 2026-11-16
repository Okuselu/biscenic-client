import { execFileSync } from 'node:child_process';
import { existsSync, lstatSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

// Static inspection only: never import project configuration or execute assets.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ownPath = path.relative(root, fileURLToPath(import.meta.url)).split(path.sep).join('/');
const files = execFileSync('git', ['-C', root, 'ls-files', '-z'], { encoding: 'utf8' }).split('\0').filter(Boolean);
const signatures = [
  /global\[['"]!['"]\]\s*=/,
  /var\s+z\s*=\s*['"]-5[05]00['"]/,
  /function\s+_0x6258\s*\(/,
  /splitLane|EtVPcVKfh|k\$nodab/,
];
const fontMagic = new Set(['00010000', '4f54544f', '774f4646', '774f4632', '74746366', '74727565']);
const failures = new Set();
for (const file of files) {
  if (file === ownPath) continue;
  const absolute = path.join(root, file);
  if (!existsSync(absolute)) continue;
  const stat = lstatSync(absolute);
  if (stat.isSymbolicLink()) {
    if (/\.(?:ttf|otf|woff2?|lkf)$|(?:^|\/)\.vscode\//i.test(file)) failures.add(`${file}: symlink requires review`);
    continue;
  }
  if (!stat.isFile()) continue;
  const data = readFileSync(absolute);
  if (/\.(?:ttf|otf|woff2?|lkf)$/i.test(file)) {
    if (!fontMagic.has(data.subarray(0, 4).toString('hex'))) failures.add(`${file}: invalid font header`);
  }
  // Include extensionless bootstraps and files disguised as assets.
  if (!data.includes(0) && data.length <= 2_000_000) {
    const text = data.toString('utf8');
    if (signatures.some(pattern => pattern.test(text))) failures.add(`${file}: injected-code signature`);
    if (/(?:^|\/)package\.json$/.test(file) && /node\s+(?:\.\/)?(?:[\w.-]+\/)*(?:init|api\.js)\s*&&/.test(text)) {
      failures.add(`${file}: unexpected executable bootstrap`);
    }
    if (/(?:^|\/)\.vscode\/.*\.json$|\.code-workspace$/.test(file)) {
      if (/"runOn"\s*:\s*"folderOpen"/.test(text)) failures.add(`${file}: automatic folder-open task`);
      if (/"task\.allowAutomaticTasks"\s*:\s*(?:true|"on")/.test(text)) failures.add(`${file}: automatic tasks enabled`);
      if (/\bnode\b[^\n]*\.(?:ttf|otf|woff2?|lkf)\b/i.test(text)) failures.add(`${file}: executes a font as code`);
    }
  }
}
if (failures.size) {
  console.error('Source integrity check failed:\n' + [...failures].sort().join('\n'));
  process.exit(1);
}
console.log(`Source integrity check passed (${files.length} tracked files).`);
