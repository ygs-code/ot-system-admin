/*
 * @Author: your name
 * @Date: 2021-09-29 11:46:06
 * @LastEditTime: 2021-09-29 15:02:49
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /error-sytem/client/src/common/js/request/token.js
 */

class Token {
  constructor(doNotToken = []) {
    this.queue = [];
    //配置不需要token的请求
    this.doNotToken = [
      ...doNotToken,
      "/set/user/getVerifyCode",
      "/set/user/login",
    ];
  }

  subscribeQueue(resolve) {
    this.queue.push(resolve);
  }
  publishQueue(token) {
    this.queue.forEach((item) => {
      const { resolve, reject } = item;
      resolve(token);
    });
    this.queue = [];
  }
  clearQueue() {
    this.queue.forEach((item) => {
      const { resolve, reject } = item;
      reject(null);
    });
    this.queue = [];
  }
  get(url) {
    const token = localStorage.getItem("token");
    if (!url) {
      return token;
    }
    return new Promise((resolve, reject) => {
      if (token) {
        return resolve(token);
      }
      if (this.doNotToken.includes(url)) {
        return resolve("");
      }
      this.subscribeQueue({ resolve, reject });
    });
  }
}

export { Token };
export default new Token();
