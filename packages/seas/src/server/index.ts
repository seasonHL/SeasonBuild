import http, { RequestListener } from "http";
import fs from "fs";
import path from "path";
import { watchServer } from "../utils/watch";
import { printServerUrls } from "@/utils/logger";
import readline from "readline";

const contentTypes = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
};

const reqUrlHandler = (url: string) => {
  const basePath = "./dist";
  let filePath = basePath + url;
  if (url === "/") {
    filePath = basePath + "/index.html"; // 默认加载index.html
  } else if (!/\.[a-zA-Z0-9]+$/.test(url ?? "")) {
    filePath = filePath + ".js";
  }
  return filePath;
};

const requestListener: RequestListener = (req, res) => {
  // 根据请求的URL，读取对应的文件
  const { url } = req;
  const filePath = reqUrlHandler(url ?? "");

  const extname = path.extname(filePath);

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === "ENOENT") {
        res.writeHead(404);
        res.end("File not found!");
      } else {
        res.writeHead(500);
        res.end("Server error!");
      }
    } else {
      res.writeHead(200, {
        "Content-Type": contentTypes[extname as keyof typeof contentTypes],
      });
      res.end(content, "utf-8");
    }
  });
};

export function createServer() {
  const server = http.createServer(requestListener);
  return {
    server,
    listen(port: number) {
      server.listen(port, () => {
        printServerUrls(`http://localhost:${port}/`);
      });
    },
  };
}

export function serverStart() {
  const server = createServer();

  watchServer(server.server);

  const PORT = 8080;
  server.listen(PORT);
  readline.emitKeypressEvents(process.stdin);
  process.stdin.setRawMode(true);
  process.stdin.on("keypress", (str, key) => {
    if (key.ctrl && key.name === "c") process.exit();
    const actions = {
      q: () => process.exit(),
    };

    const action = actions[str as keyof typeof actions];
    action?.();
  });
}
