# React + express 服务端渲染 demo

This is a react ssr demo. It base on react16.x and webpack4.x

## 概况



## 项目收益

## 项目架构

## 目录结构
```js
.
├── README.md
├── build //webpack 配置
│   ├── webpack.config.base.js
│   ├── webpack.config.client.js
│   └── webpack.config.server.js
├── client
│   ├── app.js // 客户端打包入口
│   ├── config // 路由配置信息
│   │   └── router.jsx
│   ├── server-entry.js //服务端打包入口
│   ├── server.template.ejs // 服务端 ejs 模板
│   ├── store // 业务数据 包括存储获取
│   │   ├── app-state.js
│   │   ├── store.js
│   │   └── topic-store.js
│   ├── template.html  // 客户端 html 模板
│   ├── util  // 工具函数
│   │   ├── http.js
│   │   └── variable-define.js
│   └── views
│       ├── App.jsx // 所有页面主入口
│       ├── layout //页面总体布局
│       │   ├── app-bar.jsx
│       │   └── container.jsx
│       ├── test //api 测试
│       │   └── api-test.jsx
│       ├── topic-detail  //话题详情
│       │   ├── index.jsx
│       │   ├── reply.jsx
│       │   └── styles.js
│       ├── topic-list //话题列表
│       │   ├── index.jsx
│       │   ├── list-item.jsx
│       │   └── styles.js
│       └── user //个人中心
│           ├── info.jsx
│           ├── login.jsx
│           ├── styles 
│           │   ├── bg.jpg
│           │   ├── login-style.js
│           │   ├── user-info-style.js
│           │   └── user-style.js
│           └── user-container.jsx
├── favicon.ico
├── nodemon.json
├── package.json
├── server 
│   ├── server.js 
│   └── util // 服务端工具函数
│       ├── dev.static.js
│       ├── handle-login.js
│       ├── proxy.js
└──     └── server-render.js

```

## 如何运行

1.安装依赖 yarn
2.打包




## 开发过程一些记录

### 1.开发模式和生产模式下「实时服务端渲染」？
服务端渲染需要**两个**东西：

1.webpack 打包后的服务端js bundle

2.server.ejs(注入了 client 端的 jsbundle)

`生产模式`：

可以直接获取 webpack build 后输出的bundle ---> server-entry.js，以及服务端 ejs 模板，将两者结合起来，返回最终内容。

`开发模式`

1.怎么拿 ejs？（server/util/dev.static.js Line 27~38）

server.ejs 在webpack dev server中，是在内存中的，我们无法获取 --> 通过http请求，获取到 dev server 上的 ejs模板（http://localhost:8888/public/server.ejs）；

2.怎么拿bundle？（server/util/dev.static.js Line 49~85）

* 获取 webpack 的 server 配置文件，启动一个webpack的编译器，可以监听（watch） entry 下的文件是否有变化，一旦变化会重新打包。

* 获取 bundlePath

* 通过 memory-fs 在内存中读取到对应的 jsbundle（读取出来的结果是字符串,要转成 module 才可以使用）

* 

* 将两者结合起来，返回最终内容。

#### 问题：服务端启动后，发现并**没有**请求到对应的 js，而只有 html。
webpack dev server 模式下，静态资源都在内存中，因此我们通过（http-proxy-middleware）代理转发获取 dev server 路径下的资源。
```js
// 将 /public 的请求 代理到 webpack dev server 启动的服务上
// http://localhost:3001/public/xxxx.js  -> http://localhost:8888/public/xxxx.js
  app.use(
    "/public",
    proxy({
      target: "http://localhost:8888"
    })
  );
```

### 2.数据流管理技术选型
#### 为什么用 Mobx（与Redux对比）？

1.Mobx是面向对象的，Redux是函数式编程。

2.Redux 理想的是 immutable 的，每次都返回一个新的数据，数据一旦更新，需要做整棵数据树的全拷贝，生成一棵新树，会触发所有 Component 的重新渲染。Mobx从始至终都是一份引用。

3.Mobx 的 observable 可以让组件做到精确更新，相比 Redux 粒度更细。

### 3.接口请求设计

#### accessToken 相关请求
**问题**

部分接口需要带 accessToken 才有权限请求，accesstoken 是用户登录后，cnodejs 服务器返回的。accesstoken 不能存在浏览器里，有安全风险。

**解决方案**：

获取 accessToken后，通过 session 存在 server 端。如果验证通过，在 session 里构建一个 user 对象，存放服务端返回的用户信息。

封装登录中间件过程：`server/util/handle-login.js`

部分关键代码：
```js
router.post("/login", function(req, res, next) {
  axios
    .post(`${baseUrl}/accesstoken`, {
      accesstoken: req.body.accessToken
    })
    .then(resp => {
      if (resp.status === 200 && resp.data.success) {
        req.session.user = {
          accessToken: req.body.accessToken,
          loginName: resp.data.loginname,
          id: resp.data.id,
          avatarUrl: resp.data.avatar_url
        };
        res.json({
          success: true,
          data: resp.data
        });
      }
    })
    ...
```

