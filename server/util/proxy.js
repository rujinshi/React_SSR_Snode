/**
 * @description 代理一般请求接口
 */
const axios = require("axios");
const queryString = require("query-string");
const baseUrl = "https://cnodejs.org/api/v1";

module.exports = (req, res, next) => {
  const path = req.path;
  // 获取session中suer信息
  const { user: { accessToken } = {} } = req.session;
  const { needAccessToken = false } = req.query;

  if (needAccessToken && !accessToken) {
    res.status(401).send({
      success: false,
      msg: "need login"
    });
  }

  // 准备好干净的 query
  const query = Object.assign({}, req.query, {
    // 如果 get 请求需要 accesstoken
    accesstoken: needAccessToken && req.method === "GET" ? accessToken : ""
  });
  if (query.needAccessToken) delete query.needAccessToken;

  axios(`${baseUrl}${path}`, {
    method: req.method,
    params: query,
    data: queryString.stringify(
      Object.assign({}, req.body, {
        // 如果 post 请求中需要 accesstoken
        accesstoken: needAccessToken && req.method === "POST" ? accessToken : ""
      })
    ),
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  })
    .then(resp => {
      if (resp.status === 200) {
        res.send(resp.data);
      } else {
        res.status(resp.status).send(resp.data);
      }
    })
    .catch(err => {
      if (err.response) {
        res.status(500).send(err.response.data);
      } else {
        res.status(500).send({
          success: false,
          msg: "未知错误"
        });
      }
    });
};
