require("@babel/polyfill");
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const { resolve } = path;
let {
  NODE_ENV, // 环境参数
  WEB_ENV, // 环境参数
  target, // 环境参数
  htmlWebpackPluginOptions = ""
} = process.env; // 环境参数
//    是否是生产环境
const isEnvProduction = NODE_ENV === "production";
//   是否是测试开发环境
const isEnvDevelopment = NODE_ENV === "development";

const cacheLoader = (happypackId) => {
  return isEnvDevelopment
    ? [
        `happypack/loader?id=${happypackId}&cacheDirectory=true`,
        "thread-loader",
        "cache-loader"
      ]
    : ["thread-loader", `happypack/loader?id=${happypackId}`];
};

// 用户自定义webpack
module.exports = {
 /*
 生产环境：源代码隐藏？调试友好？
   源代码隐藏：
     nosources-source-map 源代码和构建后js代码全部隐藏
     hidden-source-map 只隐藏源代码，会提示构建后代码错误的错误位置
      
     调试友好：
       source-map
       cheap-module-source-map

    none 无提示   
 */
    // 推荐用于具有高质量SourceMaps的生产构建。
  devtool: "source-map", //  

  output: {
    publicPath: "./", // dev 服务器需要是绝对，而编译出来需要是相对
    // 如果一个模块是在 require 时抛出异常，告诉 webpack 从模块实例缓存(require.cache)中删除这个模块。
    // 并且重启webpack的时候也会删除cache缓存
    strictModuleExceptionHandling: true
  },
  module: {
    rules: [
      // css
      {
        test: /\.css$/i,
        // 排除文件,因为这些包已经编译过，无需再次编译
        // exclude: /(node_modules|bower_components)/,
        // exclude: /(node_modules|bower_components)^((?!bootstrap).)+$/,
        exclude: /(node_modules|bower_components)/,
        use: [
          // 'thread-loader',
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              sourceMap: true,
              importLoaders: 2,
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
            //       ]
            //       //   "tailwindcss"
            //     ]
            //   }
            // }
          }
        ]
      },
      //   less
      {
        test: /\.less$/i,
        use: [
          // 'thread-loader',
          // compiles Less to CSS
          MiniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: "less-loader",
            options: {
              sourceMap: true
            }
          },
          // {
          //   loader: "postcss-loader",
          //   options: {
          //     postcssOptions: {
          //       plugins: [
          //         [
          //           "autoprefixer",
          //           {
          //             // Options
          //           }
          //         ]
          //         //   'tailwindcss'
          //       ]
          //     }
          //   }
          // }
        ]
      },

      //  scss
      {
        test: /\.s[ac]ss$/i,
        use: [
          // 'thread-loader',
          MiniCssExtractPlugin.loader,
          // Translates CSS into CommonJS
          "css-loader",
          // Compiles Sass to CSS
          // 'sass-loader',
          {
            loader: "sass-loader",
            options: {
              // Prefer `dart-sass`
              implementation: require("sass"),
              sourceMap: true
            }
          },
          // {
          //   loader: "postcss-loader",
          //   // options: {
          //   //   postcssOptions: {
          //   //     plugins: [
          //   //       [
          //   //         "autoprefixer",
          //   //         {
          //   //           // Options
          //   //         }
          //   //       ]
          //   //       //   'tailwindcss'
          //   //     ]
          //   //   }
          //   // }
          // }
        ]
      }
    ]
  },

  plugins: [
    // 复制
    new CopyPlugin({
      patterns: [
        {
          // from: path.join(process.cwd(), "/client/static"),
          // to: path.join(process.cwd(), "/dist/client/static"),

          from: path
            .join(process.cwd(), "/client/static/**/*")
            .replace(/\\/gi, "/"),
          to: path.join(process.cwd(), "/client/dist").replace(/\\/gi, "/")
        }
      ]
    }),
    //清理编译目录
    new CleanWebpackPlugin({
      cleanStaleWebpackAssets: false,
      //配置清理文件 如果不清理则加 ！
      cleanOnceBeforeBuildPatterns: ["*", "!dll*"]
      // cleanOnceBeforeBuildPatterns: [
      //   "index.html",
      //   "**/index*.js",
      //   "**/index*.css",
      // !./image/*
      // ],
    }),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: "static/css/[name].[contenthash:8].css",
      chunkFilename: "static/css/[name].[contenthash:8].chunk.css"
    })
  ]
};
