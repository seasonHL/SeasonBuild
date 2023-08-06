import path from "path";
import { defineConfig } from "rollup";
import { fileURLToPath } from "node:url";
import ts from "@rollup/plugin-typescript";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  input: path.resolve(__dirname, "./src/index.ts"),
  output: [
    {
      file: "./dist/main.cjs",
      format: "cjs",
    },
    {
      file: "./dist/main.js",
      format: "es",
    },
  ],
  plugins: [
    ts({
      tsconfig: "tsconfig.json",
    }),
  ],
});
