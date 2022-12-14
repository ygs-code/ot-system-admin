import { Button, Input } from "antd";
import FormPage from "client/component/FormPage";
import setBreadcrumbAndTitle from "client/component/setBreadcrumbAndTitle";
import { mapRedux } from "client/redux";
import { addRouterApi, routePaths } from "client/router";
import React, { useMemo } from "react";

const Index = (props) => {
  const onFinish = (values) => {
    console.log("Success:", values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const submit = async (formRef) => {
    const {
      current: { validateFields }
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
          }}>
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
                message: "Please input your username1"
              }
            ]
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
                message: "Please input your username2"
              }
            ]
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
                message: "Please input your username3"
              }
            ]
          }
        ]
      }
    ];
  }, []);

  return <FormPage {...props} footer={getFooter} fields={fields} />;
};

export default mapRedux()(
  // 权限控制
  setBreadcrumbAndTitle({
    //设置面包屑和标题
    breadcrumb: [
      {
        label: "账号管理",
        path: routePaths.accountManagement
      },
      {
        label: "详情"
        // href: "http://localhost:3000/index",
        // path: "/",
        // component: ""
      }
      // {
      //   label: "菜单3",
      //   // href: "http://localhost:3000/index",
      //   // path: "/",
      //   component: "",
      // },
    ]
    // title: "主页"
  })(addRouterApi(Index))
);
