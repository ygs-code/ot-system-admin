import {
  // MenuUnfoldOutlined,
  // MenuFoldOutlined,
  // UserOutlined,
  // VideoCameraOutlined,
  // UploadOutlined,
  // HomeOutlined,
  // PieChartOutlined,
  // DesktopOutlined,
  // ContainerOutlined,
  // MailOutlined,
  // AppstoreOutlined,
  // WarningOutlined,
  SettingOutlined,
  SnippetsOutlined
  // ProjectOutlined
} from "@ant-design/icons";

import {
  Menu
  //  Select
} from "antd";
import React, {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState
} from "react";
export default (routePaths) => [
  {
    title: "系统设置",
    iconComponent: <SettingOutlined />,
    children: [
      {
        title: "用户权限设置",
        children: [
          {
            title: "用户管理",
            url: routePaths.userManagement, // 路由地址
            children: [
              // 子菜单
            ]
          },
          {
            title: "角色管理",
            url: routePaths.roleManagement, // 路由地址
            children: [
              // 子菜单
            ]
          },

          {
            title: "权限管理",
            url: routePaths.permissionManagement, // 路由地址
            children: [
              // 子菜单
            ]
          },
          {
            title: "角色&权限",
            url: routePaths.rolePermission, // 路由地址
            children: [
              // 子菜单
            ]
          },
          {
            title: "用户&角色",
            url: routePaths.userRole, // 路由地址
            children: [
              // 子菜单
            ]
          }
        ]
      }
    ]
  },

  {
    title: "协同文档",
    iconComponent: <SnippetsOutlined />,
    key: "1",
    children: [
      {
        url: routePaths.document, // 路由地址
        title: "文档",
        key: "1-0"
      }
      // {
      //   title: "思维导图",
      //   url: "http:xxxxx", // 路由地址
      //   iconComponent: <MindMap />,
      //   key: "1-1"
      // }
    ]
  }
];
