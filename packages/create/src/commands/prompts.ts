import fs from "node:fs";
import prompts from "prompts";
import { formatTargetDir, isEmpty } from "../utils";
import { reset, cyan, green, gray, blue, yellow } from "kolorist";
import { PromptsAnswers, PromptsResult } from "../types";
import { argv } from "./argv";

const defaultTargetDir = process.env.TARGET_DIR || "seas-project";

export async function getPrmtsRes(): Promise<PromptsResult> {
  // 命令行第一个参数，替换反斜杠 / 为空字符串
  const argTargetDir = formatTargetDir(argv._[0]);
  let targetDir = argTargetDir || defaultTargetDir;
  let result: PromptsAnswers;

  result = await prompts(
    [
      {
        type: argTargetDir ? null : "text",
        name: "projectName",
        message: reset("Project name:"),
        initial: defaultTargetDir,
        onState: (state) => {
          targetDir = formatTargetDir(state.value) || defaultTargetDir;
        },
      },
      {
        type: () =>
          !fs.existsSync(targetDir) || isEmpty(targetDir) ? null : "confirm",
        name: "overwrite",
        message: () =>
          `${
            targetDir === "."
              ? "Current directory"
              : `Target directory "${targetDir}"`
          } is not empty. Remove existing files and continue?`,
      },
      {
        type: "select",
        name: "framework",
        message: " Select a framework:",
        choices: [
          { title: cyan("React"), value: "react" },
          { title: green("Vue"), value: "vue" },
          { title: gray("None"), value: null },
        ],
      },
      {
        type: (v) => (v ? "select" : null),
        name: "variant",
        message: "Select a variant:",
        choices: (prev) =>
          [
            { title: blue("Typescript"), value: "ts" },
            { title: yellow("Javascript"), value: "js" },
          ].map((v) => ({ ...v, value: `${prev}-${v.value}` })),
      },
    ],
    {
      onCancel: () => {
        throw new Error("Operation cancelled");
      },
    }
  );
  return { ...result, targetDir };
}
