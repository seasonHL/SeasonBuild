import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
// import spawn from "cross-spawn";
import { copyDir, overwriteHandle } from "../utils";
import { PromptsResult } from "../types";
import { getPrmtsRes } from "./prompts";

const cwd = process.cwd();
const __filename = fileURLToPath(import.meta.url);

export default async function create() {
  let result: PromptsResult;

  try {
    result = await getPrmtsRes();
  } catch (cancelled: any) {
    console.log(cancelled.message);
    return;
  }

  const { projectName, overwrite, framework, variant, targetDir } = result;

  const root = path.join(cwd, targetDir);
  overwriteHandle(overwrite, root);

  console.log(`\nScaffolding project in ${root}...`);

  const templateDir = path.resolve(
    __filename,
    "../../",
    `templates/${framework ? variant : "proto"}`
  );
  // 复制模板到目标根目录
  copyDir(templateDir, root);
  // 修改package.json
  const pkg = JSON.parse(
    fs.readFileSync(path.join(templateDir, `package.json`), "utf-8")
  );
  fs.writeFileSync(
    path.join(root, "package.json"),
    JSON.stringify({ ...pkg, name: projectName }, null, 2)
  );

  const cdProjectDir = path.relative(cwd, root);
  console.log(`\nDone. Now run:\n`);
  if (root !== cwd) {
    console.log(
      `  cd ${cdProjectDir.includes(" ") ? `"${cdProjectDir}"` : cdProjectDir}`
    );
  }
  console.log();
  // const res = spawn.sync(
  //   "git",
  //   [
  //     "clone",
  //     "https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts",
  //   ],
  //   { stdio: "inherit" }
  // );
}
