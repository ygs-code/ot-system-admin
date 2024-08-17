const os = require("os");
const dns = require("dns");
 

const getIPAdress = () => {
  const networkInterfaces = os.networkInterfaces();
  for (const iface of Object.values(networkInterfaces)) {
    for (const config of iface) {
      if (!config.internal && config.family === "IPv4") {
        return config.address;
      }
    }
  }
  return "127.0.0.1"; // 如果没有找到，返回本地回环地址
};

module.exports = getIPAdress;
