"use strict";
var copyFile = require("./copyFile");
var readFile = require("./readFile");
var writeFile = require("./writeFile");
var watchFile = require("./watchFile");
var readWriteFiles = require("./readWriteFiles");
var stringToObject = require("./stringToObject");
var alias = require("./alias");
const interfaces = require("os").networkInterfaces(); //服务器本机地址

const os = require("os");
const dns = require("dns");

// 获取服务器的内网IP地址
function getServerInternalIP() {
  const networkInterfaces = os.networkInterfaces();
  for (const iface of Object.values(networkInterfaces)) {
    for (const config of iface) {
      if (!config.internal && config.family === "IPv4") {
        return config.address;
      }
    }
  }
  return "127.0.0.1"; // 如果没有找到，返回本地回环地址
}

// 获取服务器的外网IP地址（需要网络访问权限）
function getServerExternalIP(callback) {
  dns.lookup(os.hostname(), (err, ip, type) => {
    if (err) {
      console.error(err);
      callback(err);
    } else {
      callback(null, ip);
    }
  });
}

// 获取服务器的域名
function getServerDomain() {
  return os.hostname();
}

// 使用示例
const internalIP = getServerInternalIP();
const externalIP = getServerExternalIP((err, ip) => {
  if (!err) {
    console.log("External IP:", ip);
  }
});
const domain = getServerDomain();

const getIPAdress = () => {
  console.log("Internal IP:", internalIP);
  console.log("Domain:", domain);

  let IPAdress = "";
  for (var devName in interfaces) {
    var iface = interfaces[devName];
    for (var i = 0; i < iface.length; i++) {
      var alias = iface[i];
      if (
        alias.family === "IPv4" &&
        alias.address !== "127.0.0.1" &&
        !alias.internal
      ) {
        IPAdress = alias.address;
      }
    }
  }

  // let interfaces = require("os").networkInterfaces();
  // for (let devName in interfaces) {
  //   let iface = interfaces[devName];
  //   for (let i = 0; i < iface.length; i++) {
  //     let alias = iface[i];

  //     console.log()

  //     if (
  //       alias.family === "IPv4" &&
  //       alias.address !== "127.0.0.1" &&
  //       !alias.internal
  //     ) {
  //       return alias.address;
  //     }
  //   }
  // }
};

module.exports = {
  getIPAdress,
  alias,
  copyFile,
  readFile,
  writeFile,
  watchFile,
  readWriteFiles,
  stringToObject
};
