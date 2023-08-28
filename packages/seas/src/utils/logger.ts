import { VERSION } from "@/server/constants";
import pc from "picocolors";
export default {
  info(info) {
    console.log(pc.green(info));
  },
  warn(warn) {
    console.log(pc.yellow(warn));
  },
  err(err) {
    console.log(pc.red(err));
  },
} as {
  [key: string]: (input: Parameters<typeof pc.dim>[0]) => void;
};

export const printServerUrls = (url: string) => {
  console.log(
    `${pc.green(`${pc.bold("SEASON_BUILD")} v${VERSION}`)} ready in ${pc.reset(
      pc.bold(~~performance.now())
    )} ms`
  );

  console.log(
    `${pc.reset(pc.bold("Local: "))} ${pc.cyan(
      url.replace(/:(\d+)\//, (_, port) => `:${pc.bold(port)}/`)
    )}`
  );
};
