/*
 * @Date: 2022-04-27 18:44:12
 * @Author: Yao guan shou
 * @LastEditors: Yao guan shou
 * @LastEditTime: 2022-07-04 12:39:42
 * @Description:
 */
/* eslint-disable */
//热启动重新刷新浏览器
require("eventsource-polyfill");
require("@babel/polyfill");
require("../webpack-hot-middleware/client?noInfo=true&reload=true");
 
