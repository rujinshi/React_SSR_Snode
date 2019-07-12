/**
 * @description 客户端打包入口
 */
import { AppContainer } from "react-hot-loader";
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./views/App";

const rootHtml = document.getElementById("root");

const render = Component => {
  ReactDOM.render(
    <AppContainer>
      <Router>
        <Component />
      </Router>
    </AppContainer>,
    rootHtml
  );
};

render(App);

// 模块热替换的 API
if (module.hot) {
  module.hot.accept("./views/App", () => {
    const nextApp = require("./views/App").default;
    render(nextApp);
  });
}
