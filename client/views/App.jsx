/**
 * @description 根组件
 */
import React from "react";
import Routers from "../config/router";
import AppBar from "./layout/app-bar";

class App extends React.Component {
  render() {
    return [<AppBar key="appbar" />, <Routers key="routes" />];
  }
}

export default App;
