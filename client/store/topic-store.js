import { observable, action, computed, extendObservable, toJS } from "mobx";

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

  //异步操作标志
  // @observable syncing = false;
}

class TopicStore {
  @observable topics; // 文章列表页话题

  @observable details; // 文章详情

  @observable syncing;

  @observable tab;

  // 缓存数据
  @computed get detailsMap() {
    return this.details.reduce((result, topic) => {
      result[topic.id] = topic;
      return result;
    }, {});
  }

  constructor({ syncing = false, topics = [], details = [], tab = null } = {}) {
    this.syncing = syncing;
    this.topics = topics.map(topic => new Topic(createTopic(topic)));
    this.details = details;
    this.tab = tab;
  }

  // 根据 tab 获取列表
  @action fetchTopics(tab) {
    return new Promise((resolve, reject) => {
      if (tab === this.tab && this.topics.length > 0) {
        resolve();
      } else {
        this.tab = tab;
        this.syncing = true;
        this.topics = [];
        get("/topics", {
          mdrender: false,
          tab
        })
          .then(resp => {
            if (resp.success) {
              this.topics = resp.data.map(topic => {
                return new Topic(createTopic(topic));
              });
              this.syncing = false;
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
      }
    });
  }

  // 根据 topicId 获取详情
  @action fetchTopicDetail(topicID) {
    return new Promise((resolve, reject) => {
      // 获取缓存数据
      if (this.detailsMap[topicID]) {
        console.log("缓存话题数据", this.detailsMap[topicID]);
        resolve(this.detailsMap[topicID]);
      } else {
        get(`/topic/${topicID}`, {
          mdrender: false
        })
          .then(resp => {
            if (resp.success) {
              console.log("resp.data is 话题详情", resp.data);
              this.details.push(new Topic(createTopic(resp.data), true));
              this.syncing = false;
              resolve();
            } else {
              reject();
            }
          })
          .catch(err => {
            reject(err);
          });
      }
    });
  }

  toJson() {
    return {
      topics: toJS(this.topics),
      syncing: toJS(this.syncing),
      details: toJS(this.details),
      tab: toJS(this.tab)
    };
  }
}

export default TopicStore;
