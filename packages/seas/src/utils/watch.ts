import { Server } from "http";
import { WebSocketServer } from "ws";
import chokidar from "chokidar";
import { buildJS, copyHTML } from "./build";

export function watchServer(server: Server) {
  const wss = new WebSocketServer({ server });
  // 监听前端文件的变化，并通知浏览器刷新
  const watcher = chokidar.watch(".", {
    persistent: true, // 持续监听
    ignored: ["dist"],
  });
  wss.on("connection", (socket) => {
    watcher.on("change", async (path) => {
      await buildJS();
      if (path.includes("html")) copyHTML();
      socket.send("reload");
    });
  });
}
