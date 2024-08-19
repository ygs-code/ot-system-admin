const fs = require("fs");
const bodyParser = require("koa-bodyparser");
const historyApiFallback = require("koa-history-api-fallback");
const Koa = require("koa");
const portfinder = require("portfinder");

const path = require("path");
const webpack = require("webpack");
const webpackDevMiddleware = require("webpack-dev-middleware");
const webpackHotMiddleware = require("webpack-hot-middleware");
const webpackHotServerMiddleware = require("webpack-hot-server-middleware");
const getIPAdress = require("./utils/getIPAdress");
const koaHttpProxyServer = require("./koa-http-proxy-server");

// chalk插件，用来在命令行中输入不同颜色的文字
const chalk = require("chalk");

const {
  NODE_ENV, // 环境参数
  WEB_ENV, // 环境参数
  target, // 环境参数
  RENDER //
} = process.env; // 环境参数
const clientWebpackConfig = require("./client");
const serverWebpackConfig = require("./server");

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

const { createProxyMiddleware, fixRequestBody } = koaHttpProxyServer;

class WebpackHot {
  constructor() {
    this.app = new Koa();
    this.compilerOptions = {};
    this.init();
  }
  async init() {
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

    if (isEnvDevelopment) {
      this.addMiddleware();

      this.listen();
    } else {
      this.compiler.run(
        //
        (err, stats) => {
          console.log();

          // this.isEnvDevelopment &&
          //   $BrowserReloadErrorOverlayWepbackPlugin.watch(err, stats)
          if (err) {
            console.log("编译错误 Errors:" + chalk.red(err.stack || err));
            if (err.details) {
              console.log("编译错误 Errors:" + chalk.red(err.details));
            }
            return;
          }
          if (stats.hasErrors()) {
            console.log(
              "编译错误 Errors:" +
                chalk.red(
                  stats.toString({
                    colors: true,
                    chunks: false // Makes the build much quieter
                  }) + "\n\n"
                )
            );
          }

          // else if (stats.hasWarnings()) {
          //   console.log(
          //     "Warnings:" +
          //       chalk.yellow(
          //         stats.toString({
          //           colors: true,
          //         }) + "\n\n"
          //       )
          //   );
          // }
          // else {
          //     process.stdout.write(
          //         stats.toString({
          //             colors: true,
          //         }) + '\n\n'
          //     );
          // }
        }
      );
    }

    // this.addMiddleware();

    // this.listen();
  }

  addWebpackHotMiddleware() {
    this.app.use(async (ctx, next) => {
      const { response, request, req, res } = ctx;
      await webpackHotMiddleware(
        this.compiler.compilers.find((compiler) => compiler.name === "client")
      )(request, response, next);
    });
  }
  addMiddleware() {
    // 开启代理
    this.setProxyMiddleware();

    // if (!isSsr) {
    // handle fallback for HTML5 history API
    // 通过指定的索引页面中间件代理请求，用于单页应用程序，利用HTML5 History API。
    // 这个插件是用来解决单页面应用，点击刷新按钮和通过其他search值定位页面的404错误
    this.setConnectHistoryApiFallback();
    // }

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
    const {
      devServer: {
        open: autoOpenBrowser, // 是否自动开启浏览器
        writeToDisk = false, // 写入硬盘
        devMiddleware: devMiddlewareConfig = {}
      } = {}
    } = this.config;

    const {
      // 一个开发环境的中间件
      writeToDisk: devMiddlewareWriteToDisk = false // 写入硬盘
    } = devMiddlewareConfig;

    // watchOptions: {
    //   //延迟监听时间
    //   aggregateTimeout: 300,
    //   //忽略监听文件夹
    //   ignored: '/node_modules/',
    // },

    // this.app.use(
    //   _this.koaDevware(
    //     webpackDevMiddleware(_this.compiler, {
    //       ...devServer,
    //       // noInfo: true,
    //       serverSideRender: true, // 是否是服务器渲染
    //       watchOptions
    //       // //设置允许跨域
    //       // headers: () => {
    //       //   return {
    //       //     // "Last-Modified": new Date(),
    //       //     "Access-Control-Allow-Origin": "*",
    //       //     "Access-Control-Allow-Headers": "content-type",
    //       //     "Access-Control-Allow-Methods": "DELETE,PUT,POST,GET,OPTIONS"
    //       //   };
    //       // }

    //       // publicPath: "/"
    //       // writeToDisk: true //是否写入本地磁盘
    //     }),
    //      _this.compiler
    //   )
    // );

    console.log("webpackDevMiddleware===", webpackDevMiddleware);

    // this.app.use(
    this.devMiddleware = webpackDevMiddleware.koaWrapper(_this.compiler, {
      // ...devServer,
      // // noInfo: true,
      serverSideRender: true, // 是否是服务器渲染
      // watchOptions
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
      ...devMiddlewareConfig,
      publicPath: this.config.output.publicPath,
      writeToDisk: writeToDisk || devMiddlewareWriteToDisk //是否写入本地磁盘
    });
    // );

    // 下面是加载动画
    // this.devMiddleware.waitUntilValid(() => {
    //   // 启动服务器
    //   console.log("第一次代码编译完成");
    //   //  测试环境不打开浏览器
    //   if (autoOpenBrowser && process.env.NODE_ENV !== "testing") {
    //     const url = "http://localhost:" + this.port;
    //     console.log("客户端地址:", url);
    //     opn(url);
    //   }

    //   // const filename = this.devMiddleware.getFilenameFromUrl("/index.js");
    //   // console.log(`Filename is ${filename}`);
    // });
    this.app.use(this.devMiddleware);
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

    Object.keys(targets).forEach((context) => {
      var options = targets[context];
      const exampleProxy = createProxyMiddleware({
        /**
         * Fix bodyParser
         **/
        context,
        ...options,
        onProxyReq: fixRequestBody
      });
      this.app.use(bodyParser()).use(exampleProxy);
    });
  }

  setConnectHistoryApiFallback() {
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
    this.config.devServer.port = this.port;

    const server = this.app.listen(this.port, function () {
      var port = server.address().port;
      console.log(
        `\n==> 🌎  node服务器启动成功，监听端口：${port}.
         请打开浏览器 http://${getIPAdress()}:${port}/ 
         或者：http://localhost:${port}/  \n`
      );
    });
  }
}

module.exports = WebpackHot;
