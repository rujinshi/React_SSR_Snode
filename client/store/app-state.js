import { observable, action, toJS } from "mobx";
import { get, post } from "../util/http";

class AppState {
  @observable user;

  constructor({
    user = {
      isLogin: false,
      info: {},
      detail: {
        syncing: false,
        recent_topics: [],
        recent_replies: []
      },
      collections: {
        syncing: false,
        list: []
      }
    }
  } = {}) {
    this.user = user;
  }

  @action notify(config) {
    alert(config.message, this.user.info.loginname);
  }

  //  用户信息
  @action getUserDetail() {
    this.user.detail.syncing = true;
    return new Promise((resolve, reject) => {
      get(`/user/${this.user.info.loginname}`, {})
        .then(resp => {
          if (resp.success) {
            this.user.detail.recent_replies = resp.data.recent_replies;
            this.user.detail.recent_topics = resp.data.recent_topics;
            resolve();
          } else {
            reject(resp.msg);
            this.notify({ message: resp.data.msg });
          }
          this.user.detail.syncing = false;
        })
        .catch(err => {
          console.log(err);
          reject(err.message);
          this.notify({ message: err.message });
          this.user.detail.syncing = false;
        });
    });
  }

  //  收藏话题
  @action getUserCollection() {
    this.user.collections.syncing = false;
    return new Promise((resolve, reject) => {
      get(`/topic_collect/${this.user.info.loginname}`, {})
        .then(resp => {
          console.log(resp);
          if (resp.success) {
            this.user.collections.list = resp.data;
            resolve();
          } else {
            reject(resp.msg);
            this.notify({ message: resp.data.msg });
          }
        })
        .catch(err => {
          console.log(err);
          this.notify({ message: err.message });
          this.user.collections.syncing = false;
          reject(err.message);
        });
    });
  }

  //  登录
  @action login(accessToken) {
    return new Promise((resolve, reject) => {
      post(
        "/user/login",
        {
          needAccessToken: true
        },
        {
          accessToken
        }
      )
        .then(resp => {
          if (resp.success) {
            this.user.info = resp.data;
            this.user.isLogin = true;
            resolve();
            this.notify({ message: "登录成功" });
          } else {
            reject(resp.data.msg);
          }
        })
        .catch(err => {
          if (err.response) {
            reject(err.response.data.msg);
            this.notify({ message: err.response.data.msg });
          } else {
            reject(err.message);
            this.notify({ message: err.message });
          }
        });
    });
  }

  toJson() {
    return {
      user: toJS(this.user)
    };
  }
}

export { AppState as default };
