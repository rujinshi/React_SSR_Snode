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
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "../client/template.html")
    })
  ]
});

if (isDev) {
  clientWebpackConfig.mode = "development";
  clientWebpackConfig.entry = {
    app: path.join(__dirname, "../client/app.js")
  };
  clientWebpackConfig.devServer = {
    // 本网络中的本机
    host: "0.0.0.0",
    port: "8888",
    // Tell the server where to serve content from
    contentBase: path.join(__dirname, "../dist"),
    // 开启模块热替换
    hot: true,
    // 全屏错误提示
    overlay: {
      errors: true
    },
    publicPath: "/public/",
    historyApiFallback: {
      index: "/public/index.html"
    }
  };
  // HMR
  clientWebpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin());
}

module.exports = clientWebpackConfig;
