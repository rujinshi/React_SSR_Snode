let isDev = process.env.NODE_ENV === "development";
const baseWebpackConfig = {
  resolve: {
    extensions: [".js", ".jsx"]
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: {
          loader: "file-loader",
          options: {
            name: "[hash].[ext]"
          }
        }
      }
    ]
  }
};

if (isDev) {
  baseWebpackConfig.resolve = {
    ...baseWebpackConfig.resolve,
    alias: {
      "react-dom": "@hot-loader/react-dom"
    }
  };
}

module.exports = baseWebpackConfig;
