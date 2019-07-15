const axios = require("axios");
const webpack = require("webpack");
const path = require("path");
const ejs = require("ejs");
const MemoryFS = require("memory-fs");
const serialize = require("serialize-javascript");
const asyncBootstrap = require("react-async-bootstrapper").default;
const serverConfig = require("../../build/webpack.config.server");
var ReactSSR = require("react-dom/server");
var proxy = require("http-proxy-middleware");

// 读取打包后的 server.ejs 文件模板
// 因为 webpack dev server 打包后的文件存在内存中 不好直接获取
const getTemplate = () => {
  return new Promise((resolve, reject) => {
    axios
      .get("http://localhost:8888/public/server.ejs")
      .then(res => {
        resolve(res.data);
      })
      .catch(reject);
  });
};

const fs = new MemoryFS();
// 执行 serevr 端的 webpack 配置
const serverCompiler = webpack(serverConfig);
// write files to memory instead of to disk
serverCompiler.outputFileSystem = fs;

let serverBundle, createStoreMap;

// 监听 服务端webpack配置的变化
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
  // 获取服务端打包后 bundle 在内存中的路径
  const bundlePath = path.join(
    serverConfig.output.path,
    serverConfig.output.filename
  );
  // 读出来的 bundle 是 string 并不是可以直接使用的 模块内容
  // 注意编码格式
  const bundle = fs.readFileSync(bundlePath, "utf-8");
  const m = new module.constructor();
  // 实例化一个module调用_compile方法
  // 第一个参数是javascript代码，第二个参数是自定义文件名
  m._compile(bundle, "server-entry.js");
  // 导出 serverBundle
  // serverBundle 就是 服务端入口js 经过webpack 打包后的文件
  serverBundle = m.exports.default;
  // createStoreMap 是在 server-entry.js 中被导出的
  createStoreMap = m.exports.createStoreMap;
});

const getStoreState = stores => {
  return Object.keys(stores).reduce((result, storeName) => {
    result[storeName] = stores[storeName].toJson();
    return result;
  }, {});
};

module.exports = app => {
  // 将 /public 的请求 代理到 webpack dev server 启动的服务上
  // http://localhost:3001/public/app.ae1167ed.js  -> http://localhost:8888/public/app.ae1167ed.js
  app.use(
    "/public",
    proxy({
      target: "http://localhost:8888"
    })
  );

  app.get("*", (req, res) => {
    getTemplate().then(template => {
      const routerContext = {};
      const stores = createStoreMap();
      // app is React element
      const reactApp = serverBundle(stores, routerContext, req.url);

      asyncBootstrap(reactApp)
        .then(() => {
          // 在服务端渲染做好重定向
          if (routerContext.url) {
            res.status(302).setHeader("Location", routerContext.url);
            res.end();
            return;
          }

          const state = getStoreState(stores);
          // Render a React element to its initial HTML.
          const content = ReactSSR.renderToString(reactApp);
          // ejs 渲染
          const html = ejs.render(template, {
            appString: content,
            // 序列化 state 为 JSON
            initialState: serialize(state)
          });
          res.send(html);
        })
        .catch(err => console.log("Eek, error!", err));
    });
  });
};
