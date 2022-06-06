/*
 * @Author: your name
 * @Date: 2020-11-12 16:14:07
 * @LastEditTime: 2021-08-26 11:08:28
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /error-sytem/client/src/pages/Home/pages/Index/index.js
 */
import React, { createElement, Component, useMemo } from "react";
import "@/common/css/base.less";
import "./index.less";
import { Input, Button, Checkbox } from "antd";
import { routePaths, historyPush, getHistory, pathComponent } from "@/router";
import { CheckDataType } from "@/utils";
import Store, { mapRedux } from "@/redux";
import { CheckPageAuth } from "@/common/component/CheckAuth";
import SetBreadcrumbAndTitle from "@/common/component/SetBreadcrumbAndTitle";
import FormPage from "@/common/component/FormPage";

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

  const submit = async (formRef) => {
    const {
      current: { validateFields },
    } = formRef;

    const values = await validateFields()
      .then((value) => {
        console.log("value===", value);
      })
      .catch((error) => {
        console.log("error=", error);
      });
  };

  // 底部按钮
  const getFooter = (formRef) => {
    return (
      <div className="button-box">
        <Button
          type="primary"
          onClick={() => {
            submit(formRef);
          }}
        >
          确认
        </Button>
        <Button>返回</Button>
      </div>
    );
  };
  // 字段
  const fields = useMemo(() => {
    return [
      {
        type: "section",
        title: "详情基本设置",
        items: [
          {
            label: "Username1",
            name: "username1",
            type: "input",
            // labelCol: { span: 5 },
            // wrapperCol: { span: 10 },
            rules: [
              {
                required: true,
                message: "Please input your username1",
              },
            ],
          },
          {
            label: "Username2",
            name: "username2",
            type: "input",
            component: <div>123</div>,
            // labelCol: { span: 5 },
            // wrapperCol: { span: 10 },
            rules: [
              {
                required: true,
                message: "Please input your username2",
              },
            ],
          },
          {
            label: "Username3",
            name: "username3",
            type: "input",
            render: (props) => {
              return <Input {...props}></Input>;
            },
            rules: [
              {
                required: true,
                message: "Please input your username3",
              },
            ],
          },
        ],
      },
    ];
  }, []);

  return <FormPage {...props} footer={getFooter} fields={fields} />;
};

export default CheckPageAuth([4])(   // 权限控制
  SetBreadcrumbAndTitle({ //设置面包屑和标题
    breadcrumb: [
      {
        label: "详情页面",
        // href: "http://localhost:3000/index",
        // path: "xxxx",
      },
      // {
      //   label: "菜单2",
      //   // href: "http://localhost:3000/index",
      //   path: "/",
      //   component: "",
      // },
      // {
      //   label: "菜单3",
      //   // href: "http://localhost:3000/index",
      //   // path: "/",
      //   component: "",
      // },
    ],
    title: "主页",
  })(Index)
);
