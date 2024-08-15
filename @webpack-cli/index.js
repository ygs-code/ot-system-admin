/*
 * @Date: 2022-04-28 10:57:42
 * @Author: Yao guan shou
 * @LastEditors: Yao guan shou
 * @LastEditTime: 2022-04-29 18:31:50
 * @FilePath: /webpack-cli/@webpack-cli/index.js
 * @Description:
 */
require("@babel/polyfill");
const Server = require("./compiler-server-koa").default;
/*
 1. 先读文件拷贝到这个目录中，然后在执行

*/

module.exports = new Server();
