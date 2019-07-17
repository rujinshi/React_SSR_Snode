/**
 * @description 列表页的cell 展示组件
 */
import React from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import { withStyles } from "@material-ui/core/styles";
import { topicPrimaryStyle, topicSecondaryStyle } from "./styles";
import cx from "classnames";

import { tabs } from "../../util/variable-define";

const Primary = ({ classes, topic }) => {
  const classNames = cx({
    [classes.tab]: true,
    [classes.top]: topic.top
  });

  return (
    <span className={classes.root}>
      <span className={classNames}>{topic.top ? "置顶" : tabs[topic.tab]}</span>
      <span className={classes.title}>{topic.title}</span>
    </span>
  );
};

const StyledPrimary = withStyles(topicPrimaryStyle)(Primary);
const Secondary = ({ classes, topic }) => (
  <span className={classes.root}>
    <span className={classes.userName}>{topic.author.loginname}</span>
    <span className={classes.count}>
      <span className={classes.accentColor}>{topic.reply_count}</span>
      <span>/</span>
      <span>{topic.visit_count}</span>
    </span>
    <span>
      创建时间：
      {topic.create_at}
    </span>
  </span>
);

const StyledSecondary = withStyles(topicSecondaryStyle)(Secondary);

const TopicListItem = ({ onClick, topic }) => {
  return (
    <ListItem button onClick={onClick}>
      <ListItemAvatar>
        <Avatar
          src={topic.author.avatar_url}
        />
      </ListItemAvatar>
      <ListItemText
        primary={<StyledPrimary topic={topic} />}
        secondary={<StyledSecondary topic={topic} />}
      />
    </ListItem>
  );
};

export default TopicListItem;
