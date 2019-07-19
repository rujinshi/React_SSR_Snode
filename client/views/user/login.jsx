import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { inject, observer } from "mobx-react";

import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

import loginStyles from "./styles/login-style";
import UserContainer from "./user-container";

// 注入数据
@inject(stores => {
  return {
    appState: stores.appState,
    user: stores.appState.user
  };
})
@observer
class UserLogin extends React.Component {
  constructor() {
    super();
    this.state = {
      accesstoken: "",
      helpText: ""
    };

    this.handleInput = this.handleInput.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
  }

  componentWillMount() {
    if (this.props.user.isLogin) {
      this.props.history.replace("/user/info");
    }
  }

  handleInput(event) {
    const accessToken = event.target.value.trim();
    this.setState({
      accessToken: accessToken
    });
  }

  handleLogin() {
    if (!this.state.accessToken) {
      this.setState({
        helpText: "必须填写"
      });
      return;
    }
    this.setState({
      helpText: ""
    });
    this.props.appState
      .login(this.state.accessToken)
      .then(() => {
        this.props.history.replace("/list");
      })
      .catch(msg => {
        this.props.appState.notify({ message: msg });
      });
  }

  render() {
    const classes = this.props.classes;

    return (
      <UserContainer>
        <div className={classes.root}>
          <TextField
            label="请输入Snode AccessToken"
            placeholder="请输入Snode AccessToken"
            required
            helperText={this.state.helpText}
            onChange={this.handleInput}
            className={classes.input}
          />
          <Button
            raised="true"
            color="primary"
            onClick={this.handleLogin}
            className={classes.loginButton}
          >
            登 录
          </Button>
        </div>
      </UserContainer>
    );
  }
}

export default withStyles(loginStyles)(UserLogin);
