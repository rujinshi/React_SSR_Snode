/**
 * @description 服务端启动 js
 */
const express = require("express");
const fs = require("fs");
const path = require("path");
const favicon = require("serve-favicon");
const bodyParser = require("body-parser");
const session = require("express-session");
const serverRender = require("./util/server-render");

// 判断开发环境
let isDev = process.env.NODE_ENV === "development";

const app = express();

// parse application/json
app.use(bodyParser.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// Use the session middleware
app.use(
  session({
    name: "tid",
    // 是否每次都重新保存会话
    resave: false,
    saveUninitialized: false,
    secret: "yuchunjiao#react",
    maxAge: 10 * 60 * 1000
  })
);

app.use(favicon(path.join(__dirname, "../favicon.ico")));
// 登录接口 和 其他请求接口 中间件入口
app.use("/api/user", require("./util/handle-login"));
app.use("/api", require("./util/proxy"));

// 生产模式
if (!isDev) {
  const serverEntry = require("../client/server-entry.js");
  // 同步读取打包后的 server.ejs 模板
  const template = fs.readFileSync(
    path.join(__dirname, "../dist/server.ejs"),
    "utf8"
  );
  // 通过带有 /public 的虚拟路径前缀地址 来访问 dist 目录中的文件
  app.use("/public", express.static(path.join(__dirname, "../dist")));

  app.get("*", (req, res, next) => {
    serverRender(serverEntry, template, req, res).catch(next);
  });
} else {
  // 开发模式
  const devStatic = require("./util/dev.static");
  devStatic(app);
}

// 错误处理
app.use((error, req, res, next) => {
  console.log("server error is", error);
  res.status(500).send(error);
});

app.listen(80, () => {
  console.log(" 👏 服务起来了 server is listening on 80 端口");
});
