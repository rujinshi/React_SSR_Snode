/**
 * @description 客户端打包入口
 */
import { AppContainer } from "react-hot-loader";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "mobx-react";
import { BrowserRouter } from "react-router-dom";
import App from "./views/App";
import AppState from "./store/app-state";
// 获取服务端模板传来的 __INITIAL__STATE__
const initialState = window.__INITIAL__STATE__ || {};

const root = document.getElementById("root");

const render = Component => {
  ReactDOM.render(
    <AppContainer>
      <Provider appState={new AppState(initialState.appState)}>
        <BrowserRouter>
          <Component />
        </BrowserRouter>
      </Provider>
    </AppContainer>,
    root
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
