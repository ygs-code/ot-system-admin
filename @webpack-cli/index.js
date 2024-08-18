/*
 * @Date: 2022-04-28 10:57:42
 * @Author: Yao guan shou
 * @LastEditors: Yao guan shou
 * @LastEditTime: 2022-04-29 18:31:50
 * @FilePath: /webpack-cli/@webpack-cli/index.js
 * @Description:
 */
require("@babel/polyfill");
const Init = require("./init.js");
// const Server = require("./compiler-server-koa");
/*
 1. 先读文件拷贝到这个目录中，然后在执行

*/

module.exports = new Init({
  callback: () => {
    console.log("开始编译");

    setTimeout(() => {
      const Server = require("./compiler-server-koa");
      return new Server();
    }, 100);
  }
}).init();
