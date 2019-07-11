// let isDev = process.env.NODE_ENV === "development";
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
      }
    ]
  }
};

module.exports = (env, argv) => {
  console.log("env is ===>", env);
  console.log("argv is ===>", argv);
  console.log("process.env.NODE_ENV===>", process.env.NODE_ENV);
  if (argv.mode === "development") {
    baseWebpackConfig.resolve = {
      ...baseWebpackConfig.resolve,
      alias: {
        "react-dom": "@hot-loader/react-dom"
      }
    };
  }
  return baseWebpackConfig;
};

// if (isDev) {
//   baseWebpackConfig.resolve = {
//     ...baseWebpackConfig.resolve,
//     alias: {
//       "react-dom": "@hot-loader/react-dom"
//     }
//   };
// }

// module.exports = baseWebpackConfig;
