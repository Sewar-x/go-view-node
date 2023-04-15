/**
 * 常见的错误码
 * 200 OK：请求成功。
 * 400 Bad Request：请求格式错误或无效。
 * 401 Unauthorized：未经授权访问。
 * 403 Forbidden：拒绝访问，权限不足。
 * 404 Not Found：找不到请求的资源。
 * 500 Internal Server Error：服务器内部错误。
 * 503 Service Unavailable：服务不可用，通常是由于服务器过载或维护而引起的。
 */
// 错误状态枚举
const codeEnums = {
  OK: 200, //: 请求成功。
  BadRequest: 400, //：请求格式错误或无效。
  Unauthorized: 401, //：未经授权访问。
  Forbidden: 403, //：拒绝访问，权限不足。
  NotFound: 404, //：找不到请求的资源。
  InternalServerError: 500, //：服务器内部错误。
  ServiceUnavailable: 503 //：服务不可用，通常是由于服务器过载或维护而引起的。
}

// 错误状态消息枚举
const codeMsgEnums = {
  200: '操作成功!', //: 请求成功。
  400: '请求格式错误或无效!', //：请求格式错误或无效。
  401: '未经授权访问!', //：未经授权访问。
  403: '拒绝访问，权限不足!', //：拒绝访问，权限不足。
  404: '找不到请求的资源!', //：找不到请求的资源。
  500: '服务器内部错误!', //：服务器内部错误。
  503: '服务不可用!' //：服务不可用，通常是由于服务器过载或维护而引起的。
}

/**
 * token 枚举类型
 */
// 错误码枚举
const tokenCodeEnums = {
  Unauthorized: 401, //：没有提供 token 或者提供的 token 无效。
  Forbidden: 403, //：提供的 token 是有效的，但用户没有足够的权限访问所请求的资源。
  AuthenticationTimeout: 419, //（或 440 Login Timeout）：token 已过期或超时。
  InvalidToken: 498, //：提供的 token 无效。
  TokenRequired: 499 //：没有提供 token。
}

// 错误码消息枚举
const tokenCodeMsgEnums = {
  401: '没有提供 token 或者提供的 token 无效!', //：没有提供 token 或者提供的 token 无效。
  403: '没有权限访问所请求的资源!', //：提供的 token 是有效的，但用户没有足够的权限访问所请求的资源。
  419: 'token 已过期或超时!', //（或 440 Login Timeout）：token 已过期或超时。
  498: '提供的 token 无效!', //：提供的 token 无效。
  499: '没有提供 token !' //：没有提供 token。
}

module.exports = {
  codeEnums,
  codeMsgEnums,
  tokenCodeMsgEnums,
  tokenCodeEnums
}
