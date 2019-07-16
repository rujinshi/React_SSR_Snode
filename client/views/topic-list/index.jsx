import React from "react";
import { observer, inject } from "mobx-react";
import Helmet from "react-helmet";
// import { AppState } from "../../store/app-state";
import { Button } from "@material-ui/core";

@inject("appState")
@observer
export default class TopicList extends React.Component {
  constructor() {
    super();
    this.changeName = this.changeName.bind(this);
  }

  bootstrap() {
    console.log("执行bootstrap方法");
    return new Promise(resolve => {
      this.props.appState.count = 3;
      resolve(true);
    });
  }

  changeName(event) {
    const { appState } = this.props;
    appState.changeName(event.target.value);
  }

  render() {
    const { appState } = this.props;
    return (
      <div>
        <Helmet>
          <title>This is topic list</title>
          <meta name="description" content="This is description" />
        </Helmet>
        <input type="text" onChange={this.changeName} />
        <span>{appState.msg}</span>
        <Button variant="contained" color="primary">
          不...不要点我...
        </Button>
      </div>
    );
  }
}
