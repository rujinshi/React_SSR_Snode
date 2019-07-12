import React from "react";
import { Route, Redirect } from "react-router-dom";
import TopicList from "../views/topic-list";
import TopicDetail from "../views/topic-detail";

export default () => [
  <Route exact path="/" render={() => <Redirect to="/list" />} key="1" />,
  <Route path="/list" component={TopicList} key="2" />,
  <Route path="/detail" component={TopicDetail} key="3" />
];
