/*
 * @Author: your name
 * @Date: 2020-11-11 11:21:09
 * @LastEditTime: 2021-09-30 12:01:20
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: /error-sytem/src/src/common/js/request/baseUrl.js
 */
// const env = process.env.NODE_ENV; // 环境参数

// DOMAIN_NAME='';
// DOMAIN_MIDDLE='/api';

const {
  env: {
    NODE_ENV,
    DOMAIN_NAME,
    DOMAIN_MIDDLE
  } = {}
} = process;

console.log('DOMAIN_NAME==',DOMAIN_NAME);
console.log('DOMAIN_MIDDLE==',DOMAIN_MIDDLE);
 

let baseUrl = "";
// if (NODE_ENV === "development") {
//   baseUrl = "http://127.0.0.1:3003/api/";
// }
// if (NODE_ENV === "production") {
  // baseUrl = `http://${DOMAIN_NAME}${DOMAIN_MIDDLE}`;
// }

baseUrl = `${DOMAIN_NAME}${DOMAIN_MIDDLE}`;

export default baseUrl;
