/*
 * @Author: your name
 * @Date: 2021-09-23 15:36:22
 * @LastEditTime: 2021-09-23 15:38:17
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: /error-sytem/client/src/pages/Home/pages/Overview/index.js
 */
import React from "react";
import "@/common/css/base.less";
import "./index.less";
import { Form, Input, Button, Checkbox } from "antd";
import { routePaths, historyPush, getHistory, pathComponent } from "@/router";

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

const Index = (props) => {
  const onFinish = (values) => {
    console.log("Success:", values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return <div>Overview</div>;
};

export default Index;
