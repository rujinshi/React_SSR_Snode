/**
 * @description 服务端启动 js
 */
const express = require("express");
const fs = require("fs");
const path = require("path");
const favicon = require("serve-favicon");
var ReactSSR = require("react-dom/server");
const bodyParser = require("body-parser");
const session = require("express-session");

// 判断开发环境
let isDev = process.env.NODE_ENV === "development";

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// 设置 session
app.use(
  session({
    maxAge: 10 * 60 * 1000,
    name: "tid",
    resave: false,
    saveUninitialized: false,
    secret: "react cnode class"
  })
);

app.use(favicon(path.join(__dirname, "../favicon.ico")));
// 登录接口 和 一般请求接口
app.use("/api/user", require("./util/handle-login"));
app.use("/api", require("./util/proxy"));

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
