/*
 * @Date: 2022-04-27 20:24:09
 * @Author: Yao guan shou
 * @LastEditors: Yao guan shou
 * @LastEditTime: 2022-07-04 12:46:44
 * @FilePath: /webpack-cli/user-webpack-config/webpack.dev.config.js
 * @Description:
 */
const path = require("path");
const { resolve } = path;
let {
  NODE_ENV, // 环境参数
  WEB_ENV, // 环境参数
  target, // 环境参数
  htmlWebpackPluginOptions = ""
} = process.env; // 环境参数

// 用户自定义webpack
module.exports = {
  /*
http://webpack.docschina.org/configuration/devtool/#root
开发环境：速度快，调试友好
（eval>inline>cheap>…）

速度快排序：
eval-cheap-source-map
eval-source-map


调试友好排序：
   source-map
   cheap-module-source-map
   cheap-source-map
*/
  // 具有高质量SourceMaps的开发构建的推荐选择。
  devtool: "eval-source-map", //

  module: {
    rules: [
      // css
      {
        test: /\.css$/i,
        // 排除文件,因为这些包已经编译过，无需再次编译
        exclude: /(node_modules|bower_components)/,
        use: [
          "style-loader",
          //   'css-loader',
          "thread-loader",
          "cache-loader",
          {
            loader: "css-loader",
            options: {
              sourceMap: true
            }
          },
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [
                //  "autoprefixer",
                  // [
                  //   // "autoprefixer",

                  //   {
                  //     // Options
                  //   }
                  // ],
                  // "tailwindcss"
                ]
              }
            }
          }
        ]
      },
      // less
      {
        test: /\.less$/i,
        use: [
          // compiles Less to CSS
          "style-loader",
          "css-loader",
          // 'less-loader',
          "thread-loader",
          "cache-loader",
          {
            loader: "less-loader",
            options: {
              implementation: require("less"),
              sourceMap: true
            }
          },
          {
            loader: "postcss-loader",
            // options: {
            //   postcssOptions: {
            //     plugins: [
            //       [
            //         "autoprefixer",

            //         {
            //           // Options
            //         }
            //       ],
            //       "tailwindcss"
            //     ]
            //   }
            // }
          }
        ]
      },

      //  scss
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          "style-loader",
          // Translates CSS into CommonJS
          "css-loader",
          // Compiles Sass to CSS
          // 'sass-loader',
          "thread-loader",
          "cache-loader",
          {
            loader: "sass-loader",
            options: {
              // Prefer `dart-sass`
              implementation: require("sass"),
              sourceMap: true
            }
          },
          {
            loader: "postcss-loader",
            // options: {
            //   postcssOptions: {
            //     plugins: [
            //       [
            //         "autoprefixer",
            //         {
            //           // Options
            //         }
            //       ],
            //       "tailwindcss"
            //     ]
            //   }
            // }
          }
        ]
      }
    ]
  },
  watchOptions: {
    //延迟监听时间
    aggregateTimeout: 300,
    //忽略监听文件夹
    // ignored: [''],

    // 每一秒询问系统指定文件是否有发生改变的次数，这里是1000次
    // poll: 1000,

    poll: false,

    //忽略监听文件夹
    ignored: ["**/node_modules", "/node_modules/"]
  },
  devServer: {
    // disableHostCheck: true,
    overlay: {
      warnings: true,
      errors: true,
      inline: true
    },
    // watchFiles: [
    //   path.join(process.cwd(), "/client/**/*"),
    //   path.join(process.cwd(), "/client/*"),
    //   path.join(process.cwd(), "/public/**/*"),
    //   path.join(process.cwd(), "/public/*")
    // ],
    liveReload: true, // 编译之后是否自动刷新浏览器
    static: {
      directory: path.join(process.cwd(), "/dist"),

      watch: true
    },
    writeToDisk: true,
    index: path.resolve(process.cwd(), "/dist/index.html"), // dist/index 主页面
    contentBase: path.join(process.cwd(), "/dist"), //访问主页的界面 目录
    // port: 8089, // 开启服务器的端口
    open: true, // 是否开启在浏览器中打开
    // public: 'http://localhost:8089',//添加配置
    // host: getIPAdress(), //获取本机地址

    // // quiet:false,  //不要把任何东西输出到控制台。
    // // contentBase: "./public",//本地服务器所加载的页面所在的目录就是index.html 和moduel 不在同一个页面
    // // noInfo:true, //压制无聊信息。 //控制台不输出无聊信息
    // open:true, //启动的时候是否自动打开浏览器
    // port: 8089,  //端口
    // compress:true,//http 使用gzip压缩
    // hot: true,  // --inline还增加了WebPACK /热/开发服务器入口
    // inline: true,//实时刷新 可以监控js变化
    // historyApiFallback: true,//不跳转启用对历史API回退的支持。

    proxy: {
      // "/api": {
      //   target: "http://127.0.0.1:3003",
      //   changeOrigin: true
      //   // ws: true,
      //   // pathRewrite: {
      //   //   "^/api": "",
      //   // }
      // },
      "/api": {
        target: "http://127.0.0.1:3003/api",
        changeOrigin: true,
        secure: false, // 忽略无效的 SSL 证书
        pathRewrite: {
          "^/api": "/"
        }
      }
    }

    // proxy: [
    //   {
    //     context: ["/api/"],
    //     target: "http://127.0.0.1:3003",
    //     changeOrigin: true,
    //     secure: false,
    //     // pathRewrite: {
    //     //   "^/api/": "/",
    //     // },
    //   }
    // ]

    // proxy: [
    //   {
    //     context: ["/api/v1/common/upload/"],
    //     target: "http://192.168.148.191:9091/",
    //     changeOrigin: true,
    //     secure: false,
    //     pathRewrite: {
    //       "^/api/v1/common/upload/": "/",
    //     },
    //   },

    //   // {
    //   //   context: ['/api/v1/scrm-marketing/full/draw/shop'],
    //   //   target: 'http://192.168.198.58:8120',
    //   //   changeOrigin: true,
    //   //   secure: false,
    //   //   // pathRewrite: {
    //   //   //   '^/api/v1/scrm-member/': '/'
    //   //   // },
    //   // },

    //   {
    //     context: ["/api/"],
    //     target: "https://sit-hlj.rainbowcn.com/",
    //     changeOrigin: true,
    //     secure: false,
    //   },
    //   // {
    //   //   context: ['/api/productActivities/getShoppe/'],
    //   //   target: 'http://192.168.213.183:9731/',
    //   //   changeOrigin: true,
    //   //   secure: false,
    //   //   pathRewrite: { '/api/productActivities/getShoppe': '/productActivities/getShoppe' },
    //   // },
    // ],
  },
  plugins: []
};
