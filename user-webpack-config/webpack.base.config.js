const webpack = require("webpack");
const fs = require("fs");
const StylelintPlugin = require("stylelint-webpack-plugin");
const ESLintPlugin = require("eslint-webpack-plugin");
const ExtendedDefinePlugin = require("extended-define-webpack-plugin");
const HtmllinterWebpackPlugin = require("htmllinter-webpack-plugin");
const MyExampleWebpackPlugin = require("./definePlugin/MyExampleWebpackPlugin");
const os = require("os");
const HappyPack = require("happypack");
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length - 1 });
const WebpackPluginRouter = require("./definePlugin/webpack-plugin-router");
const path = require("path");
const publicPath = "/";
let htmllinterConfig = {};

if (fs.existsSync(path.join(process.cwd(), "./htmllinter.config.js"))) {
  htmllinterConfig = require(path.join(
    process.cwd(),
    "./htmllinter.config.js"
  ));
}

module.exports = {
  resolve: {
    // 路径配置
    alias: {
        // '@': path.join(process.cwd(), '/client'),
    }
  },
  module: {
    // loader
    rules: []
  },

  plugins: [
    // 路由
    // new WebpackPluginRouter({
    //   publicPath,
    //   entry: path.join(process.cwd(), "/client"),
    //   //延迟监听时间
    //   aggregateTimeout: 300,
    //   watch: ["routesConfig.js"],
    //   output: {
    //     routesComponent: "/client/router/routesComponent.js",
    //     routePaths: "/client/router/routePaths.js"
    //   }
    // }),
    // html 编译检查
    new HtmllinterWebpackPlugin({
      config: htmllinterConfig
      // config: {
      //     extend: require('@htmllinter/basic-config'),
      //     rules: {
      //         'no-empty-tag': 'on',
      //         'no-duplicate-id': 'on',
      //         'no-duplicate-tag': 'on',
      //         'no-bool-true-explicit-define': 'on',
      //         'doctype-top': [
      //             'on',
      //             {
      //                 startingLineNumber: 1,
      //             },
      //         ],
      //         'long-line-content': 'on',
      //         'no-missing-alt': 'on',
      //         'newline-multiline-comments': 'on',
      //         'trailing-singleline-comments': 'on',
      //         'newline-eof': 'on',
      //     },
      // },
    }),
    // // stylelint 插件 编译检查
    new StylelintPlugin({
      emitError: true, //发现的错误将始终被触发，将禁用设置为false。
      emitWarning: true, //如果将disable设置为false，则发现的警告将始终被发出。
      failOnError: true, //如果有任何错误，将导致模块构建失败，禁用设置为false。
      failOnWarning: false, //如果有任何警告，如果设置为true，将导致模块构建失败。
      quiet: false //如果设置为true，将只处理和报告错误，而忽略警告。
      // fix: true, //自动修复
    }),
    // eslint 插件编译检查
    new ESLintPlugin({
      emitError: true, //发现的错误将始终被触发，将禁用设置为false。
      emitWarning: true, //如果将disable设置为false，则发现的警告将始终被发出。
      failOnError: true, //如果有任何错误，将导致模块构建失败，禁用设置为false。
      failOnWarning: false, //如果有任何警告，如果设置为true，将导致模块构建失败。
      quiet: false, //如果设置为true，将只处理和报告错误，而忽略警告。
      fix: true //自动修复
    }),
    // 注入全局常量
    new ExtendedDefinePlugin({
      APP_CONFIG: {
        api_key: "1234567890ABCDEFG",
        fb_conf: {
          use_social: true,
          api_key: "123456790"
        }
      }
    }),
    /*
      如果我要在一个webpack打包覆盖的地方的xxx.js文件中用到react，该怎么做？
      通常来讲，我们会直接`import React from 'react'` 有很多很多js文件需要引入呢？一直引入吗？
      可以一直引入。同样会造成不必要的工作量。
      */
    new webpack.ProvidePlugin({
      React: "react"
    })
  ]
};
