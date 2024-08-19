const fs = require("fs");
const StylelintPlugin = require("stylelint-webpack-plugin");
const ESLintPlugin = require("eslint-webpack-plugin");
const ExtendedDefinePlugin = require("extended-define-webpack-plugin");
const HtmllinterWebpackPlugin = require("htmllinter-webpack-plugin");
const DirectoryNamedWebpackPlugin = require("directory-named-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const WebpackPluginRouter = require("./definePlugin/webpack-plugin-router");

// module.exports = {
//     plugins: [tailwindcss('./tailwind.config.cjs'), autoprefixer],
// };

const path = require("path");
const publicPath = "/";
let htmllinterConfig = {};

if (fs.existsSync(path.join(process.cwd(), "./htmllinter.config.js"))) {
  htmllinterConfig = require(path.join(
    process.cwd(),
    "./htmllinter.config.js"
  ));
}

let {
  NODE_ENV, // 环境参数
  WEB_ENV, // 环境参数
  target, // 环境参数
  htmlWebpackPluginOptions = "",
  APP_ROOT_DIRECTORY,
  DOMAIN_NAME,
  DOMAIN_MIDDLE
} = process.env; // 环境参数

console.log("APP_ROOT_DIRECTORY==", APP_ROOT_DIRECTORY);

module.exports = {
  // name: "client",
  // 入口
  entry: {
    // 公共包抽取
    vendor: ["react"],
    index: [
      "@babel/polyfill",
      //添加编译缓存
      // "webpack/hot/poll?1000",
      //  path.join(process.cwd(), "/client/index.js")
      //入口主文件
      path.join(process.cwd(), "/client/index") // 如果没有配置 context 则需要这样引入  path.join(__dirname, "../../client/index.js")
    ]
  },

  // 出口
  output: {
    // 输出目录
    path: path.join(process.cwd(), "/dist"),
    // filename: '[name].[hash].js',
    // chunkFilename: '[name].[hash].js',
    // Chunk 配置
    filename: "static/js/[name].js",
    chunkFilename: "static/js/[name][contenthash].js",
    // 访问静态资源目录 比如 css img
    publicPath: "/", // dev 服务器需要是绝对，而编译出来需要是相对
    // // 导出库(exported library)的名称
    // library: "server",
    // //   导出库(exported library)的类型
    // libraryTarget: "umd",
    // // 在 UMD 库中使用命名的 AMD 模块
    // umdNamedDefine: true,
    // globalObject: "this",
    // chunk 请求到期之前的毫秒数，默认为 120000
    chunkLoadTimeout: 120000,
    // 「devtool 中模块」的文件名模板 调试webpack的配置问题
    // 你的文件在chrome开发者工具中显示为webpack:///foo.js?a93h, 。如果我们希望文件名显示得更清晰呢，比如说 webpack:///path/to/foo.js
    devtoolModuleFilenameTemplate: (info) => {
      // "webpack://[namespace]/[resource-path]?[loaders]"
      return `webpack:///${info.resourcePath}?${info.loaders}`;
    },
    // 如果多个模块产生相同的名称，使用
    devtoolFallbackModuleFilenameTemplate: (info) => {
      return `webpack:///${info.resourcePath}?${info.loaders}`;
    }
    // 如果一个模块是在 require 时抛出异常，告诉 webpack 从模块实例缓存(require.cache)中删除这个模块。
    // // 并且重启webpack的时候也会删除cache缓存
    // strictModuleExceptionHandling: true,
  },

  resolve: {
    // //决定请求是否应该被缓存的函数。函数传入一个带有 path 和 request 属性的对象。默认：
    // cachePredicate: () => {
    //   return true;
    // },
    plugins: [
      //如果在引用目录中没有index.js文件的时候。
      // 当require("component/foo")路径“component/foo”解析到目录时，
      // Webpack将尝试查找component/foo/foo.js作为条目.
      new DirectoryNamedWebpackPlugin({
        honorIndex: true, // defaults to false
        // 排除
        exclude: /node_modules/,
        //入口文件
        include: [path.join(process.cwd(), "/client")]
      })
    ],
    // //启用，会主动缓存模块，但并不安全。传递 true 将缓存一切
    // unsafeCache: true,
    // 模块查找优先顺序配置
    // 1.配置模块的查找规则,
    // 2.导入 require('sql')，会先在node_modules下查找，然后再到app下查找
    // 相对路径是相对于webpack.config.js文件所在的路劲
    // 详细教程: https://blog.csdn.net/u012987546/article/details/97389078
    modules: [
      path.join(process.cwd(), "/node_modules"),
      path.join(process.cwd(), "/client")
    ],
    // 可以省略引用后缀
    extensions: [
      ".js",
      "jsx",
      ".ts",
      ".tsx",
      ".graphql",
      ".json",
      ".node",
      ".sql"
    ],
    // 1.不需要node polyfilss webpack 去掉了node polyfilss 需要自己手动添加
    //dllPlugin 插件需要的包
    // 路径配置 解析配置
    alias: {
      "@": path.join(process.cwd(), "/client"),
      client: path.join(process.cwd(), "/client")
    }
  },
  module: {
    // loader
    rules: [
      {
        // sideEffects 默认为 true， 告诉 Webpack ，所有文件都有副作用，他们不能被 Tree Shaking。
        // 增强兼容性
        include: path.join(process.cwd(), "/client"),
        sideEffects: true
      }
    ]
  },

  plugins: [
    // html静态页面
    new HtmlWebpackPlugin({
      ...(() => {
        const regex = /(?<=\{)(.+?)(?=\})/g; // {} 花括号，大括号
        htmlWebpackPluginOptions = htmlWebpackPluginOptions.match(regex);
        if (htmlWebpackPluginOptions) {
          htmlWebpackPluginOptions = htmlWebpackPluginOptions[0];
          let htmlWebpackPluginOptionsArr = htmlWebpackPluginOptions.split(",");
          htmlWebpackPluginOptions = {};
          for (let item of htmlWebpackPluginOptionsArr) {
            let [key, value] = item.split(":");
            htmlWebpackPluginOptions[`${key}`] = value;
          }
        } else {
          htmlWebpackPluginOptions = {};
        }
        return htmlWebpackPluginOptions;
      })(),
      // title: 'Custom template using Handlebars',
      // 生成出来的html文件名
      filename: "index.html",
      // 每个html的模版，这里多个页面使用同一个模版
      template: path.join(process.cwd(), "/client/public/index.html"),
      // 自动将引用插入html
      inject: "body",
      hash: true,
      // 每个html引用的js模块，也可以在这里加上vendor等公用模块
      chunks: [
        "vendor",
        "manifest",
        "index"
        // "static/vendor.dll",
        // "static/vendor.manifest",
      ]
    }),

    // 复制
    new CopyPlugin({
      patterns: [
        {
          // from: path.join(process.cwd(), "/client/static"),
          // to: path.join(process.cwd(), "/dist/client/static"),

          from: path
            .join(process.cwd(), "/client/static/**/*")
            .replace(/\\/gi, "/"),
          // to: path.join(process.cwd(), "/dist").replace(/\\/gi, "/")

          to({ context, absoluteFilename }) {
            // console.log('context===',context)
            // console.log('absoluteFilename===',absoluteFilename)
            return "static/[name][ext]";
          }
        }
      ]
    }),

    // 路由文件
    new WebpackPluginRouter({
      publicPath,
      entry: path.join(process.cwd(), "/client"),
      //延迟监听时间
      aggregateTimeout: 300,
      watch: ["routesConfig.js"],
      output: {
        routesComponent: "/client/router/routesComponent.js",
        routePaths: "/client/router/routePaths.js"
      }
    }),
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
    // new StylelintPlugin({
    //   emitError: true, //发现的错误将始终被触发，将禁用设置为false。
    //   emitWarning: true, //如果将disable设置为false，则发现的警告将始终被发出。
    //   failOnError: true, //如果有任何错误，将导致模块构建失败，禁用设置为false。
    //   failOnWarning: false, //如果有任何警告，如果设置为true，将导致模块构建失败。
    //   quiet: false //如果设置为true，将只处理和报告错误，而忽略警告。
    //   // fix: true, //自动修复
    // }),
    // eslint 插件编译检查
    // new ESLintPlugin({
    //   emitError: true, //发现的错误将始终被触发，将禁用设置为false。
    //   emitWarning: true, //如果将disable设置为false，则发现的警告将始终被发出。
    //   failOnError: true, //如果有任何错误，将导致模块构建失败，禁用设置为false。
    //   failOnWarning: false, //如果有任何警告，如果设置为true，将导致模块构建失败。
    //   quiet: false, //如果设置为true，将只处理和报告错误，而忽略警告。
    //   fix: true //自动修复
    // }),

    //DefinePlugin 允许创建一个在编译时可以配置的全局常量。这可能会对开发模式和发布模式的构建允许不同的行为非常有用
    // new ExtendedDefinePlugin({
    //   process: {
    //     env: {
    //       WEB_ENV,
    //       NODE_ENV // 将属性转化为全局变量，让代码中可以正常访问
    //     }
    //   }
    // })
    // 注入全局常量
    new ExtendedDefinePlugin({
      process: {
        env: {
          DOMAIN_NAME,
          DOMAIN_MIDDLE,
          APP_ROOT_DIRECTORY
        }
      },
      APP_CONFIG: {
        api_key: "1234567890ABCDEFG",
        fb_conf: {
          use_social: true,
          api_key: "123456790"
        }
      }
    })

    // tailwindcss('../tailwind.config.cjs'),
    //  autoprefixer

    /*
               如果我要在一个webpack打包覆盖的地方的xxx.js文件中用到react，该怎么做？
              通常来讲，我们会直接`import React from 'react'` 有很多很多js文件需要引入呢？一直引入吗？
              可以一直引入。同样会造成不必要的工作量。
    */
    // new webpack.ProvidePlugin({
    //   React: "react"
    // })
  ]
};
