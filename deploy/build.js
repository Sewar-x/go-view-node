/**
 * 构建 docker 脚本
 */
const path = require('path');
const spawn = require('cross-spawn');

function executeCommand(command, args, options) {
    return new Promise((resolve, reject) => {
        const childProcess = spawn(command, args, options);

        let stdout = '';
        let stderr = '';

        childProcess.stdout.on('data', (data) => {
            stdout += data.toString();
        });

        childProcess.stderr.on('data', (data) => {
            stderr += data.toString();
        });

        childProcess.on('close', (code) => {
            if (code === 0) {
                resolve({ stdout, stderr });
            } else {
                reject(new Error(`Command failed with exit code ${code}`));
            }
        });

        childProcess.on('error', (err) => {
            reject(err);
        });
    });
}

const build = async () => {
    const buildScriptPath = path.join(__dirname, 'deploy.sh');
    return await executeCommand('sh', [buildScriptPath], { shell: true })
}

module.exports = {
    build
}

