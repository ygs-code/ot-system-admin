/*
 * @Author: your name
 * @Date: 2020-12-03 10:26:49
 * @LastEditTime: 2021-08-25 15:39:35
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /error-sytem/src/src/common/components/Breadcrumb/index.js
 */
import {mapRedux} from "src/redux";
import React, {memo, useEffect} from "react";

const Index = (options) => {
  const {title, breadcrumb} = options;
  return (C) => {
    return mapRedux()(
      memo((props) => {
        const {dispatch: {breadcrumb: {setBreadcrumb} = {}} = {}} = props;

        useEffect(() => {
          if (title) {
            document.title = title;
          }
          // if (breadcrumb) {
          //   setBreadcrumb(breadcrumb);
          // }
        }, []);

        return <C {...props} />;
      })
    );
  };
};

export default Index;
