/*
 * @Date: 2022-04-22 15:09:15
 * @Author: Yao guan shou
 * @LastEditors: Yao guan shou
 * @LastEditTime: 2022-05-20 10:10:36
 * @FilePath: /error-sytem/admin/src/App.js
 * @Description: 
 */
import React, { Component } from "react";
import { Provider } from "react-redux";
import Router from "./router/index";
import store from "./redux/store";
// import logo from './logo.svg';
import "./App.css";
import zhCN from "antd/es/locale/zh_CN";
import moment from "moment";
import "moment/locale/zh-cn";
import "antd/dist/antd.css";
import "./index.css";

moment.locale("zh-cn");
//  sdf
const App = () => {
  return (
    <Provider store={store}>
      <Router></Router>
    </Provider>
  );
};

export default App;
