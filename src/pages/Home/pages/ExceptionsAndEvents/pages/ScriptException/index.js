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

  return <div>脚本异常</div>;
};

export default Index;
