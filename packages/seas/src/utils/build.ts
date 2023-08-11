import esbuild from "esbuild";
import fs from "fs";

const regex = /<script.*?src="(.*?)".*?><\/script>/g;

export async function pack(html: string) {
  const entries = html.match(regex)?.map((v) => v.replace(regex, "$1"));
  await esbuild.build({
    entryPoints: [...Array.from(entries ?? [])],
    bundle: true,
    outfile: "dist/src/bundle.js",
    footer: {
      js: `const socket = new WebSocket('ws://localhost:8080');
          socket.onmessage = (event) => {
             if (event.data === 'reload') {
                 location.reload();
          }
       };`,
    },
  });
}

export function readHTML() {
  const src = "index.html";
  return fs.readFileSync(src, "utf8") as unknown as string;
}

export async function writeHTML(html: string) {
  return new Promise<void>((resolve) => {
    const dest = "dist/index.html";
    const modContent = html.replace(
      regex,
      `<script src="src/bundle.js"></script>`
    );
    fs.writeFile(dest, modContent, (err) => {
      if (err) console.error(err);
      resolve();
    });
  });
}

export async function build() {
  try {
    const html = readHTML();
    await pack(html);
    await writeHTML(html);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }

  // fs.copyFile(src, dest, (err) => {
  //   console.error(err);
  // });
}
