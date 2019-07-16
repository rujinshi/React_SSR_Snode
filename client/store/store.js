import AppState from "./app-state";
import TopicStore from "./topic-store";

export { AppState, TopicStore };

export default {
  AppState,
  TopicStore
};

// 保证服务端渲染和客户端使用的数据一致而实现的方法
export const createStoreMap = () => {
  return {
    appState: new AppState(),
    topicStore: new TopicStore()
  };
};
