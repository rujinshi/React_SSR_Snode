import axios from "axios";

// 客户端时 为空字符串
// /api/xxx 127.0.0.1
const baseUrl = process.env.API_BASE || "";
console.log("baseUrl is", baseUrl);

const parseUrl = (url, params) => {
  //params => {mdrender: false, tab: "all"}
  const str = Object.keys(params).reduce((result, key) => {
    result += `${key}=${params[key]}&`;
    return result;
  }, "");
  return `${baseUrl}/api${url}?${str.substr(0, str.length - 1)}`;
};

export const get = (url, params) => {
  return new Promise((resolve, reject) => {
    axios
      .get(parseUrl(url, params))
      .then(resp => {
        const { data } = resp;
        if (data && data.success === true) {
          resolve(data);
        } else {
          reject(data);
        }
      })
      .catch(err => {
        if (err.response) {
          reject(err.response.data);
        } else {
          reject({
            success: false,
            err_msg: err.message
          });
        }
      });
  });
};

export const post = (url, params, reqData) => {
  return new Promise((resolve, reject) => {
    axios
      .post(parseUrl(url, params), reqData)
      .then(resp => {
        const { data } = resp;
        if (data && data.success === true) {
          resolve(data);
        } else {
          reject(data);
        }
      })
      .catch(err => {
        if (err.response) {
          reject(err.response.data);
        } else {
          reject({
            success: false,
            err_msg: err.message
          });
        }
      });
  });
};
