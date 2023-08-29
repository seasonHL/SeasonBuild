import { exec } from "node:child_process";

function openBrowser(url: string) {
  // 根据操作系统的不同，选择不同的命令
  const command =
    process.platform === "win32"
      ? "start"
      : process.platform === "darwin"
      ? "open"
      : "xdg-open";

  // 执行打开浏览器的命令
  exec(`${command} ${url}`, (error) => {
    if (error) {
      console.error(`打开浏览器时出现错误: ${error}`);
    }
  });
}

export default openBrowser;
