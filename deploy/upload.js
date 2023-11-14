const FtpDeploy = require("ftp-deploy");
const ftpDeploy = new FtpDeploy();
const DeployConfig = require("./config.js");

/**
 * 上传文件
 * @param {*} config 
 * @returns 
 */
function uploadToFtp(config) {
    return new Promise((resolve, reject) => {
        ftpDeploy.deploy(config, (err) => {
            if (err) {
                reject(err)
            }
            resolve('上传成功!');
        })

    });
}

/**
 * 上传文件函数
 */
async function upload() {
    const config = await DeployConfig.getFtpDeployConfig();
    return await uploadToFtp(config)
}

module.exports = {
    upload
}
