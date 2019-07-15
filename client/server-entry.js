/**
 * @description 服务端打包入口
 */
import React from "react";
import { StaticRouter } from "react-router-dom";
import { Provider, useStaticRendering } from "mobx-react";
import { JssProvider } from "react-jss";
import { MuiThemeProvider } from "@material-ui/core/styles";

import App from "./views/App";

import { createStoreMap } from "./store/store";

// 避免mobx服务端渲染的内存泄漏问题
useStaticRendering(true);

//  传入对象格式：{appStore: xxx}
export default (stores, routerContext, sheetsRegistry, jss, theme, url) => (
  <Provider {...stores}>
    <StaticRouter context={routerContext} location={url}>
      <JssProvider registry={sheetsRegistry} jss={jss}>
        <MuiThemeProvider theme={theme}>
          <App />
        </MuiThemeProvider>
      </JssProvider>
    </StaticRouter>
  </Provider>
);

export { createStoreMap };
