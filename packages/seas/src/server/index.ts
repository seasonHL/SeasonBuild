import http from "node:http";
import type { RequestListener, Server } from "node:http";
import fs from "node:fs";
import path from "node:path";
import { watchServer } from "./watch";
import logger, {
  notice,
  printNotice,
  printServerUrls,
  printStart,
} from "@/utils/logger";
import readline from "readline";
import openBrowser from "@/utils/openBrowser";
import { initConfig, type ServerOptions } from "@/utils/defineConfig";

export interface DevServer {
  httpServer?: Server;
  port?: number;
  listen?: () => void;
  close?: () => Promise<void>;
  restartServer?: () => void;
}

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
  const contentTypes = {
    ".html": "text/html",
    ".js": "text/javascript",
    ".css": "text/css",
  };
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

export function createServer(config: ServerOptions = {}): DevServer {
  const { port = 8888, open } = config;
  const httpServer = http.createServer(requestListener);
  const protocol = "http";
  const hostname = "localhost";
  const url = `${protocol}://${hostname}:${port}/`;
  let isRestart = false;

  const listeningListener = () => {
    if (isRestart) {
      logger.logs("server restarted.");
      return;
    } else {
      printStart();
      printServerUrls(url);
      console.log(notice["h"]);
      open && openBrowser(url);
      isRestart = true;
    }
  };

  const listen = () => {
    httpServer.listen(port, listeningListener);
  };

  const close = () => {
    return new Promise<void>((resolve) => {
      httpServer.close(() => resolve());
    });
  };

  const restartServer = () => {
    close().then(() => listen());
  };
  return {
    httpServer,
    port,
    listen,
    close,
    restartServer,
  };
}

const keypressListener = (server: DevServer) => {
  const { restartServer, port } = server;
  const url = `http://localhost:${port}/`;
  readline.emitKeypressEvents(process.stdin);
  process.stdin.setRawMode(true);
  process.stdin.on("keypress", (str, key) => {
    if (key.ctrl && key.name === "c") process.exit();
    const actions = {
      h: () => printNotice(),
      r: () => restartServer?.(),
      u: () => printServerUrls(url),
      o: () => openBrowser(url),
      c: () => console.clear(),
      q: () => process.exit(),
    };

    const action = actions[str as keyof typeof actions];
    action?.();
  });
};

export function serverStart() {
  const { server } = initConfig;
  const devServer = createServer(server);
  watchServer(devServer);
  devServer.listen?.();
  keypressListener(devServer);
}
