/**
 * @description 服务端 webpack 配置文件
 */
const path = require("path");
const merge = require("webpack-merge");
const webpack = require("webpack");
const baseWebpackConfig = require("./webpack.config.base");
let isDev = process.env.NODE_ENV === "development";
const serverWebpackConfig = merge(baseWebpackConfig, {
  mode: "production",
  target: "node", //指定node运行环境
  // 服务端打包入口
  entry: {
    app: path.join(__dirname, "../client/server-entry.js")
  },
  output: {
    path: path.join(__dirname, "../dist"),
    publicPath: "/public/",
    filename: "server-entry.js",
    libraryTarget: "commonjs2" //打包成commonjs2规范
  },
  // package.json 中的依赖项不进行打包 ，
  // 运行时(runtime)再去从外部获取这些扩展依赖
  externals: Object.keys(require("../package.json").dependencies),
  plugins: [
    new webpack.DefinePlugin({
      "process.env.API_BASE": '"http://127.0.0.1:8888"'
    })
  ]
});

if (isDev) {
  serverWebpackConfig.mode = "development";
}

module.exports = serverWebpackConfig;
