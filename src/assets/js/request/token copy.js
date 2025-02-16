/*
 * @Author: your name
 * @Date: 2021-09-29 11:46:06
 * @LastEditTime: 2021-09-29 15:02:49
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /error-sytem/src/src/common/js/request/token.js
 */
import Cookies from "js-cookie";

class Token {
  constructor(tokenKey, doNotToken = []) {
    this.tokenKey = tokenKey || "token";
    this.queue = [];
    //配置不需要token的请求
    this.doNotToken = [...doNotToken, "/login"];
  }

  subscribeQueue(resolve) {
    this.queue.push(resolve);
  }
  publishQueue(token) {
    this.queue.forEach((item) => {
      const {resolve} = item;
      resolve(token);
    });
    this.queue = [];
  }
  clearQueue() {
    this.queue.forEach((item) => {
      const {reject} = item;
      reject(null);
    });
    this.queue = [];
  }
  get(config) {
    const tokenString = localStorage.getItem(this.tokenKey);
    let token = '';
    const {parameter: {operationName} = {}, urlSuffix} = config || {};
    if (tokenString) {
      const item = JSON.parse(tokenString);
      const now = new Date();
      if (now.getTime() > item.expiry) {
        localStorage.removeItem(this.tokenKey);
        token = '';
      } else {
        token = item.value;
        // 更新token时间
        this.set(token);
      }
    }

    if (!config && token) {
      return token;
    }

    return new Promise((resolve, reject) => {
      if (token) {
        return resolve(token);
      }
      if (this.doNotToken.includes(operationName)) {
        return resolve("");
      }
      resolve("");
      this.subscribeQueue({resolve, reject});
    });
  }
  // 默认设置1小时登录过期
  set(token, time = 60 * 60 * 1000) {
    const now = new Date();
    // time 是过期时间（单位：毫秒）
    const item = {
      value: token,
      expiry: now.getTime() + time
    };
    localStorage.setItem(this.tokenKey, JSON.stringify(item));
  }
  remote() {
    localStorage.removeItem(this.tokenKey);
    this.clearQueue();
  }
}

export {Token};
export default new Token("Admin-Token");
