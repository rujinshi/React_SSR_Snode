import { observable, action, computed, extendObservable } from "mobx";

import { get, post } from "../util/http";
import { topicSchema } from "../util/variable-define";

// 服务端返回的model字段可能不全  规定了返回对象的全量属性
const createTopic = topic => {
  return Object.assign({}, topicSchema, topic);
};

class Topic {
  constructor(data) {
    // 用来向已存在的目标对象添加 observable 属性
    extendObservable(this, data);
  }

  @observable syncing = false; //异步操作标志

  @action doReply(content) {
    return new Promise((resolve, reject) => {
      post(
        `/topic/${this.id}/replies`,
        {
          needAccessToken: true
        },
        {
          content
        }
      )
        .then(data => {
          debugger; // eslint-disable-line
          if (data.success) {
            resolve({
              replyId: data.reply_id,
              content
            });
          } else {
            reject();
          }
        })
        .catch(reject);
    });
  }
}

class TopicStore {
  @observable topics; // 文章列表页话题数组

  @observable details; // 所有文章详情数组

  @observable syncing;

  @observable tab;

  constructor({ syncing = false, topics = [], details = [], tab = null } = {}) {
    // eslint-disable-line
    this.syncing = syncing;
    this.topics = topics.map(topic => new Topic(createTopic(topic)));
    this.details = details;
    this.tab = tab;
  }

  // 加到话题数组中去
  addTopic(topic) {
    this.topics.push(new Topic(createTopic(topic)));
  }

  // 获取话题列表
  @action fetchTopics() {
    return new Promise((resolve, reject) => {
      this.syncing = true;
      this.topics = []; //清除缓存
      get("/topics", {
        mdrender: false // 不渲染 markdown 格式文本
      })
        .then(resp => {
          if (resp.success) {
            resp.data.forEach(topic => {
              this.addTopic(topic);
            });
            this.syncing = false; //异步操作结束
            resolve();
          } else {
            reject();
          }
          this.syncing = false;
        })
        .catch(err => {
          reject(err);
          this.syncing = false;
        });
    });
  }
}

export default TopicStore;
