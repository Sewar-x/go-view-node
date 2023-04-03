
const tokenKit = require('../../utils/token_kit')

const { pf_user } = db
const login = async (req, res, next) => {
  try {
    let { username, password } = req.getParams()
    let user = await pf_user.findOne({ where: { username: username }, raw: true })
    if (!user) {
      return res.sendError({
        msg: `未找到对应的用户 ${username}，请核查！`
      })
    }
    //密码验证
    let ok = await pf_user.validatePassword(password)
    if (!ok) {
      return res.sendError({
        code: 200,
        msg: `用户 ${username} 登录密码密码不正确，请核查！`
      })
    }
    let token = await tokenKit().createToken(user)
    let userinfo = {
      id: user.id,
      username: user.username,
      password: '',
      nickname: user.nick,
      depId: '',
      posId: '',
      depName: '',
      posName: ''
    }
    // JWT有效期(分钟=默认120),
    let ExpMinutes = 120
    let _token = {
      tokenName: 'Authorization',
      tokenValue: 'Bearer ' + token,
      isLogin: true,
      loginId: user.id,
      loginType: 'login',
      tokenTimeout: ExpMinutes * 60 * 1000,
      sessionTimeout: ExpMinutes * 60 * 1000,
      tokenSessionTimeout: ExpMinutes * 60 * 1000,
      tokenActivityTimeout: ExpMinutes * 60 * 1000,
      loginDevice: '',
      tag: null
    }
    let userData = { token: _token, userinfo: userinfo }

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
    return res.json({ msg: '退出成功', code: 200 })
  }

module.exports = {
  login,
  logout,
}
