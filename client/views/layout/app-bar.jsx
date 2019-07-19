import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { withRouter } from "react-router-dom";

import AppBar from "@material-ui/core/AppBar";
import ToolBar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import HomeIcon from "@material-ui/icons/Home";
import Typography from "@material-ui/core/Typography";

import { inject, observer } from "mobx-react";

const styles = {
  root: {
    width: "100%"
  },
  flex: {
    flex: 1
  }
};
@inject(stores => {
  return {
    user: stores.appState.user
  };
})
@observer
class MainAppBar extends React.Component {
  constructor() {
    super();
    this.onHomeIconClick = this.onHomeIconClick.bind(this);
    this.loginButtonClick = this.loginButtonClick.bind(this);
  }
  onHomeIconClick() {
    this.props.history.push(`/list`);
  }

  loginButtonClick() {
    const path = this.props.user.isLogin ? "/user/info" : "/login";
    this.props.history.push(path);
  }

  render() {
    const {
      classes,
      user: { isLogin, info: { loginname } = {} } = {}
    } = this.props;
    const buttonText = isLogin ? loginname || "" : "登录";
    return (
      <div className={classes.root}>
        <AppBar position="fixed">
          <ToolBar>
            <IconButton color="inherit" onClick={this.onHomeIconClick}>
              <HomeIcon />
            </IconButton>
            <Typography type="title" color="inherit" className={classes.flex}>
              SNode
            </Typography>
            <Button color="inherit" onClick={this.loginButtonClick}>
              {buttonText}
            </Button>
          </ToolBar>
        </AppBar>
      </div>
    );
  }
}

export default withStyles(styles)(withRouter(MainAppBar));
