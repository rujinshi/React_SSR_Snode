/**
 * @description 根组件
 */
import React, { PureComponent, Fragment } from "react";
import { Link } from "react-router-dom";
import Routes from "../config/router";

class App extends PureComponent {
  render() {
    return (
      <Fragment>
        <Link to="/"> 首页</Link>
        <br />
        <Link to="/detail">详情页</Link>
        <Routes />
      </Fragment>
    );
  }
}

export default App;
