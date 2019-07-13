/**
 * @description 测试 api
 */
import React, { PureComponent } from "react";
import axios from "axios";

export default class TestApi extends PureComponent {
  // 获取 topics
  getTopics() {
    axios
      .get("/api/topics")
      .then(resp => {
        console.log(resp);
      })
      .catch(err => {
        console.log(err);
      });
  }

  login() {
    axios
      .post("/api/user/login", {
        accessToken: "0cf1d8b4-7a60-4981-a76e-42036705c9af"
      })
      .then(resp => {
        console.log(resp);
      })
      .catch(err => {
        console.log(err);
      });
  }

  markAll() {
    axios
      .post("/api/message/mark_all?needAccessToken=true")
      .then(resp => {
        console.log(resp);
      })
      .catch(err => {
        console.log(err);
      });
  }

  render() {
    return (
      <div>
        <button onClick={this.getTopics}>getTopics</button>
        <button onClick={this.login}>login</button>
        <button onClick={this.markAll}>markAll</button>
      </div>
    );
  }
}
