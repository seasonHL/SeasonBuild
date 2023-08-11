import { serverStart } from "./server";
import { build } from "./utils/build";

build()
  .then(() => serverStart())
  .catch(() => process.exit(1));
