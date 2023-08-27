/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from "fs";
import esbuild from "esbuild";
import logger from "./logger";

const regex = /<script.*?src="(.*?)".*?><\/script>/g;

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
  const [outfile, js] = [
    "dist/src/bundle.js",
    `const socket = new WebSocket('ws://localhost:8080');
    socket.onmessage = (event) => {
      if (event.data === 'reload') {
        location.reload();
      }
    };`,
  ];
  if (!entries) {
    if (!fs.existsSync("dist")) await fs.promises.mkdir("dist");
    if (!fs.existsSync("dist/src")) await fs.promises.mkdir("dist/src");
    fs.writeFile(outfile, js, (err) => {
      if (err) logger.err(err?.message);
    });
  } else
    await esbuild.build({
      entryPoints: [...Array.from(entries)],
      bundle: true,
      outfile,
      footer: {
        js,
      },
    });
}

export async function copyHTML() {
  const html = readHTML();
  if (!html) return;
  if (!fs.existsSync("dist")) await fs.promises.mkdir("dist");
  return new Promise<void>((resolve) => {
    const dest = "dist/index.html";
    const modContent = regex.test(html)
      ? html?.replace(regex, `<script src="src/bundle.js"></script>`)
      : html.replace(
          "</body>",
          `   <script src="src/bundle.js"></script>
          </body>`
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
    await buildJS();
    await copyHTML();
  } catch (error) {
    console.error((error as { message: string }).message);
  }
}
