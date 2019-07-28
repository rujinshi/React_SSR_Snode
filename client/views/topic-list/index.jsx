import React from "react";
import { observer, inject } from "mobx-react";
import Helmet from "react-helmet";
import Container from "../layout/container";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import List from "@material-ui/core/List";
import TopicListItem from "./list-item";
// loading组件
import CircularProgress from "@material-ui/core/CircularProgress";
import queryString from "query-string";
import { tabs } from "../../util/variable-define";

// 获取从 app.js 的 Provider上提供的 store   赋给props
@inject(stores => {
  return {
    appState: stores.appState,
    topicStore: stores.topicStore
  };
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
    const tab = this.getTab();
    // 根据不同的 tab 获取相应数据
    this.props.topicStore.fetchTopics(tab);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.location.search !== this.props.location.search) {
      this.props.topicStore.fetchTopics(this.getTab(nextProps.location.search));
    }
  }

  //  根据 search 获取 tab
  getTab(search) {
    const se = search || this.props.location.search;
    const query = queryString.parse(se);
    return query.tab || "all";
  }

  asyncBootstrap() {
    console.log("执行异步bootstrap方法");
    const tab = this.getTab();
    console.log("tab is ", tab);
    return this.props.topicStore
      .fetchTopics(tab)
      .then(data => {
        console.log("bootstrap方法请求到的数据：", data);
        return true;
      })
      .catch(err => {
        console.log("asyncBootstrap err is ", err);
        return false;
      });
  }

  // 切换 tab 路由跳转
  changeTab(e, value) {
    this.props.history.push({
      pathname: "/list",
      search: `tab=${value}`
    });
  }

  listItemClick(topic) {
    this.props.history.push(`/detail/${topic.id}`);
  }

  render() {
    const { topicStore } = this.props;
    // 得到 topicList
    const topicList = topicStore.topics;
    // 异步请求标志位
    const syncingTopics = topicStore.syncing;
    const tab = this.getTab();

    return (
      <Container>
        <Helmet>
          <title>This is topic list</title>
          <meta name="description" content="This is description" />
        </Helmet>
        <Tabs value={tab} onChange={this.changeTab}>
          {Object.keys(tabs).map(t => {
            return <Tab key={t} label={tabs[t]} value={t} />;
          })}
        </Tabs>
        <List>
          {topicList.map(topic => (
            <TopicListItem
              onClick={() => {
                this.listItemClick(topic);
              }}
              topic={topic}
              key={topic.id}
            />
          ))}
        </List>
        {syncingTopics ? (
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              padding: "10px 0"
            }}
          >
            <CircularProgress color="secondary" />
          </div>
        ) : null}
      </Container>
    );
  }
}
