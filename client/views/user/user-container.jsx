import React from "react";
import { inject, observer } from "mobx-react";

import Avatar from "@material-ui/core/Avatar";
import { withStyles } from "@material-ui/core/styles";

import UserIcon from "@material-ui/icons/AccountCircle";

import Container from "../layout/container";
import userStyles from "./styles/user-style";

@inject(stores => {
  return {
    user: stores.appState.user
  };
})
@observer
class UserContainer extends React.Component {
  render() {
    const classes = this.props.classes;
    const user = this.props.user.info || {};
    return (
      <Container>
        <div className={classes.avatar}>
          <div className={classes.bg} />
          {user.avatar_url ? (
            <Avatar className={classes.avatarImg} src={user.avatar_url} />
          ) : (
            <Avatar className={classes.avatarImg}>
              <UserIcon />
            </Avatar>
          )}
          <span className={classes.userName}>{user.loginname || "未登录"}</span>
        </div>
        {this.props.children}
      </Container>
    );
  }
}

export default withStyles(userStyles)(UserContainer);
