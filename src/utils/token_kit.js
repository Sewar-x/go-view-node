'use strict'

const jwt = require('jsonwebtoken')
const { sessionExpiresIn, startsWithStr, APP_SECRET } = require('@config')
class JwtToken {
  constructor(expiresIn, secret) {
    this.expiresIn = expiresIn
    this.secret = secret
  }

  async createToken(user) {
    if (user) {
      const { id, username } = user
      return await jwt.sign({ id: id, username: username }, this.secret, { expiresIn: this.expiresIn })
    } else {
      return await jwt.sign({ role: 'GUEST' }, this.secret, { expiresIn: this.expiresIn })
    }
  }

  async verifyToken(token) {
    if (token) {
      if (token.startsWith(startsWithStr)) {
        // Remove Bearer from string
        token = token.slice(startsWithStr.ength, token.length)
      }
      return await jwt.verify(token, this.secret, (err, decoded) => {
        if (err) {
          return { err: err, decoded: null }
        } else {
          return { err: null, decoded: decoded }
        }
      })
    }
    return false
  }
}

module.exports = (expiresIn, secret) => {
  return new JwtToken(expiresIn || sessionExpiresIn, secret || APP_SECRET)
}
