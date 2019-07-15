const serialize = require("serialize-javascript");
const ejs = require("ejs");
const bootstrapper = require("react-async-bootstrapper");

const ReactSSR = require("react-dom/server");
const Helmet = require("react-helmet").default;

const getStoreState = stores => {
  return Object.keys(stores).reduce((result, storeName) => {
    result[storeName] = stores[storeName].toJson();
    return result;
  }, {});
};

module.exports = (bundle, template, req, res) => {
  return new Promise((resolve, reject) => {
    const createStoreMap = bundle.createStoreMap;
    const createApp = bundle.default;

    const routerContext = {};
    const stores = createStoreMap();
    // app is React element
    const app = createApp(stores, routerContext, req.url);
    bootstrapper(app)
      .then(() => {
        // 在服务端渲染做重定向
        if (routerContext.url) {
          res.status(302).setHeader("Location", routerContext.url);
          res.end();
          return;
        }
        const helmet = Helmet.renderStatic();
        const state = getStoreState(stores);
        // Render a React element to its initial HTML.
        const content = ReactSSR.renderToString(app);
        // ejs 渲染
        const html = ejs.render(template, {
          appString: content,
          // 序列化 state 为 JSON
          initialState: serialize(state),
          meta: helmet.meta.toString(),
          title: helmet.title.toString(),
          style: helmet.style.toString(),
          link: helmet.link.toString()
        });
        res.send(html);
        resolve();
      })
      .catch(reject);
  });
};
