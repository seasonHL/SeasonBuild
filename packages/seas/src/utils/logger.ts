import { VERSION } from "@/server/constants";
import pc from "picocolors";
const { green, yellow, red, gray, cyan, dim, reset, bold } = pc;
const stress = (s: string) => reset(bold(s));
const logger = {
  info(info) {
    console.log(green(info));
  },
  warn(warn) {
    console.log(yellow(warn));
  },
  err(err) {
    console.log(red(err));
  },
  logs(logs) {
    const time = new Date().toISOString().match(/\d+:\d+:\d+/)?.[0];
    console.log(`${gray(time)}${cyan(bold(" [seas] "))}${logs}`);
  },
} as {
  [key: string]: (input: Parameters<typeof dim>[0]) => void;
};
export default logger;

export const printStart = () => {
  console.log();
  console.log(
    `${green(`${bold("SEASON_BUILD")} v${VERSION}`)} ${gray(
      "ready in"
    )} ${reset(bold(~~performance.now()))} ms`
  );
};

export const printServerUrls = (url: string) => {
  console.log();
  console.log(
    `${reset(bold("Local: "))} ${cyan(
      url.replace(/:(\d+)\//, (_, port) => `:${bold(port)}/`)
    )}`
  );
};

export const notice = {
  h: `press ${stress("h")} to show help`,
  r: `press ${stress("r")} to restart the server`,
  u: `press ${stress("u")} to show server url`,
  o: `press ${stress("o")} to open in browser`,
  c: `press ${stress("c")} to clear console`,
  q: `press ${stress("q")} to quit`,
};

export const printNotice = () => {
  console.log();
  console.log(stress("Shortcuts"));
  Object.entries(notice).forEach(([k, v]) => k !== "h" && console.log(v));
};
