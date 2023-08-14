/**
 * webhook  自动部署测试 
 */
const webhook = async (req, res, next) => {
    try {
        console.log('==== webhook  自动部署测试  ===')
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
