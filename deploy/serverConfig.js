/**
 * ===========================
 *  ftp 文件上传配置
 * ===========================
 */
// const OUTPUT_DIR = require("../build/constant.ts").OUTPUT_DIR;
const path = require('path')

//获取上传配置信息
const getConfig = async function () {

  let users = {
    user: null,
    password: null
  }
  try {
    users = require("./users.js");
  } catch (err) {
    console.log('用户信息文件不存在 ', err)
  }

  return {
    user: users?.user,
    password: users?.password,
    host: {
      test: "10.126.16.116",
      production: "10.126.16.116"
    },
    port: {
      test: 2021,
      production: 2021
    },
    localRoot: path.resolve(__dirname, `../package`),
    remoteRoot: {// 远程静态资源文件路径
      test: '/lowcode/package',
      production: '/lowcode/package'
    }
  };
}


module.exports = getConfig
