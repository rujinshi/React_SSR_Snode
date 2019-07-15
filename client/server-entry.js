/**
 * @description 服务端打包入口
 */
import React from "react";
import { StaticRouter } from "react-router-dom";
import App from "./views/App";

import { Provider, useStaticRendering } from "mobx-react";
import { createStoreMap } from "./store/store";

// 避免mobx服务端渲染的内存泄漏问题
useStaticRendering(true);

export default (stores, routerContext, url) => (
  <Provider {...stores}>
    <StaticRouter context={routerContext} location={url}>
      <App />
    </StaticRouter>
  </Provider>
);

export { createStoreMap };
