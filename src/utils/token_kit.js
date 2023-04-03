'use strict'

const jwt = require('jsonwebtoken')
const { sessionExpiresIn, APP_SECRET } = require('@config')
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
      if (token.startsWith('Bearer ')) {
        // Remove Bearer from string
        token = token.slice(7, token.length)
      }
      return await jwt.verify(token, this.secret, (err, decoded) => {
        if (err) {
          console.log('err', err)
          return { err: err, decoded: '' }
        } else {
          // console.log({ err: '', decoded: decoded })
          return { err: '', decoded: decoded }
        }
      })
    }
  }
}

module.exports = (expiresIn, secret) => {
  return new JwtToken(expiresIn || sessionExpiresIn, secret || APP_SECRET)
}
