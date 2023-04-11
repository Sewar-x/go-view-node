'use strict'
// bcryptjs是一个用于密码加密和验证的JavaScript库
const bcrypt = require('bcryptjs')
const SALT_WORK_FACTOR = 10

module.exports = function (sequelize, DataTypes) {
  let User = sequelize.define(
    'Users',
    {
      id: {
        // id, 唯一
        type: DataTypes.BIGINT,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
      },
      username: {
        // 系统用户名，唯一
        type: DataTypes.STRING,
        unique: true,
        allowNull: false, //唯一约束,约束是在 SQL 级别定义的规则, 如果约束检查失败,则数据库将引发错误,并且 Sequelize 会将错误转发给 JavaScript
        //验证是在纯 JavaScript 中在 Sequelize 级别执行的检查,如果验证失败,则根本不会将 SQL 查询发送到数据库.
        validate: {
          notEmpty: true,
          len: [2, 32] //验证其长度在3到15个字符之间
        }
      },
      email: {
        // 邮箱
        type: DataTypes.STRING,
        unique: false,
        allowNull: true,
        validate: {
          notEmpty: false,
          isEmail: true
        }
      },
      password: {
        // 密码
        type: DataTypes.STRING,
        allowNull: false
      },
      salt: {
        // 用于密码加密的值
        type: DataTypes.STRING
      },
      cn_name: {
        // 用户真实名称，不唯一
        type: DataTypes.STRING,
        unique: false,
        allowNull: true,
        validate: {
          notEmpty: false,
          len: [2, 32]
        }
      },
      birthday: {
        type: DataTypes.STRING
      },
      gender: {
        //性别
        type: DataTypes.ENUM('1', '2'), // 1为男性，2 为女性
        defaultValue: '1'
      },

      phone: {
        // 电话
        type: DataTypes.STRING(11),
        allowNull: true,
        unique: true
      },
      state: {
        // 状态
        type: DataTypes.STRING
      },
      description: {
        //描述
        type: DataTypes.STRING
      },
      login_count: {
        // 登录次数
        type: DataTypes.INTEGER
      },
      previous_visit: {
        // 上次访问时间
        type: DataTypes.STRING
      },
      last_visit: {
        // 最后访问时间
        type: DataTypes.STRING
      },
      del_flag: {
        // 删除标记
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      department_id: {
        // 部门id
        type: DataTypes.STRING(36),
        allowNull: true
      }
    },
    {
      hooks: {
        beforeCreate: async user => {
          // 生成一个salt值，用于加密密码
          user.salt = await bcrypt.genSaltSync(SALT_WORK_FACTOR)
          //将密码哈希化，并将哈希值存储在数据库中
          user.password = await bcrypt.hashSync(user.password, user.salt)
        }
      }
    }
  )

  // 在此不能使用箭头函数，否则this无法使用，获取不到相关的值
  User.prototype.validatePassword = async function (password) {
    const encodedPassword = await bcrypt.hashSync(password, this.salt)
    return this.password === encodedPassword
  }

  User.validatePassword = async (password, salt, enPassword) => {
    const encodedPassword = await bcrypt.hashSync(password, salt)
    return enPassword === encodedPassword
  }
  return User
}
