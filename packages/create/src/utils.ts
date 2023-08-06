import fs from "node:fs";
import path from "node:path";

export function formatTargetDir(targetDir: string | undefined) {
  return targetDir?.trim().replace(/\/+$/g, "");
}

export function isEmpty(path: string) {
  const files = fs.readdirSync(path);
  return files.length === 0;
}

export function clearDir(dir: string) {
  if (!fs.existsSync(dir)) return;
  for (const file of fs.readdirSync(dir))
    fs.rmSync(path.resolve(dir, file), { recursive: true, force: true });
}

export function overwriteHandle(overwrite: boolean, root: string) {
  if (overwrite) {
    clearDir(root);
  } else if (!fs.existsSync(root)) {
    fs.mkdirSync(root, { recursive: true });
  }
}

export function copy(src: string, dest: string) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    copyDir(src, dest);
  } else {
    fs.copyFileSync(src, dest);
  }
}

export function copyDir(srcDir: string, destDir: string) {
  fs.mkdirSync(destDir, { recursive: true });
  for (const file of fs.readdirSync(srcDir)) {
    const srcFile = path.resolve(srcDir, file);
    const destFile = path.resolve(destDir, file);

    copy(srcFile, destFile);
  }
}
