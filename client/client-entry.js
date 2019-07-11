/**
 * @description 客户端打包入口
 */
// import { hot } from "react-hot-loader/root";
import { AppContainer } from "react-hot-loader";
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
// hot(App);

const rootHtml = document.getElementById("root");
// const render = Component => {
//   ReactDOM.render(<Component />, rootHtml);
// };

const render = Component => {
  ReactDOM.render(
    <AppContainer>
      <Component />
    </AppContainer>,
    rootHtml
  );
};

render(App);

// 模块热替换的 API
if (module.hot) {
  module.hot.accept("./App.jsx", () => {
    render(require("./App.jsx").default);
  });
}
