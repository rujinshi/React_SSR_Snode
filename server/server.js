/**
 * @description 服务端启动 js
 */
const express = require("express");
const fs = require("fs");
const path = require("path");
const favicon = require("serve-favicon");
var ReactSSR = require("react-dom/server");
const app = express();
// 判断开发环境
let isDev = process.env.NODE_ENV === "development";

app.use(favicon(path.join(__dirname, "../favicon.ico")));

// 生产模式
if (!isDev) {
  const serverEntry = require("../client/server-entry.js").default;
  // 同步读取打包后的 index.html 模板
  const template = fs.readFileSync(
    path.join(__dirname, "../dist/index.html"),
    "utf8"
  );
  // 映射静态资源到 dist 路径下
  app.use("/public", express.static(path.join(__dirname, "../dist")));

  app.get("*", (req, res) => {
    const serverEntryString = ReactSSR.renderToString(serverEntry);
    const htmlString = template.replace(
      "<!--react-ssr-outlet-->",
      `${serverEntryString}`
    );
    res.send(htmlString);
  });
} else {
  // 开发模式
  const devStatic = require("./util/dev.static");
  devStatic(app);
}

app.listen(3001, () => {
  console.log("server is listening on 3001");
});
