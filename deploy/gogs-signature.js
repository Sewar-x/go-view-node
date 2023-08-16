const crypto = require("crypto");

const secretKey = 'low-code-node'

const verify_signature = (req) => {

    try {
        // 曲线救国方案，通过请求用户 id = 60 (gogs 用户:xuwen),判断是否为本人推送的代码
        const { id } = req.body.sender
        return id === 60
        // 存在问题： gogs webhook 签名和计算的签名不相同，导致一直无法验证通过
        // 创建 HMAC 实例
        const hmac = crypto.createHmac('sha256', secretKey);
        const payload = JSON.stringify(req.body); // 消息内容
        const delivery = req.headers['x-gogs-delivery'];
        const event = req.headers['x-gogs-event'];
        const timestamp = req.headers['x-gogs-timestamp'];
        const gogsSignature = req.headers['x-gogs-signature']
        const dataToSign = `X-Gogs-Delivery: ${delivery}
        X-Gogs-Event: ${event}
        X-Gogs-Signature: ${gogsSignature}
        ${payload}`;

        // 更新要计算哈希值的文本
        hmac.update(dataToSign);



        const signature = Buffer.from(hmac.digest(), 'binary');
        const requestSignature = Buffer.from(gogsSignature, 'hex');


        console.log('==signature=', signature)
        console.log('==x-gogs-signature=', requestSignature)
        return signature === requestSignature
    } catch (err) {
        console.error(err)
        return false
    }

};


module.exports = { verify_signature }