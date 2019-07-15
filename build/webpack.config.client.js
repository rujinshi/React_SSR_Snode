/**
 * @description 客户端 webpack 配置文件
 */
const path = require("path");
const webpack = require("webpack");
const merge = require("webpack-merge");
const baseWebpackConfig = require("./webpack.config.base");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
// 判断开发模式
let isDev = process.env.NODE_ENV === "development";
const clientWebpackConfig = merge(baseWebpackConfig, {
  mode: "production",
  entry: {
    app: ["@babel/polyfill", path.join(__dirname, "../client/app.js")]
  },
  output: {
    path: path.join(__dirname, "../dist"),
    filename: "[name].[hash:8].js",
    // 提供资源的基础路径
    publicPath: "/public/"
  },
  module: {
    rules: [
      {
        test: /\.ejs$/,
        loader: "compile-ejs-loader",
        options: {
          htmlmin: true,
          htmlminOptions: {
            removeComments: true
          }
        }
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "../client/template.html")
    }),
    // 服务端 ejs 模板
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "../client/server.template.ejs"),
      filename: "server.ejs"
    })
  ]
});

if (isDev) {
  clientWebpackConfig.mode = "development";
  (clientWebpackConfig.devtool = "cheap-module-eval-source-map"),
    (clientWebpackConfig.entry = {
      app: path.join(__dirname, "../client/app.js")
    });
  clientWebpackConfig.devServer = {
    // 本网络中的本机
    host: "0.0.0.0",
    port: "8888",
    // Tell the server where to serve content from
    contentBase: path.join(__dirname, "../dist"),
    // 开启模块热替换
    hot: true,
    disableHostCheck: true,
    // 全屏错误提示
    overlay: {
      errors: true
    },
    publicPath: "/public/",
    historyApiFallback: {
      index: "/public/index.html"
    },
    // 客户端请求代理到服务端
    proxy: {
      "/api": "http://localhost:3001"
    }
  };
  // HMR
  clientWebpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin());
}

module.exports = clientWebpackConfig;
