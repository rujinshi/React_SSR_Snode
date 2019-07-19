import React from "react";
import { inject, observer } from "mobx-react";
import { withStyles } from "@material-ui/core/styles";
import formatDate from "dateformat";

import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import List from "@material-ui/core/List";
import ListItemText from "@material-ui/core/ListItemText";
import ListItem from "@material-ui/core/ListItem";

import UserContainer from "./user-container";
import userInfoStyle from "./styles/user-info-style";

const TopicItem = ({ topic, }) => {
  return (
    <ListItem button >
      <Avatar src={topic.author.avatar_url} />
      <ListItemText
        primary={topic.title}
        secondary={`最新回复：${formatDate(
          topic.last_reply_at,
          "yy-mm-dd HH:MM"
        )}`}
      />
    </ListItem>
  );
};

const TopicBlock = ({ classes, blockTitle, topics, emptyNotice }) => {
  return (
    <Grid item xs={12} md={4}>
      <Paper elevation={2}>
        <Typography className={classes.partTitle}>
          <span>{blockTitle}</span>
        </Typography>
        <List>
          {
            topics.length > 0 ? (
              topics.map(topic => <TopicItem topic={topic} key={topic.id} />)
            ) : (
                <Typography align="center">{emptyNotice}</Typography>
              )
          }
        </List>
      </Paper>
    </Grid>
  );
};


const TopicBlockWithStyle = withStyles(userInfoStyle)(TopicBlock);

@inject(stores => {
  return {
    appState: stores.appState,
    user: stores.appState.user
  };
})
@observer
class UserInfo extends React.Component {
  componentWillMount() {
    this.props.appState.getUserDetail();
    this.props.appState.getUserCollection();
  }

  render() {
    const classes = this.props.classes;
    const topics = this.props.user.detail.recent_topics;
    const replies = this.props.user.detail.recent_replies;
    const collections = this.props.user.collections.list;

    return (
      <UserContainer>
        <div className={classes.root}>
          <Grid container spacing={16} align="stretch">
            <TopicBlockWithStyle
              blockTitle="最新发布的话题"
              topics={topics}
              emptyNotice="最近没有发布话题"
            />
            <TopicBlockWithStyle
              blockTitle="新的回复"
              topics={replies}
              emptyNotice="最近没有回复"
            />
            <TopicBlockWithStyle
              blockTitle="收藏的话题"
              topics={collections}
              emptyNotice="没有收藏的话题"
            />
          </Grid>
        </div>
      </UserContainer>
    );
  }
}


export default withStyles(userInfoStyle)(UserInfo);
