import fs from "fs";
import bodyparser from "koa-bodyparser";
import historyApiFallback from "koa-history-api-fallback";
import Koa from "koa";
import portfinder from "portfinder";
// import ReactLoadableSSRAddon from "react-loadable-ssr-addon";
// import { createProxyMiddleware } from "http-proxy-middleware";
import koaProxy from "koa2-proxy-middleware";
import path from "path";
import webpack from "webpack";
import webpackDevMiddleware from "./webpack-dev-middleware";
import webpackHotMiddleware from "webpack-hot-middleware";
import webpackHotServerMiddleware from "webpack-hot-server-middleware";
// chalk插件，用来在命令行中输入不同颜色的文字
import chalk from "chalk";
// import connectHistoryApiFallback from "connect-history-api-fallback";
// import { compiler, config } from "@/webpack";

const {
  NODE_ENV, // 环境参数
  WEB_ENV, // 环境参数
  target, // 环境参数
  RENDER //
} = process.env; // 环境参数
const clientWebpackConfig = require("./client");
const serverWebpackConfig = require("./server");

// import { writeFile } from "@/webpack/utils";

// let {
//   NODE_ENV, // 环境参数
//   RENDER, // 环境参数
//   port
// } = process.env; // 环境参数

const isSsr = RENDER === "ssr";
//    是否是生产环境
const isEnvProduction = NODE_ENV === "production";
//   是否是测试开发环境
const isEnvDevelopment = NODE_ENV === "development";

class WebpackHot {
  constructor() {
    this.app = new Koa();
    this.compilerOptions = {};
    this.init();
  }
  async init() {
    // var _this = this;
    // for (let [index, item] of config[0].plugins.entries()) {
    //   if (item instanceof ReactLoadableSSRAddon) {
    //     item.apply = function apply(compiler) {
    //       const PLUGIN_NAME = "ReactLoadableSSRAddon";
    //       // 写入文件
    //       writeFile(this.options.filename, "{}");
    //       // fs.writeFileSync(this.options.filename, "{}");
    //       compiler.hooks.emit.tapAsync(PLUGIN_NAME, this.handleEmit.bind(this));
    //     };
    //     item.writeAssetsFile = function () {
    //       const filePath = this.manifestOutputPath;
    //       const fileDir = path.dirname(filePath);
    //       const json = JSON.stringify(this.manifest, null, 2);
    //       try {
    //         if (!fs.existsSync(fileDir)) {
    //           fs.mkdirSync(fileDir, { recursive: true });
    //         }
    //       } catch (err) {
    //         if (err.code !== "EEXIST") {
    //           throw err;
    //         }
    //       }
    //       _this.compilerOptions.assetsManifest = json;
    //       fs.writeFileSync(filePath, json);
    //     };
    //     config[0].plugins[index] = item;
    //     break;
    //   }
    // }

    // 获取配置
    this.config =
      target === "web"
        ? await clientWebpackConfig()
        : await serverWebpackConfig();

    // console.log("this.config==", this.config);
    // 编译
    this.compiler = webpack(
      this.config
      //   (err, stats) => {
      //   console.log();

      //   // this.isEnvDevelopment &&
      //   //   $BrowserReloadErrorOverlayWepbackPlugin.watch(err, stats)
      //   if (err) {
      //     console.log("编译错误 Errors:" + chalk.red(err.stack || err));
      //     if (err.details) {
      //       console.log("编译错误 Errors:" + chalk.red(err.details));
      //     }
      //     return;
      //   }
      //   if (stats.hasErrors()) {
      //     console.log(
      //       "编译错误 Errors:" +
      //         chalk.red(
      //           stats.toString({
      //             colors: true,
      //             chunks: false // Makes the build much quieter
      //           }) + "\n\n"
      //         )
      //     );
      //   }

      //   // else if (stats.hasWarnings()) {
      //   //   console.log(
      //   //     "Warnings:" +
      //   //       chalk.yellow(
      //   //         stats.toString({
      //   //           colors: true,
      //   //         }) + "\n\n"
      //   //       )
      //   //   );
      //   // }
      //   // else {
      //   //     process.stdout.write(
      //   //         stats.toString({
      //   //             colors: true,
      //   //         }) + '\n\n'
      //   //     );
      //   // }
      //  }
    );
    this.addMiddleware();

    this.listen();
  }

