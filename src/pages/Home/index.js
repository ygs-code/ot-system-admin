import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { connect } from "react-redux";
import "./index.less";
import { Router, Route, Switch, Redirect } from "react-router-dom";
import React, {
  Suspense,
  lazy,
  useState,
  useCallback,
  Children,
  useEffect,
  memo,
} from "react";
import {
  routePaths,
  historyPush,
  getHistory,
  history,
  pathComponent,
} from "@/router";
import {
  Layout,
  //  Menu,
  Select,
} from "antd";
import Menu from "@/common/component/Menu";
import Header from "@/common/component/Header";
import reducersStore from "@/redux/models/modelsStore";
import Store, { mapRedux } from "@/redux";
import { login, createUser, hello, getUser } from "@/common/js/request/index";
import token from "@/common/js/request/token";
const { Sider, Content } = Layout;
// 权限跳转登录页面可以在这控制
const Index = memo((props) => {
  const {
    state: {
      user: { userInfo: { name, phone, account } = {}, breadcrumb = [] } = {},
    } = {},
    children,
    history: { push },
  } = props;
  console.log("props=", props);

  useEffect(() => {
    // 登录拦截
    if (!token.get()) {
      token.clearQueue();
      push("/logLn");
    }
    // hello()

    return () => {};
  }, [token.get()]);

  const [collapsed, setCollapsed] = useState(false);
  useEffect(() => {
    const {
      dispatch: {
        user: { setUserInfo, login, fetchUser, getUserInfo },
      },
    } = props;
    getUserInfo({
      // id:8
    });
    return () => {};
  }, []);
  const toggle = useCallback(() => {
    setCollapsed(!collapsed);
  }, [collapsed]);
  return (
    <Layout className="root-layout">
      {/*左侧菜单*/}
      <Sider
        width="250"
        className="sider"
        trigger={null}
        collapsible
        collapsed={collapsed}
      >
        {/*菜单*/}
        <Menu collapsed={collapsed} {...props} />
      </Sider>

      <Layout className="site-layout">
        {/*顶部*/}
        <Header
          // avatar="头像地址"
          nickname={name}
          areaCode={name}
          mobile={phone}
          collapsed={collapsed}
          onClick={(type) => {
            console.log("type=", type);
          }}
          onChangeCollapsed={() => {
            toggle();
          }}
          breadcrumb={breadcrumb}
        ></Header>

        {/*中间子页面*/}
        <div className="children-page">
          {Children.map(children, (child, index) => {
            return <> {child}</>;
          })}
        </div>
      </Layout>
    </Layout>
  );
});

export default mapRedux(["user"])(Index);
