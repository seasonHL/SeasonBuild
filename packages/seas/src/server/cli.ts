import { spawn } from "child_process";
import { program } from "commander";

program.option("-w --watch");
program.parse();

export const options = program.opts();

export const pros = spawn("seas", [], {
  stdio: "inherit",
});
