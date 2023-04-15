'use strict'

const jwt = require('jsonwebtoken')
const { TOKEN, APP } = require('@config')
const { codeEnums, codeMsgEnums, tokenCodeMsgEnums, tokenCodeEnums } = require('@enums/response.js')
class JwtToken {
  constructor(expiresIn, secret) {
    this.expiresIn = expiresIn
    this.secret = secret
  }

  async createToken(user) {
    if (user) {
      user.password = null
      return await jwt.sign({ role: 'USER', ...user }, this.secret, { expiresIn: this.expiresIn })
    } else {
      return await jwt.sign({ role: 'GUEST', id: null, username: null }, this.secret, { expiresIn: this.expiresIn })
    }
  }

  /**
   * 验证 Token
   * @param {*} token
   * @returns
   */
  async verifyToken(token) {
    let res_data = {
      code: tokenCodeEnums.Unauthorized,
      name: tokenCodeMsgEnums[tokenCodeEnums.Unauthorized],
      message: tokenCodeMsgEnums[tokenCodeEnums.Unauthorized],
      data: null
    }
    if (!token) {
      return res_data
    }

    if (token.startsWith(TOKEN.tokenStartsWithStr)) {
      // Remove tag from string
      token = token.slice(TOKEN.tokenStartsWithStr.length, token.length)
    }
    try {
      const decoded = await jwt.verify(token, this.secret)
      res_data = {
        code: codeEnums.OK,
        name: codeMsgEnums[codeEnums.OK],
        message: codeMsgEnums[codeEnums.OK],
        data: decoded
      }
    } catch (err) {
      res_data = {
        code: tokenCodeEnums.InvalidToken,
        name: err.name,
        message: err.message,
        data: err
      }
    } finally {
      return res_data
    }
  }
}

module.exports = (expiresIn, secret) => {
  return new JwtToken(expiresIn || TOKEN.sessionExpiresIn, secret || APP.APP_SECRET)
}