  addWebpackHotMiddleware() {
    this.app.use(async (ctx, next) => {
      const { response, request, req, res } = ctx;
      // console.log("req==", req);
      // console.log("res==", res);
      await webpackHotMiddleware(
        this.compiler.compilers.find((compiler) => compiler.name === "client")
      )(request, response, next);
    });
  }
  addMiddleware() {
    // if (!isSsr) {
    // handle fallback for HTML5 history API
    // 通过指定的索引页面中间件代理请求，用于单页应用程序，利用HTML5 History API。
    // 这个插件是用来解决单页面应用，点击刷新按钮和通过其他search值定位页面的404错误
    this.setConnectHistoryApiFallback();
    // }

    // 开启代理
    this.setProxyMiddleware();
    // dev服务器
    this.addWebpackDevMiddleware();
    // 热更新自动刷新，但是感觉问题
    // this.addWebpackHotMiddleware();
    // if (isSsr) {
    //   this.addWebpackHotServerMiddleware();
    // }
  }
  addWebpackDevMiddleware() {
    const _this = this;
    const { devServer ,watchOptions={}} = this.config;



    // watchOptions: {
    //   //延迟监听时间
    //   aggregateTimeout: 300,
    //   //忽略监听文件夹
    //   ignored: '/node_modules/',
    // },


    this.app.use(
      _this.koaDevware(
        webpackDevMiddleware(_this.compiler, {
          ...devServer,
          // noInfo: true,
          serverSideRender: true, // 是否是服务器渲染
          watchOptions
          // //设置允许跨域
          // headers: () => {
          //   return {
          //     // "Last-Modified": new Date(),
          //     "Access-Control-Allow-Origin": "*",
          //     "Access-Control-Allow-Headers": "content-type",
          //     "Access-Control-Allow-Methods": "DELETE,PUT,POST,GET,OPTIONS"
          //   };
          // }

          // publicPath: "/"
          // writeToDisk: true //是否写入本地磁盘
        }),
        _this.compiler
      )
    );
  }

  // 代理服务器
  setProxyMiddleware() {
    // proxy: { // 配置代理（只在本地开发有效，上线无效）
    //   "/x": { // 这是请求接口中要替换的标识
    //     target: "https://api.bilibili.com", // 被替换的目标地址，即把 /api 替换成这个
    //     pathRewrite: {"^/api" : ""},
    //     secure: false, // 若代理的地址是https协议，需要配置这个属性
    //   },
    //   '/api': {
    //     target: 'http://localhost:3000', // 这是本地用node写的一个服务，用webpack-dev-server起的服务默认端口是8080
    //     pathRewrite: {"/api" : ""}, // 后台在转接的时候url中是没有 /api 的
    //     changeOrigin: true, // 加了这个属性，那后端收到的请求头中的host是目标地址 target
    //   },
    // }

    // proxy: [
    //   {
    //     context: ["/api/v1/common/upload/"],
    //     target: "https://webpack.docschina.org/",
    //     changeOrigin: true,
    //     secure: false,
    //     // pathRewrite: {
    //     //   "^/api/v1/common/upload/": "/",
    //     // },
    //   },
    // ],

    const { devServer: { proxy } = {} } = this.config;
    const type = Object.prototype.toString.call(proxy).toLowerCase();
    let targets = {};
    if (proxy && type === "[object object]") {
      // 下面是代理表的处理方法， 可以使用后台,代理后台地址
      /*
            支持对象
            proxy: { // 配置代理（只在本地开发有效，上线无效）
                "/x": { // 这是请求接口中要替换的标识
                  target: "https://api.bilibili.com", // 被替换的目标地址，即把 /api 替换成这个
                  pathRewrite: {"^/api" : ""},
                  secure: false, // 若代理的地址是https协议，需要配置这个属性
                },
                '/api': {
                  target: 'http://localhost:3000', // 这是本地用node写的一个服务，用webpack-dev-server起的服务默认端口是8080
                  pathRewrite: {"/api" : ""}, // 后台在转接的时候url中是没有 /api 的
                  changeOrigin: true, // 加了这个属性，那后端收到的请求头中的host是目标地址 target
                },
            }
            */
      // Object.keys(proxy).forEach((context) => {
      //   // 下面是代理表的处理方法， 可以使用后台管理
      //   var options = proxy[context];
      //   if (typeof options === "string") {
      //     // 支持 proxy: { '/api':'http://localhost:3000' }
      //     options = { target: options };
      //   }
      //   this.app.use(context, createProxyMiddleware(options));
      // });

      // this.koaProxy
      targets = proxy;
    }

    /*
         支持数组
          支持单个
          proxy: [
            {
              context: "/api/v1/common/upload/",
              target: "https://webpack.docschina.org/",
              changeOrigin: true,
               secure: false,
              // pathRewrite: {
              //   "^/api/v1/common/upload/": "/",
              // },
            },
          ],

           或者
          proxy: [
          {
              context: ["/api/v1/common/upload/","/api/v1/scrm/upload/", ]
              target: "https://webpack.docschina.org/",
              changeOrigin: true,
               secure: false,
              // pathRewrite: {
              //   "^/api/v1/common/upload/": "/",
              // },
            },
          ],
        */

    if (proxy && type === "[object array]") {
      for (let item of proxy) {
        let { context } = item;
        delete item.context;
        if (
          Object.prototype.toString.call(context).toLowerCase() ===
          "[object array]"
        ) {
          for (let contextItem of context) {
            targets[contextItem] = item;
          }
        } else {
          targets[context] = item;
        }
      }
    }
    this.app.use(
      koaProxy({
        targets
      })
    );
    this.app.use(
      bodyparser({
        enableTypes: ["json", "form", "text"]
      })
    );
  }

