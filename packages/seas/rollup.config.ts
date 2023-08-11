import path from "path";
import { defineConfig } from "rollup";
import { fileURLToPath } from "node:url";
import json from "@rollup/plugin-json";
import ts from "@rollup/plugin-typescript";
import replace from "@rollup/plugin-replace";
import commonjs from "@rollup/plugin-commonjs";
import { nodeResolve } from "@rollup/plugin-node-resolve";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

const plugins = [
  ts({
    tsconfig: "tsconfig.json",
    allowSyntheticDefaultImports: true,
  }),
  nodeResolve(),
  commonjs(),
  json(),
  replace({
    preventAssignment: true,
    values: {
      __dirname: 'fileURLToPath(new URL(".", import.meta.url))',
      __filename: "fileURLToPath(import.meta.url)",
    },
  }),
];

const serverConfig = defineConfig({
  input: path.resolve(__dirname, "./src/server/index.ts"),
  output: [
    {
      file: "./dist/server/main.cjs",
      format: "cjs",
    },
    {
      file: "./dist/server/main.js",
      format: "es",
    },
  ],
  plugins,
});
const mainConfig = defineConfig({
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
  plugins,
  external: ["esbuild"],
});

export default defineConfig([mainConfig, serverConfig]);
