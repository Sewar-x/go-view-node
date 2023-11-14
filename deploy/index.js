
const { build } = require("./build.js");
const { upload } = require("./upload.js");

const deploy = async () => {
  try {
    console.log('docker 自动打包中...');
    await build();
    console.log('docker 打包完成！');
    console.log('docker 文件上传中...');
    await upload();
    console.log('docker 文件上传完成！');
  } catch (err) {
    console.error(err)
  }
}

deploy()