  setConnectHistoryApiFallback() {
    console.log(" this.app==", this.app);

    this.app.use(historyApiFallback());
  }

  addWebpackHotServerMiddleware() {
    const _this = this;
    this.app.use(
      webpackHotServerMiddleware(_this.compiler, {
        createHandler: webpackHotServerMiddleware.createKoaHandler,
        serverRendererOptions: {
          foo: "Bar",
          options: _this.compilerOptions // 引用传参
        }
      })
    );
  }
  // // 做兼容
  hook(compiler, hookName, pluginName, fn) {
    if (arguments.length === 3) {
      fn = pluginName;
      pluginName = hookName;
    }
    if (compiler.hooks) {
      compiler.hooks[hookName].tap(pluginName, fn);
    } else {
      compiler.plugin(pluginName, fn);
    }
  }
  koaDevware(dev, compiler) {
    var _this = this;
    const waitMiddleware = () =>
      new Promise((resolve, reject) => {
        dev.waitUntilValid(() => {
          resolve(true);
        });

        _this.hook(compiler, "failed", (error) => {
          reject(error);
        });
      });

    return async (ctx, next) => {
      await waitMiddleware();
      await dev(
        ctx.req,
        {
          end(content) {
            ctx.body = content;
          },
          setHeader: ctx.set.bind(ctx),
          locals: ctx.state
        },
        next
      );
    };
  }

  async listen() {
    // let { devServer: { port } = {} } = this.config;

    let { devServer: { port = 8080 } = {} } = this.config;

    // 设置静态服务器
    // 默认端口设置
    port = port || process.env.PORT;

    portfinder.basePort = port;
    this.port = await new Promise((resolve, reject) => {
      //查找端口号
      portfinder.getPort((err, port) => {
        if (err) {
          reject(err);
          return;
        }
        // 新端口
        resolve(port);
      });
    });

    this.config.devServer = this.config.devServer || {};
    this.config.devServer.port = this.port || {};

    const server = this.app.listen(port, function () {
      var port = server.address().port;
      // console.log(
      //   `\n==> 🌎  node服务器启动成功，监听端口：${port}. 请打开浏览器 http://${ADDRESS}:${port}/ \n`
      // );
      console.log(`\n编译代码服务器端口:${port}\n`);
    });
  }
}

export default WebpackHot;
