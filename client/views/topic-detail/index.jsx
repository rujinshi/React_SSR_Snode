import React from "react";
import { inject, observer } from "mobx-react";
import { withStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Helmet from "react-helmet";
import marked from "marked";
import dateformat from "dateformat";

import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";

import Reply from "./reply";
import { topicDetailStyle } from "./styles";
import Container from "../layout/container";

@inject(stores => {
  return {
    appState: stores.appState,
    topicStore: stores.topicStore
  };
})
@observer
class TopicDetail extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      newReply: ""
    };

    this.goToLogin = this.goToLogin.bind(this);
    this.handleContent = this.handleContent.bind(this);
  }

  componentDidMount() {
    this.props.topicStore.fetchTopicDetail(this.getTopicID()).catch(err => {
      console.log("detail error is:", err);
    });
  }

  handleContent(e) {
    this.setState({
      newReply: e.target.value
    });
  }

  goToLogin() {
    this.props.history.push("/login");
  }

  // 根据路由获取id
  getTopicID() {
    return this.props.match.params.id;
  }

  // 根据  getTopicID 获取详细信息
  getTopicDetail() {
    return this.props.topicStore.detailsMap[this.getTopicID()];
  }

  render() {
    const classes = this.props.classes;
    const topic = this.getTopicDetail();

    // loading圈
    if (!topic) {
      return (
        <Container>
          <section className={classes.loadingContainer}>
            <CircularProgress color="secondary" />
          </section>
        </Container>
      );
    }

    return (
      <div>
        <Container>
          <Helmet>
            <title>{topic.title}</title>
          </Helmet>

          <header className={classes.header}>
            <h3>{topic.title}</h3>
          </header>

          <section className={classes.body}>
            <p dangerouslySetInnerHTML={{ __html: marked(topic.content) }} />
          </section>
        </Container>

        <Paper elevation={4} className={classes.replies}>
          <div className={classes.replyHeader}>
            <span>{`${topic.reply_count} 回复`}</span>
            <span>{`最新回复 ${dateformat(
              topic.last_reply_at,
              "yy年mm月dd日"
            )}`}</span>
          </div>
          {!this.props.appState.user.isLogin ? (
            <div className={classes.notLoginButton}>
              <Button raised="true" color="primary" onClick={this.goToLogin}>
                登录进行回复
              </Button>
            </div>
          ) : (
            <div className={classes.replyEditor} />
          )}

          <section>
            {topic.replies.map(reply => {
              return <Reply reply={reply} key={reply.id} />;
            })}
          </section>
        </Paper>
      </div>
    );
  }
}

export default withStyles(topicDetailStyle)(TopicDetail);
