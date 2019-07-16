import React from "react";
import { observer, inject } from "mobx-react";
import Helmet from "react-helmet";
import Container from "../layout/container";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import List from "@material-ui/core/List";
import TopicListItem from "./list-item";
// loading组件
import CircularProgress from '@material-ui/core/CircularProgress'

// 获取从 app.js 的 Provider上提供的 store   赋给props
@inject((stores) => {
  return {
    appState: stores.appState,
    topicStore: stores.topicStore,
  }
})
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

  componentDidMount() {
    // 获取 topic
    this.props.topicStore.fetchTopics()
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
    const { topicStore } = this.props;
    const { tabIndex } = this.state;
    // 得到 topicList
    const topicList = topicStore.topics
    // 异步请求标志位
    const syncingTopics = topicStore.syncing
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
        <List>
          {
            topicList.map(topic =>
              <TopicListItem onClick={this.listItemClick} topic={topic} key={topic.id} />)
          }
        </List>
        {
          syncingTopics ? (
            <div>
              <CircularProgress color="secondary" size={100} />
            </div>
          ) : null
        }
      </Container>
    );
  }
}
