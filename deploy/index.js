
const { build } = require("./build.js");
const { upload } = require("./upload.js");
const axios = require('axios');

/**
 * 解压 docker 包
 */
const decompress = async () => {
  try {
    const url = 'http://10.126.16.116:8081/structure.php?token=YvthEzXxVTw5qrJD'
    // 使用 axios 发送 GET 请求  
    const response = await axios.get(url);
    if (response.status == 200) {
      return console.log('docker 服务器文件解成功！');
    } else {
      return console.log('docker 服务器文件解失败！');
    }
  } catch (err) {
    console.error(err)
  }
}

/**
 * 发布脚本
 */
const deploy = async () => {
  try {
    console.log('docker 自动打包中...');
    await build();
    console.log('docker 打包完成！');
    console.log('docker 文件上传中...');
    await upload();
    console.log('docker 文件上传完成！');
    console.log('docker 服务器文件解压中...');
    await decompress()
  } catch (err) {
    console.error(err)
  }
}

deploy()