const axios = require("axios");
const webpack = require("webpack");
const path = require("path");
const MemoryFS = require("memory-fs");
const serverConfig = require("../../build/webpack.config.server");
var ReactSSR = require("react-dom/server");

// 读取打包后的inddex.html文件模板  因为 webpack dev server打包后的文件存在内存中
const getTemplate = () => {
  return new Promise((resolve, reject) => {
    axios
      .get("http://localhost:8888/public/index.html")
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err);
      });
  });
};

const fs = new MemoryFS();
const serverCompiler = webpack(serverConfig);
// write files to memory instead of to disk
serverCompiler.outputFileSystem = fs;

let serverBundle;

// 监视服务端打包入口文件
serverCompiler.watch({}, (err, stats) => {
  // error handle
  if (err) {
    console.error(err.stack || err);
    if (err.details) {
      console.error(err.details);
    }
    return;
  }
  const info = stats.toJson();
  if (stats.hasErrors()) {
    console.error(info.errors);
  }

  if (stats.hasWarnings()) {
    console.warn(info.warnings);
  }
  // 获取服务端打包后 bundle 路径
  const bundlePath = path.join(
    serverConfig.output.path,
    serverConfig.output.filename
  );
  // 读出来的 bundle 是 string 并不是可以直接使用的模块内容
  const bundle = fs.readFileSync(bundlePath, "utf-8");
  const m = new module.constructor();
  // 实例化一个module调用_compile方法
  // 第一个参数是javascript代码，第二个自定义的名称
  m._compile(bundle, "server-entry.js");
  serverBundle = m.exports.default;
});

module.exports = app => {
  app.get("*", (req, res) => {
    getTemplate().then(template => {
      const content = ReactSSR.renderToString(serverBundle);
      const htmlString = template.replace(
        "<!--react-ssr-outlet-->",
        `${content}`
      );
      res.send(htmlString);
    });
  });
};
