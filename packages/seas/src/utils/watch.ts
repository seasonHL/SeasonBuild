import { Server } from "http";
import { WebSocketServer } from "ws";
import chokidar from "chokidar";
import { pack, writeHTML } from "./build";

export function watchServer(server: Server) {
  const wss = new WebSocketServer({ server });
  wss.on("connection", (socket) => {
    // 监听前端文件的变化，并通知浏览器刷新
    const watcher = chokidar.watch(".", {
      persistent: true, // 持续监听
      ignored: ["dist"],
    });
    // watcher.on("all", (eventName, path) => {});
    watcher.on("change", async (path) => {
      await pack();
      if (path.includes("html")) writeHTML();
      socket.send("reload");
    });
  });
}
