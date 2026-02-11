import { createHash } from 'node:crypto';
import {
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
} from 'node:fs';
import path from 'node:path';

const SOURCE_RELATIVE_PATH = '.agent/skills/vercel-react-best-practices';
const TARGET_RELATIVE_PATHS = [
  '.codex/skills/vercel-react-best-practices',
  '.cursor/skills/vercel-react-best-practices',
];

const ROOT_DIRECTORY = process.cwd();
const sourceDirectory = path.resolve(ROOT_DIRECTORY, SOURCE_RELATIVE_PATH);

if (!existsSync(sourceDirectory)) {
  throw new Error(
    `[sync:agents] Source skill directory not found: ${SOURCE_RELATIVE_PATH}`
  );
}

const normalizePath = (filePath) => filePath.replaceAll('\\', '/');

const listRelativeFiles = (directoryPath) => {
  const allFiles = [];
  const walk = (currentDirectory) => {
    const entries = readdirSync(currentDirectory, { withFileTypes: true });
    for (const entry of entries) {
      const absolutePath = path.join(currentDirectory, entry.name);
      if (entry.isDirectory()) {
        walk(absolutePath);
        continue;
      }
      if (!entry.isFile()) {
        continue;
      }
      const relativePath = path.relative(directoryPath, absolutePath);
      allFiles.push(normalizePath(relativePath));
    }
  };

  walk(directoryPath);
  return allFiles.sort();
};

const toHash = (absoluteFilePath) => {
  const data = readFileSync(absoluteFilePath);
  return createHash('sha256').update(data).digest('hex');
};

for (const targetRelativePath of TARGET_RELATIVE_PATHS) {
  const targetDirectory = path.resolve(ROOT_DIRECTORY, targetRelativePath);
  const sourceStats = statSync(sourceDirectory);

  if (!sourceStats.isDirectory()) {
    throw new Error(
      `[sync:agents] Source path is not a directory: ${SOURCE_RELATIVE_PATH}`
    );
  }

  if (normalizePath(sourceDirectory) === normalizePath(targetDirectory)) {
    throw new Error('[sync:agents] Target path cannot equal source path.');
  }

  rmSync(targetDirectory, { recursive: true, force: true });
  mkdirSync(path.dirname(targetDirectory), { recursive: true });
  cpSync(sourceDirectory, targetDirectory, { recursive: true });

  const sourceFiles = listRelativeFiles(sourceDirectory);
  const targetFiles = listRelativeFiles(targetDirectory);
  const targetFileSet = new Set(targetFiles);

  if (sourceFiles.length !== targetFiles.length) {
    throw new Error(
      `[sync:agents] File count mismatch for ${targetRelativePath}: ${sourceFiles.length} vs ${targetFiles.length}`
    );
  }

  for (const relativePath of sourceFiles) {
    if (!targetFileSet.has(relativePath)) {
      throw new Error(
        `[sync:agents] Missing file in target ${targetRelativePath}: ${relativePath}`
      );
    }
    const sourceHash = toHash(path.join(sourceDirectory, relativePath));
    const targetHash = toHash(path.join(targetDirectory, relativePath));
    if (sourceHash !== targetHash) {
      throw new Error(
        `[sync:agents] Hash mismatch in ${targetRelativePath}: ${relativePath}`
      );
    }
  }

  console.log(
    `[sync:agents] Synced ${targetRelativePath} (${sourceFiles.length} files)`
  );
}

console.log('[sync:agents] All target skill mirrors are synchronized.');
