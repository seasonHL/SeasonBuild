import path from "path";
import { defineConfig } from "rollup";
import { fileURLToPath } from "node:url";
import json from "@rollup/plugin-json";
import ts from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";
import { nodeResolve } from "@rollup/plugin-node-resolve";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

const plugins = [
  ts({
    tsconfig: "tsconfig.json",
    allowSyntheticDefaultImports: true,
    declarationDir: "dist",
    declaration: true,
  }),
  nodeResolve(),
  commonjs(),
  json(),
];

const sharedOptions = defineConfig({
  treeshake: {
    // 所有外部模块都被视为无副作用，可以被 Tree Shaking 移除
    moduleSideEffects: "no-external",
    // 不希望属性读取（对象的属性访问）被视为有副作用，也可以被 Tree Shaking 移除
    propertyReadSideEffects: false,
  },
  output: {
    dir: path.resolve(__dirname, "dist"),
    entryFileNames: `[name].js`,
    chunkFileNames: "chunks/dep-[hash].js",
    exports: "named",
    format: "esm",
    freeze: false,
  },
  external: ["esbuild"],
  plugins,
});

function createConfig() {
  return defineConfig({
    ...sharedOptions,
    input: {
      index: path.resolve(__dirname, "src/utils/index.ts"),
      cli: path.resolve(__dirname, "src/server/cli.ts"),
      client: path.resolve(__dirname, "src/client/client.ts"),
    },
    output: {
      ...sharedOptions.output,
    },
  });
}

function createCjsConfig() {
  return defineConfig({
    ...sharedOptions,
    input: {
      index: path.resolve(__dirname, "src/utils/index.ts"),
      cli: path.resolve(__dirname, "src/server/cli.ts"),
      client: path.resolve(__dirname, "src/client/client.ts"),
    },
    output: {
      dir: path.resolve(__dirname, "dist"),
      entryFileNames: `[name].cjs`,
      chunkFileNames: "chunks/dep-[hash].cjs",
      exports: "named",
      format: "cjs",
      freeze: false,
    },
  });
}

export default defineConfig([createConfig(), createCjsConfig()]);
