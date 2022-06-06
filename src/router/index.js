/*
 * @Author: your name
 * @Date: 2020-11-11 11:21:09
 * @LastEditTime: 2021-09-23 16:41:40
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /error-sytem/client/src/router/index.js
 */
import React, {
  Suspense,
  lazy,
  useState,
  useCallback,
  useEffect,
  Component,
  useMemo,
  memo,
  createElement,
  cloneElement,
} from "react";
import {
  // 不要使用BrowserRouter坑
  // BrowserRouter as Router,
  Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import {
  pathComponent,
  routePaths,
  getChildComponent,
  getRootComponent,
  getChildComponentAddParentPath,
} from "./pathComponent";
import { navigateTo, redirectTo, openWindow, historyPush } from "./historyPush";
import { getHistory, history, listen } from "./history";
const Home = lazy(() => import("../pages/Home"));

const Routers = (props) => {
  const [rootComponent, setRootComponent] = useState([]);
  const [childComponent, setChildComponent] = useState([]);

  useEffect(() => {
    // 监听路由变化
    // listen((location, action)=>{
    //   console.log('location=====',location)
    //   console.log('action=====',action)
    // })

    setRootComponent(getRootComponent(pathComponent));

    setChildComponent(
      getChildComponent(
        getChildComponentAddParentPath(
          pathComponent.filter((item) => {
            return item.name == "home";
          })
        )
      )
      // getChildComponent(
      //   pathComponent.filter((item) => {
      //     return item.name == "home";
      //   })
      // )
    );
  }, []);
  return (
    <Router
      // basename=""
      //  forceRefresh={false}
      history={history}
      // getUserConfirmation={() => {
      //   console.log("getUserConfirmation=");
      // }}
    >
      <Suspense fallback={<div>Loading...</div>}>
        <Switch>
          {rootComponent.map((item, index) => {
            const {
              component: ChildrenComponent,
              name,
              path,
              to,
              redirect,
            } = item;
            return (
              <Route
                key={name}
                exact
                name={name}
                path={path}
                render={(props) => {
                  return (
                    // <Home {...props}>
                    redirect ? (
                      <Redirect key={name} to={redirect} />
                    ) : (
                      <ChildrenComponent {...props} />
                    )
                    // </Home>
                  );
                }}
                // component={item.component}
              />
            );
          })}
          {childComponent.map((item, index) => {
            const {
              component: ChildrenComponent,
              name,
              path,
              to,
              redirect,
            } = item;
            return (
              <Route
                key={name}
                exact
                name={name}
                path={path}
                to={to}
                render={(props) => {
                  return redirect ? (
                    <Redirect key={name} to={redirect} />
                  ) : (
                    <Home {...props}>
                      <ChildrenComponent {...props} />
                    </Home>
                  );
                }}
                // component={item.component}
              />
            );
          })}
        </Switch>
      </Suspense>
    </Router>
  );
};

export default Routers;
export {
  navigateTo,
  redirectTo,
  openWindow,
  historyPush,
  getHistory,
  history,
  routePaths,
  pathComponent,
  listen,
};
