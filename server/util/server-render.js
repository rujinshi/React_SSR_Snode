const serialize = require("serialize-javascript");
const ejs = require("ejs");
const bootstrapper = require("react-async-bootstrapper");

const ReactSSR = require("react-dom/server");
const Helmet = require("react-helmet").default;

const SheetsRegistry = require("react-jss").SheetsRegistry;
const create = require("jss").create;
const preset = require("jss-preset-default").default;
const createMuiTheme = require("@material-ui/core/styles").createMuiTheme;
const createGenerateClassName = require("@material-ui/core/styles/createGenerateClassName")
  .default;
const colors = require("@material-ui/core/colors");

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

    const sheetRegistry = new SheetsRegistry();
    const jss = create(preset());
    jss.options.createGenerateClassName = createGenerateClassName;
    const theme = createMuiTheme({
      palette: {
        primary: colors.lightBlue,
        accent: colors.pink,
        type: "light"
      }
    });

    // app is React element
    const app = createApp(
      stores,
      routerContext,
      sheetRegistry,
      jss,
      theme,
      req.url
    );
    bootstrapper(app)
      .then(() => {
        console.log("服务端的bootstrap开始运行");
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
          link: helmet.link.toString(),
          materialCss: sheetRegistry.toString()
        });
        console.log("服务端渲染后的 content:" + content);
        res.send(html);
        resolve();
      })
      .catch(reject);
  });
};
