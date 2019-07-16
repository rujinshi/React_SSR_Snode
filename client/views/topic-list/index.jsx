import React from "react";
import { observer, inject } from "mobx-react";
import Helmet from "react-helmet";
import Button from "@material-ui/core/Button";
import Container from "../layout/container";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import List from "@material-ui/core/List";
import TopicListItem from "./list-item";

@inject("appState")
@observer
export default class TopicList extends React.Component {
  constructor() {
    super();
    this.changeTab = this.changeTab.bind(this);
    this.listItemClick = this.listItemClick.bind(this);
    this.state = {
      tabIndex: 0
    };
  }

  bootstrap() {
    console.log("执行bootstrap方法");
    return new Promise(resolve => {
      this.props.appState.count = 3;
      resolve(true);
    });
  }

  changeTab(e, index) {
    this.setState({
      tabIndex: index
    });
  }

  listItemClick(e) {
    console.log(this.state, e);
  }

  render() {
    const { appState } = this.props;
    const { tabIndex } = this.state;
    const topic = {
      title: "This is title",
      username: "Azen",
      replay_count: 20,
      visit_count: 30,
      create_at: "2018-10-10",
      tab: "share"
    };
    return (
      <Container>
        <Helmet>
          <title>This is topic list</title>
          <meta name="description" content="This is description" />
        </Helmet>
        <Tabs value={tabIndex} onChange={this.changeTab}>
          <Tab label="全部" />
          <Tab label="分享" />
          <Tab label="工作" />
          <Tab label="问答" />
          <Tab label="精品" />
          <Tab label="测试" />
        </Tabs>
        <TopicListItem onClick={this.listItemClick} topic={topic} />
      </Container>
    );
  }
}
