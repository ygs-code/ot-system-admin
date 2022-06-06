import React, { useCallback, useEffect, useState } from "react";
import "@/common/css/base.less";
import "./index.less";
import { Form, Input, Button, message, Checkbox } from "antd";
import { routePaths, historyPush, getHistory } from "@/router";
import { login, createUser, getVerifyCode } from "@/common/js/request/index";
import VerificationCode from "@/common/component/VerificationCode";
import {
  checkPhone,
  checkUser,
  checkPassword,
  checkVerificationCode,
} from "@/utils";
import Store, { mapRedux } from "@/redux";
const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

const Index = (props) => {
  const [verifyCodeData, setVerifyCodeData] = useState({});
  const onFinish = async (values) => {
    const {
      dispatch: {
        user: { setUserInfo, fetchUser, getUserInfo },
      },
    } = props;
    const data = await login(values);
    console.log("data===", data);
    const {
      data: { token, userInfo },
    } = data;

    localStorage.setItem("token", token);
    setUserInfo(userInfo);
    message.success("登录成功");
    setTimeout(() => {
      historyPush({
        url: "/",
      });
    }, 1500);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  useEffect(() => {}, []);

  return (
    <div className="center log-in">
      <h3>《前端错误监控系统》 </h3>

      <Form
        {...layout}
        name="basic"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          label="用户名"
          name="username"
          validateFirst={true}
          rules={[
            {
              required: true,
              message: "请输入用户名!",
            },
            ({ getFieldValue }) => ({
              validator(rule, value) {
                if (checkUser(value)) {
                  return Promise.resolve();
                }
                return Promise.reject("用户名必须最少为6位，并且以字母开头");
              },
            }),
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="密码"
          name="password"
          validateFirst={true}
          rules={[
            {
              required: true,
              message: "请输入密码!",
            },
            ({ getFieldValue }) => ({
              validator(rule, value) {
                if (!checkPassword(value)) {
                  return Promise.reject(
                    "密码最少为8位，并且最少含有字母和数字组成"
                  );
                }
                return Promise.resolve();
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>
        {/*验证码*/}
        <VerificationCode />
        <Form.Item {...tailLayout}>
          <div className="buttons">
            <Button className="submit" type="primary" htmlType="submit">
              登录
            </Button>
            <Button
              className="submit"
              onClick={() => {
                historyPush({
                  url: routePaths.register,
                });
              }}
            >
              注册
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default mapRedux(["user"])(Index);
