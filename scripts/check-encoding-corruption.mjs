import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const ROOT_DIR = process.cwd();
const TARGET_DIR = path.join(ROOT_DIR, 'src');
const TARGET_EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.jsx']);

const suspiciousPatterns = [
  { name: 'replacement-char', regex: /\uFFFD/ },
  { name: 'question-before-korean', regex: /\?[가-힣]/ },
  { name: 'double-question-before-korean', regex: /\?{2,}[가-힣]/ },
  { name: 'latin1-mojibake', regex: /[ÃÂÀ-ÿ]{2,}/ },
];

async function collectFiles(dirPath) {
  const entries = await readdir(dirPath, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectFiles(fullPath)));
      continue;
    }

    if (TARGET_EXTENSIONS.has(path.extname(entry.name))) {
      files.push(fullPath);
    }
  }

  return files;
}

async function main() {
  const files = await collectFiles(TARGET_DIR);
  const failures = [];

  for (const filePath of files) {
    const content = await readFile(filePath, 'utf8');

    for (const pattern of suspiciousPatterns) {
      if (!pattern.regex.test(content)) continue;
      failures.push({
        file: path.relative(ROOT_DIR, filePath).replaceAll('\\', '/'),
        pattern: pattern.name,
      });
    }
  }

  if (failures.length === 0) {
    console.log('No encoding corruption patterns found.');
    return;
  }

  console.error('Detected possible encoding corruption:');
  for (const failure of failures) {
    console.error(`- ${failure.file} (${failure.pattern})`);
  }
  process.exit(1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
