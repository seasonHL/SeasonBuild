/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from "fs";
import esbuild, { BuildOptions } from "esbuild";
import logger from "./logger";

const regex = /<script.*?src="(.*?)".*?><\/script>/g;
/**
 * 返回去除注释的html模板
 */
function readHTML(): string | undefined {
  try {
    const src = "index.html";
    const html = fs.readFileSync(src, "utf8");
    return html.replace(/<!--.*-->/g, "");
  } catch (error: any) {
    console.error(error.message);
  }
}

export async function buildJS() {
  const html = readHTML();
  const entries = html?.match(regex)?.map((v) => v.replace(regex, "$1"));

  const baseBuildOptions: BuildOptions = {
    entryPoints: [...(entries ?? []), "seas/client"],
    bundle: true,
  };
  const buildOptions: BuildOptions = {
    ...baseBuildOptions,
    outdir: "dist",
  };
  await esbuild.build(buildOptions);
}

export async function copyHTML() {
  const html = readHTML();
  if (!html) return;
  if (!fs.existsSync("dist")) await fs.promises.mkdir("dist");
  return new Promise<void>((resolve) => {
    const dest = "dist/index.html";
    const modContent = html.replace(
      "<head>",
      `<head>
        <script src="seas/client"></script>`
    );
    fs.writeFile(dest, modContent, (err) => {
      if (err) console.error(err);
      resolve();
    });
  });
}

export async function build() {
  try {
    logger.info("build start...");
    await copyHTML();
    await buildJS();
    logger.info("successful build!");
  } catch (error) {
    console.error((error as { message: string }).message);
  }
}
