import { serverStart } from "../server";
import { build } from "../utils/build";
import { program } from "commander";

program.option("-w --watch");
program.command("dev", { isDefault: true }).action(() => {
  build()
    .then(() => serverStart())
    .catch(() => process.exit(1));
});
program.command("build").action(() => {
  build();
});
program.parse();

export const options = program.opts();
