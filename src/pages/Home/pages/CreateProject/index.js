/*
 * @Author: your name
 * @Date: 2021-08-20 16:52:12
 * @LastEditTime: 2021-08-20 18:15:22
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /error-sytem/client/src/pages/Home/pages/CreateProject/index.js
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
  console.log('props====',props)
  const onFinish = (values) => {
    console.log("Success:", values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return <div>创建项目</div>;
};

export default Index;
