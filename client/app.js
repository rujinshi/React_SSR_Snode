/**
 * @description 客户端打包入口
 */
import { AppContainer } from "react-hot-loader";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "mobx-react";
import { BrowserRouter } from "react-router-dom";
import App from "./views/App";
import { AppState, TopicStore } from "./store/store";
// 导入主题和颜色
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { lightBlue, pink } from "@material-ui/core/colors";

// 获取服务端模板传来的 __INITIAL__STATE__
const initialState = window.__INITIAL__STATE__ || {};

const theme = createMuiTheme({
  palette: {
    primary: lightBlue,
    accent: pink,
    type: "light"
  },
  typography: {
    useNextVariants: true
  }
});

const createApp = TheApp => {
  class Main extends React.Component {
    componentDidMount() {
      const jssStyles = document.getElementById("jss-server-side");
      if (jssStyles && jssStyles.parentNode) {
        jssStyles.parentNode.removeChild(jssStyles);
      }
    }

    render() {
      return <TheApp />;
    }
  }

  return Main;
};

const appState = new AppState(initialState.appState);
const topicStore = new TopicStore(initialState.topicStore);
const root = document.getElementById("root");

const render = Component => {
  const ComponentR = createApp(Component);
  ReactDOM.render(
    <AppContainer>
      <Provider appState={appState} topicStore={topicStore}>
        <BrowserRouter>
          <MuiThemeProvider theme={theme}>
            <ComponentR />
          </MuiThemeProvider>
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
