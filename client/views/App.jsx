/**
 * @description 根组件
 */
import React, { PureComponent } from "react";
import { Link } from "react-router-dom";
import Routes from "../config/router";

class App extends PureComponent {
  render() {
    return (
      <div key="banner">
        <Link to="/"> 首页</Link>
        <br />
        <Link to="/detail">详情页</Link>
        <Routes key="routes" />
      </div>
    );
  }
}

export default App;
