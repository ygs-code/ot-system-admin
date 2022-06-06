/*
 * @Author: your name
 * @Date: 2020-12-29 09:32:02
 * @LastEditTime: 2021-09-30 20:33:02
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /error-sytem/client/src/pages/Graphql/index.js
 */
import React, { useState, useEffect, useCallback, useRef } from "react";
import GraphiQL from "graphiql";
// import { createGraphiQLFetcher } from "@graphiql/toolkit";
import token from "@/common/js/request/token";
import "graphiql/graphiql.css";
import "./index.less";
import "./graphiql.css";
import Store, { mapRedux } from "@/redux";

const Index = (props) => {
  const data = {};
  const queryString = data.query;
  const variablesString = data.variables
    ? JSON.stringify(data.variables, null, 2)
    : null;
  const resultString = data.result
    ? JSON.stringify(data.result, null, 2)
    : null;
  const operationName = data.operationName;
  //   const editorTheme = getEditorThemeParams(data.editorTheme);
  const editorTheme = {};
  // Ensures string values are safe to be used within a <script> tag.
  function safeSerialize(data) {
    return data ? JSON.stringify(data).replace(/\//g, "\\/") : "undefined";
  }
  // Collect the URL parameters
  var parameters = {};
  window.location.search
    .substr(1)
    .split("&")
    .forEach(function (entry) {
      var eq = entry.indexOf("=");
      if (eq >= 0) {
        parameters[decodeURIComponent(entry.slice(0, eq))] = decodeURIComponent(
          entry.slice(eq + 1)
        );
      }
    });
  // Produce a Location query string from a parameter object.
  function locationQuery(params) {
    return (
      "?" +
      Object.keys(params)
        .filter(function (key) {
          return Boolean(params[key]);
        })
        .map(function (key) {
          return (
            encodeURIComponent(key) + "=" + encodeURIComponent(params[key])
          );
        })
        .join("&")
    );
  }
  // Derive a fetch URL from the current URL, sans the GraphQL parameters.
  var graphqlParamNames = {
    query: true,
    variables: true,
    operationName: true,
  };
  var otherParams = {};
  for (var k in parameters) {
    if (parameters.hasOwnProperty(k) && graphqlParamNames[k] !== true) {
      otherParams[k] = parameters[k];
    }
  }
  var fetchURL = "http://127.0.0.1:3100/api/data"; // locationQuery(otherParams);
  // Defines a GraphQL fetcher using the fetch API.
  function graphQLFetcher(graphQLParams) {
    return fetch(fetchURL, {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        token:token.get()
      },
      body: JSON.stringify(graphQLParams),
      credentials: "include",
    }).then(function (response) {
      return response.json();
    });
  }

  // When the query and variables string is edited, update the URL bar so
  // that it can be easily shared.
  function onEditQuery(newQuery) {
    parameters.query = newQuery;
    updateURL();
  }

  function onEditVariables(newVariables) {
    parameters.variables = newVariables;
    updateURL();
  }

  function onEditOperationName(newOperationName) {
    parameters.operationName = newOperationName;
    updateURL();
  }

  function updateURL() {
    // history.replaceState(null, null, locationQuery(parameters));
  }

  //   const fetcher = createGraphiQLFetcher({
  //     url: "http://127.0.0.1:3100/api/data",
  //     headers: {
  //       token: token.get(),
  //     },
  //   });
  return React.createElement(GraphiQL, {
    fetcher: graphQLFetcher,
    onEditQuery: onEditQuery,
    onEditVariables: onEditVariables,
    onEditOperationName: onEditOperationName,
    editorTheme: editorTheme.name && safeSerialize(editorTheme.name),
    query: safeSerialize(queryString),
    response: safeSerialize(resultString),
    variables: safeSerialize(variablesString),
    operationName: safeSerialize(operationName),
  });
};

export default mapRedux(["user"])(Index);
