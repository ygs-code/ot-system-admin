/*
 * @Author: your name
 * @Date: 2020-12-29 09:32:02
 * @LastEditTime: 2021-09-30 19:27:44
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /error-sytem/client/src/pages/Graphql/index.js
 */
import React, { useState, useEffect, useCallback, useRef } from "react";
import GraphiQL from "graphiql";
import { createGraphiQLFetcher } from "@graphiql/toolkit";
import token from "@/common/js/request/token";
import "graphiql/graphiql.css";
import "./index.less";

import Store, { mapRedux } from "@/redux";

const Index = (props) => {
  const fetcher = createGraphiQLFetcher({
    url: "http://127.0.0.1:3100/api/data",
    headers:{
        token:token.get()
    }
  });
  return <GraphiQL fetcher={fetcher} editorTheme={"dracula"} />;
};

export default mapRedux(["user"])(Index);
