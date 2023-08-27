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
