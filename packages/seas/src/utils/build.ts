import esbuild from "esbuild";
import fs from "fs";

export async function pack() {
  esbuild.build({
    entryPoints: ["src/index.js"],
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

export async function writeHTML() {
  const src = "index.html";
  const dest = "dist/index.html";

  const html = fs.readFileSync(src, "utf8") as unknown as string;
  const modContent = html.replace("src/index", `src/bundle`);
  fs.writeFile(dest, modContent, (err) => {
    if (err) console.error(err);
  });
}

export async function build() {
  try {
    await pack();
    writeHTML();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }

  // fs.copyFile(src, dest, (err) => {
  //   console.error(err);
  // });
}
