/*
 * @Author: your name
 * @Date: 2020-11-11 11:21:09
 * @LastEditTime: 2022-04-22 20:16:55
 * @LastEditors: Yao guan shou
 * @Description: In User Settings Edit
 * @FilePath: /error-sytem/admin/src/router/pathComponent.js
 */

import React, { lazy } from "react";
import {
  // 不要使用BrowserRouter坑
  // BrowserRouter as Router,
  Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
const LogIn = lazy(() => import("@/pages/LogIn"));
const Register = lazy(() => import("../pages/Register"));
// const Home = lazy(() => import('../pages/Home'));
const Index = lazy(() => import("@/pages/Home/pages/Index"));
const IndexdDetails = lazy(() => import("@/pages/Home/pages/Index/details"));
const Graphql = lazy(() => import("@/pages/Graphql"));
const ScriptException = lazy(() =>
  import("@/pages/Home/pages/ScriptException")
);
const CreateProject = lazy(() => import("@/pages/Home/pages/CreateProject"));
const Overview = lazy(() => import("@/pages/Home/pages/Overview"));
const Home = () => {
  return <Redirect to="/index" />;
};

// const App = () => {
//   return <Redirect to="/app" />;
// };

const pathComponent = [
  {
    name: "graphql",
    path: "/graphql",
    component: Graphql,
  },
  {
    name: "logLn",
    path: "/logLn",
    component: LogIn,
  },
  {
    name: "register",
    path: "/register",
    component: Register,
  },
  // 主页二级路由
  {
    name: "home",
    path: "/",
    component: Home,
    children: [
      {
        name: "index",
        path: "/index/:id?",
        component: Index,
        children: [
          {
            name: "indexdDetails",
            path: "/details/:id?",
            component: IndexdDetails,
          },
        ],
      },
      {
        name: "createProject",
        path: "/createProject/:id?",
        component: CreateProject,
      },
      {
        name: "user",
        path: "/createProject/:id?",
        component: CreateProject,
      },
      {
        name: "app",
        path: "/app/:id",
        component: Overview,
        children: [
          {
            name: "exceptionsAndEvents",
            path: "/exceptionsAndEvents",
            component: Overview,
            // redirect:"/index",
            children: [
              {
                name: "scriptException",
                path: "/scriptException",
                component: ScriptException,
              },
            ],
          },

        ],
      },
    ],
  },
];

// 递归给子路由添加添加父亲地址
const getChildComponentAddParentPath = (pathComponent, parentPath) => {
  return pathComponent.map((item) => {
    const { children = [], path } = item;
    item = {
      ...item,
      children:
        children && children.length
          ? getChildComponentAddParentPath(
              children,
              parentPath && parentPath != "/" ? `${parentPath}${path}` : path
            )
          : [],
      path: parentPath && parentPath != "/" ? `${parentPath}${path}` : path,
    };
    return item;
  });
};
// 递归查找子页面
const getChildComponent = (pathComponent, flatPathComponent = []) => {
  for (let item of pathComponent) {
    const { children = [], name, path, component: Component } = item;
    children &&
      children.length &&
      getChildComponent(children, flatPathComponent);

    flatPathComponent.push(item);
  }
  return flatPathComponent;
};

const getRootComponent = (pathComponent = []) => {
  return pathComponent.filter((item) => {
    return item.name != "home";
  });
};

const routePaths = getRootComponent(pathComponent)
  .concat(
    getChildComponent(
      getChildComponentAddParentPath(
        pathComponent.filter((item) => {
          return item.name == "home";
        })
      )
    )
  )
  .reduce((acc, next) => {
    acc = {
      ...acc,
      [next.name]: next.path,
    };
    return acc;
  }, {});
console.log("routePaths==", routePaths);

export {
  pathComponent,
  routePaths,
  getChildComponent,
  getRootComponent,
  getChildComponentAddParentPath,
};
