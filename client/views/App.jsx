/**
 * @description 根组件
 */
import React from "react";
import { Link } from "react-router-dom";
import Routers from "../config/router";

class App extends React.Component {
  render() {
    // return [
    //   <div key="banner">
    //     <div>初次见面</div>
    //     <Link to="/">列表页</Link>
    //     <br />
    //     <Link to="/detail">详情页</Link>
    //     <br />
    //   </div>,
    //   <Routers key="routes" />
    // ];
    return [
      <div key="banner">
        <div>初次见面</div>
      </div>
    ];
  }
}

export default App;
