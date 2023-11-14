const axios = require('axios');
const { promisify } = require('util');
const { SYSTEM } = require('@config/index.js')

// 创建一个 Axios 实例  
const instance = axios.create({
    baseURL: SYSTEM.AXIOS_BASEURL, // 设置 API 的基础 URL  
    timeout: 5000, // 设置请求超时时间（以毫秒为单位）  
    // 其他 Axios 配置选项...  
});

// 将 axios 的 request 方法转换为返回 Promise 的函数  
const axiosRequest = promisify(instance.request).bind(instance);

// 插件函数，用于发送 HTTP 请求  
function axiosPlugin(req, res, next) {
    // 在 req 上附加 axios 实例，以便在路由处理程序中使用  
    req.axios = axiosRequest;
    next();
}

module.exports = axiosPlugin;