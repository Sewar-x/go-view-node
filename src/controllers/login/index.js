const passwordValidator = require('password-validator')
const tokenKit = require('@utils/token_kit')
const { startsWithStr, tokenExpMinutes } = require('@config')
const { Users } = db

/**
 * 用户注册
 */

const regsiter = async (req, res, next) => {
  try {
    let { username, password } = req.getParams()
    const schema = new passwordValidator()
    const validMsg = {
      min: '长度必须至少为8个字符',
      uppercase: '必须包含至少一个大写字母',
      lowercase: '必须包含至少一个小写字母',
      digits: '必须包含至少一个数字',
      spaces: '不能包含空格'
    }
    schema
      .is()
      .min(8, validMsg.min)
      .has()
      .uppercase(1, validMsg.uppercase)
      .has()
      .lowercase(1, validMsg.lowercase)
      .has()
      .digits(1, validMsg.digits)
      .has()
      .not()
      .spaces(1, validMsg.spaces)

    const isValidPassword = schema.validate(password, { list: true })
    if (isValidPassword.length !== 0) {
      const msgs = isValidPassword.map(msg => validMsg[msg])
      return res.sendError({
        code: 200,
        msg: `密码设置错误! 密码 ${msgs.join(';')}`,
        data: null
      })
    }

    // 创建新用户记录
    const [user, created] = await Users.findOrCreate({
      where: {
        username
      },
      defaults: {
        password: password
      }
    })
    if (!created) {
      return res.sendError({
        code: 200,
        msg: '该用户已存在！',
        data: null
      })
    } else {
      user.password = null
      user.salt = null
      return res.sendResponse({
        msg: '注册成功!',
        data: user
      })
    }
  } catch (error) {
    res.sendError({
      code: 500,
      msg: '系统错误',
      data: error
    })
  }
}

/**
 * 用户登录
 */
const login = async (req, res, next) => {
  try {
    let { username, password } = req.getParams()
    let user = await Users.findOne({ where: { username: username }, raw: true })
    if (!user) {
      return res.sendError({
        msg: `未找到对应的用户 ${username}，请核查！`
      })
    }
    //密码验证
    let ok = await Users.validatePassword(password, user.salt, user.password)
    if (!ok) {
      return res.sendError({
        msg: `用户 ${username} 登录密码密码不正确，请核查！`
      })
    }
    let token = await tokenKit().createToken(user)
    let userData = {
      token: {
        tokenName: 'Authorization',
        tokenValue: startsWithStr + token,
        isLogin: true,
        loginId: user.id,
        loginType: 'login',
        tokenTimeout: tokenExpMinutes,
        sessionTimeout: tokenExpMinutes,
        tokenSessionTimeout: tokenExpMinutes,
        tokenActivityTimeout: tokenExpMinutes,
        loginDevice: null,
        tag: null
      },
      userinfo: {
        id: user.id,
        username: user.username,
        password: null,
        nickname: user.nick,
        department_id: user.department_id,
        depId: null,
        posId: null,
        depName: null,
        posName: null
      }
    }

    res.sendResponse({
      msg: '操作成功',
      data: userData
    })
  } catch (error) {
    res.sendError({
      code: 500,
      msg: error,
      data: error
    })
  }
}

const logout = async (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1]
  if (!token) {
    res.sendError({
      code: 401,
      msg: '未授权',
      data: error
    })
  }

  try {
    // 验证 JWT 并使其失效
    const decoded = tokenKit.verifyToken(token)
    // TODO: 将 token 加入黑名单或者其他使其失效的方式
    res.sendResponse({
      msg: '注销成功',
      data: null
    })
  } catch (error) {
    res.sendError({
      code: 400,
      msg: '注销失败',
      data: error
    })
  }
}

module.exports = {
  regsiter,
  login,
  logout
}