#### 其他业务接口设计
`server/util/proxy.js`

#### 接口测试
用户通过浏览器访问时需要将其请求代理到服务端：

```js
if (isDev) {
    ...
    clientWebpackConfig.devServer = {
        host: '0.0.0.0',
        port: '8888',
        ...
       // 客户端请求代理到服务端
        proxy: {
          '/api': 'http://localhost:2333'
        }
    };
    ...
}
```

### 4.服务端渲染优化

#### 服务端基础配置
```js
// server-entry.js

import React from "react";
import { StaticRouter } from "react-router-dom";
import { Provider, useStaticRendering } from "mobx-react";
import { JssProvider } from "react-jss";
import { MuiThemeProvider } from "@material-ui/core/styles";

import App from "./views/App";

// 创建 Store
import { createStoreMap } from "./store/store";

// 避免mobx服务端渲染的内存泄漏问题
useStaticRendering(true);

//  传入对象格式：{appStore: xxx}
// 导出的 server-entry 是一个方法
export default (stores, routerContext, sheetsRegistry, jss, theme, url) => (
  // Provider 可以需要接受多个store 
  <Provider {...stores}>
  // routerContext  会在静态渲染的时候，往这个对象里添加一些信息
  // A location object shaped like { pathname, search, hash, state }
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
```


#### 路由跳转 重定向服务端渲染

当客户端访问根路径时，会重定向到 /list：
`<Route exact path="/" render={() => <Redirect to="/list" />} key="root" />`

但是服务端的 `StaticRouter` 是没有状态的，当我们访问跟路劲时，是不会重定向到 /list 的。

通过 routerContext 这个 props 实现重定向。

```js
// 在服务端渲染做重定向
if (routerContext.url) {
  res.status(302).setHeader("Location", routerContext.url);
  res.end();
  return;
}
```

#### 服务端异步渲染

项目中有许多异步处理的场景，我们希望，可以在异步执行完毕之后，再进行服务端渲染 & 客户端内容生成。

安装 `react-async-bootstrapper`

异步操作需要放在bootstrap方法下执行，return 一个 Promise ，服务端渲染时，会等待这个方法的 Promise 返回true后，再执行渲染逻辑。

#### store数据同步

发现服务端和客户端数据不同步。因为，在服务端渲染时，已经请求得到响应数据，所以客户端应该直接拿这些数据使用，而不是再次请求一遍 API。

服务端渲染模板：

```html
server.template.ejs

...
<body>
  <div id="root"><%%- appString %></div>
  <script>
    window.__INITIAL__STATE__ = <%%- initialState%>
  </script>
</body>
...

```

>将来 appString 会被服务端渲染 renderToString 后的 HTML 内容替代。

>通过 initialState 变量 实现服务端将 state 注入到前端。


```js
server-render.js

const serialize = require("serialize-javascript");


const getStoreState = stores => {
  return Object.keys(stores).reduce((result, storeName) => {
    result[storeName] = stores[storeName].toJson();
    return result;
  }, {});
};

...
const state = getStoreState(stores);
// Render a React element to its initial HTML.
const content = ReactSSR.renderToString(app);
// ejs 渲染
const html = ejs.render(template, {
  appString: content,
  // 序列化 state 为 JSON  原始 state 是 object
  initialState: serialize(state),
  meta: helmet.meta.toString(),
  title: helmet.title.toString(),
  style: helmet.style.toString(),
  link: helmet.link.toString(),
  materialCss: sheetRegistry.toString()
});
```

通过以上步骤虽然客户端拿到了 initialState 的值，但是前端并没有显示:

```js
app-state.js

class AppState {
  @observable user;

  constructor({
    user = {
      isLogin: false,
      info: {},
      detail: {
        syncing: false,
        recent_topics: [],
        recent_replies: []
      },
      collections: {
        syncing: false,
        list: []
      }
    }
  } = {}) {
    this.user = user;
  }
  ...
}
```
定义 State 的构造方法，允许通过传入对象构造 State.

```js
app.js

...
// 获取服务端模板传来的 __INITIAL__STATE__
const initialState = window.__INITIAL__STATE__ || {};
...
```

#### SEO
通过 `react-helmet` 完成 meta 等标签的添加，有利于 SEO。

```js
server-render.js

const Helmet = require("react-helmet").default;
...
const helmet = Helmet.renderStatic();
...
const html = ejs.render(template, {
  appString: content,
  // 序列化 state 为 JSON
  initialState: serialize(state),
  // SEO
  meta: helmet.meta.toString(),
  title: helmet.title.toString(),
  style: helmet.style.toString(),
  link: helmet.link.toString(),
  materialCss: sheetRegistry.toString()
});
....
```































