import React from "react";
import { Route, Redirect, withRouter } from "react-router-dom";
import { inject, observer } from "mobx-react";
import TopicList from "../views/topic-list";
import Login from "../views/user/login";
import TopicDetail from "../views/topic-detail";
import UserInfo from "../views/user/info";
import TestApi from "../views/test/api-test";

// 路由鉴权
const PrivateRouter = ({ isLogin, component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      isLogin ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: "/login",
            search: `?from=${rest.path}`
          }}
        />
      )
    }
  />
);

const InjectedPrivateRouter = withRouter(
  inject(({ appState }) => {
    return {
      isLogin: appState.user.isLogin
    };
  })(observer(PrivateRouter))
);

export default () => [
  <Route exact path="/" render={() => <Redirect to="/list" />} key="root" />,
  <Route path="/list" component={TopicList} key="list" />,
  <Route path="/detail/:id" component={TopicDetail} key="detail" />,
  <Route path="/test" component={TestApi} key="test" />,
  // <InjectedPrivateRouter path="/login" component={Login} key="login" />
  <Route path="/login" component={Login} key="login" />,
  <InjectedPrivateRouter
    path="/user/info"
    component={UserInfo}
    key="user-info"
  />
];
