const crypto = require("crypto");

const secretKey = 'low-code-node'

const verify_signature = (req) => {

    let signature = null
    try {
        // 创建 HMAC 实例
        const hmac = crypto.createHmac('sha256', secretKey);
        // 更新要计算哈希值的文本
        hmac.update(JSON.stringify(req.body));


        // 计算哈希值并以十六进制字符串形式输出
        signature = hmac.digest('hex');
    } catch (err) {
        console.error(err)
        return false
    }


    console.log('==signature=', signature)
    console.log('==x-gogs-signature=', req.headers['x-gogs-signature'])
    return signature === req.headers['x-gogs-signature']
};


module.exports = { verify_signature }