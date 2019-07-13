import React, { PureComponent } from "react";
import { observer, inject } from "mobx-react";
import PropTypes from "prop-types";
import { AppState } from "../../store/app-state";

@inject("appState")
@observer
export default class TopicList extends PureComponent {
  constructor() {
    super();
    this.changeName = this.changeName.bind(this);
  }

  changeName(event) {
    const { appState } = this.props;
    appState.changeName(event.target.value);
  }

  render() {
    const { appState } = this.props;
    return (
      <div>
        <input type="text" onChange={this.changeName} />
        <span>{appState.msg}</span>
      </div>
    );
  }
}

TopicList.propTypes = {
  appState: PropTypes.instanceOf(AppState)
};
