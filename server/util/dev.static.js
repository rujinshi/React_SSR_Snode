const axios = require("axios");
const webpack = require("webpack");
const path = require("path");
const MemoryFS = require("memory-fs");
const serverConfig = require("../../build/webpack.config.server");
var proxy = require("http-proxy-middleware");

const serverRender = require("./server-render");

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

const NativeModule = require("module");
const vm = require("vm");

// `(function(exports, require, module, __finename, __dirname){ ...bundle code })`
const getModuleFromString = (bundle, filename) => {
  const m = { exports: {} };
  const wrapper = NativeModule.wrap(bundle);
  // http://nodejs.cn/api/vm.html#vm_class_vm_script
  const script = new vm.Script(wrapper, {
    filename: filename,
    displayErrors: true
  });
  const result = script.runInThisContext();
  result.call(m.exports, m.exports, require, m);
  return m;
};

const fs = new MemoryFS();
// 执行 serevr 端的 webpack 配置
const serverCompiler = webpack(serverConfig);
// write files to memory instead of to disk
serverCompiler.outputFileSystem = fs;

let serverBundle;

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
  // const m = new module.constructor();
  // 实例化一个module调用_compile方法
  // 第一个参数是javascript代码，第二个参数是自定义文件名
  // m._compile(bundle, "server-entry.js");
  const m = getModuleFromString(bundle, "server-entry.js");
  // 导出 serverBundle
  // serverBundle 就是 服务端入口js 经过webpack 打包后的文件
  serverBundle = m.exports;
  // createStoreMap 是在 server-entry.js 中被导出的
  // createStoreMap = m.exports.createStoreMap;
});

module.exports = app => {
  // 将 /public 的请求 代理到 webpack dev server 启动的服务上
  // http://localhost:3001/public/app.ae1167ed.js  -> http://localhost:8888/public/app.ae1167ed.js
  app.use(
    "/public",
    proxy({
      target: "http://localhost:8888"
    })
  );

  app.get("*", (req, res, next) => {
    if (!serverBundle) {
      return res.send("waiting for compile, refresh later");
    }
    getTemplate()
      .then(template => {
        return serverRender(serverBundle, template, req, res);
      })
      .catch(next);
  });
};
