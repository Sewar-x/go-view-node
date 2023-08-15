/**
 * webhook  自动部署测试 
 */

const signature = require('./gogs-signature.js');
const path = require('path');
const spawn = require('cross-spawn');
const deployScriptPath = path.join(__dirname, 'deploy.sh');

const webhook = async (req, res, next) => {
    try {
        const gogsSignature = req.headers['x-gogs-signature']
        if (gogsSignature === signature) {
            console.log('====自动部署====')
            const deployProcess = spawn(deployScriptPath, [], { shell: true });
            deployProcess.stdout.on('data', (data) => {
                console.log(`stdout: ${data}`);
            });

            deployProcess.stderr.on('data', (data) => {
                console.error(`stderr: ${data}`);
            });

            deployProcess.on('error', (err) => {
                console.error(`exec error: ${err}`);
            });

            deployProcess.on('close', (code) => {
                console.log(`child process exited with code ${code}`);
            });
        } else {
            res.sendError({
                code: 500,
                msg: '签名错误',
                data: null
            })
        }
        res.sendResponse({
            msg: '操作成功',
            data: {}
        })
    } catch (error) {
        res.sendError({
            code: 500,
            msg: error,
            data: error
        })
    }
}

module.exports = {
    webhook
}