import http from "http";
import fs from "fs";
import path from "path";
import { watchServer } from "../utils/watch";

export function serverStart() {
  const server = http.createServer((req, res) => {
    // 根据请求的URL，读取对应的文件
    let filePath = "." + req.url;
    if (filePath === "./") {
      filePath = "./dist/index.html"; // 默认加载index.html
    } else filePath = filePath.replace("./", "./dist/");

    const extname = path.extname(filePath);
    let contentType = "text/html";
    switch (extname) {
      case ".js":
        contentType = "text/javascript";
        break;
      case ".css":
        contentType = "text/css";
        break;
    }

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
        res.writeHead(200, { "Content-Type": contentType });
        res.end(content, "utf-8");
      }
    });
  });

  watchServer(server);

  const PORT = 8080;
  server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
  });
}
