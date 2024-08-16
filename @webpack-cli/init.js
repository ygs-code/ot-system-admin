/*
1. 检查当前目录下 是否有 
webpack.config 目录或者webpack.config.js文件，
如果有则不创建，如果没有则创建
webpack.config 目录
   webpack.base.config.js
   webpack.dev.config.js
   webpack.prod.config.js

*/

const path = require("path");
const fs = require("fs");
const writeFile = require("./utils/writeFile");
const readWriteFiles = require("./utils/readWriteFiles");

class Init {
  constructor({ callback = () => {} }) {
    this.options = {
      callback
    };
  }

  init() {
    const { callback } = this.options;
    console.log("文件检查开始");
    this.checkWebpackConfig();
    console.log("文件检查完毕");

    console.log("复制文件开始");
    this.copyWebpackConfig();
    console.log("复制文件完毕");

    this.app = callback();
  }

  copyWebpackConfig() {
    readWriteFiles({
      isWatch: false,
      // from: path.join(process.cwd(), "/@webpack-cli/.webpack.config/**"),
      // to: path.join(process.cwd(), "/webpack.config"),

      to: path.join(process.cwd(), "/@webpack-cli/.webpack.config"),
      from: path.join(process.cwd(), "/webpack.config/**"),
      transform: (contents, path) => {
        return contents;
      }
    });
  }
  transformPath(path) {
    let reg = /(\\\\)|(\\)/g;
    return path.replace(reg, "/");
  }
  //检查目录和文件是否存在
  checkDirectoryFile(path) {
    path = this.transformPath(path);
    try {
      const stat = fs.statSync(path);
      if (stat.isFile()) {
        return "file";
      } else if (stat.isDirectory()) {
        return "directory";
      } else {
        return "unknown";
      }
    } catch (e) {
      // 路径不存在或无法访问
      return "not found";
    }
  }

  //   1. 检查当前目录下 是否有  webpack.config 目录或者webpack.config.js文件
  checkWebpackConfig() {
    let webpackConfigPath = path.join(process.cwd(), "/webpack.config");

    let webpackConfigType = this.checkDirectoryFile(webpackConfigPath);

    // 如果是目录
    if (webpackConfigType == "directory") {
      let webpackConfigFiles = {
        "webpack.base.config.js": path.join(
          process.cwd(),
          "/@webpack-cli/.webpack.config/webpack.base.config.js"
        ),
        "webpack.dev.config.js": path.join(
          process.cwd(),
          "/@webpack-cli/.webpack.config/webpack.dev.config.js"
        ),
        "webpack.prod.config.js": path.join(
          process.cwd(),
          "/@webpack-cli/.webpack.config/webpack.prod.config.js"
        )
      };

      //   readWriteFile
      for (let key in webpackConfigFiles) {
        // 读取目录
        let filePath = path.join(webpackConfigPath, key);
        if (this.checkDirectoryFile(filePath) != "file") {
          readWriteFiles({
            isWatch: false,
            from: webpackConfigFiles[key],
            to: webpackConfigPath,
            transform: (contents, path) => {
              return contents;
            }
          });
        }
      }
      // 如果是文件
    } else if (webpackConfigType == "file") {
      console.log("webpack.config.js文件已存在");
    } else {
      readWriteFiles({
        isWatch: false,
        from: path.join(process.cwd(), "/@webpack-cli/.webpack.config/**"),
        to: path.join(process.cwd(), "/webpack.config"),
        transform: (contents, path) => {
          return contents;
        }
      });
    }
  }

  apply() {}
}

module.exports = Init;
