/**
 * @description 客户端打包入口
 */
import { AppContainer } from "react-hot-loader";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "mobx-react";
import { BrowserRouter } from "react-router-dom";
import App from "./views/App";
import appState from "./store/app-state";

const root = document.getElementById("root");

const render = Component => {
  ReactDOM.render(
    <AppContainer>
      <Provider appState={appState}>
        <BrowserRouter>
          <Component />
        </BrowserRouter>
      </Provider>
    </AppContainer>,
    root
  );
};

// const render = Component => {
//   ReactDOM.render(
//     <AppContainer>
//       <Provider appState={appState}>
//         <Component />
//       </Provider>
//     </AppContainer>,
//     rootHtml
//   );
// };

render(App);

// 模块热替换的 API
if (module.hot) {
  module.hot.accept("./views/App", () => {
    const nextApp = require("./views/App").default;
    render(nextApp);
  });
}
