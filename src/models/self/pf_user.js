'use strict'

const bcrypt = require('bcryptjs')
const SALT_WORK_FACTOR = 10

module.exports = function (sequelize, DataTypes) {
  let tab = sequelize.define(
    'pf_user',
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
      },
      username: {
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
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          notEmpty: true,
          isEmail: true
        }
      },
      password: {
        type: DataTypes.STRING,
        set(value) {
          // 在数据库中以明文形式存储密码是很糟糕的.
          // 使用适当的哈希函数来加密哈希值更好.
          this.setDataValue('password', hash(value))
        }
      },
      salt: {
        type: DataTypes.STRING
      },
      nick: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: true,
        validate: {
          notEmpty: true,
          len: [2, 32]
        }
      },
      birthday: {
        type: DataTypes.STRING
      },
      gender: {
        type: DataTypes.ENUM('0', '1'),
        defaultValue: '0'
      },

      phone: {
        type: DataTypes.STRING(11),
        allowNull: false,
        unique: true
      },
      state: {
        type: DataTypes.STRING
      },
      description: {
        type: DataTypes.STRING
      },
      login_count: {
        type: DataTypes.INTEGER
      },
      previous_visit: {
        type: DataTypes.STRING
      },
      last_visit: {
        type: DataTypes.STRING
      },
      del_flag: {
        // type: DataTypes.ENUM(0, 1),
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      source: {
        type: DataTypes.STRING(64)
        //comment: '用户来源，支付宝、微信、百度等'
      },
      inviteman: {
        type: DataTypes.STRING(64)
        //comment: '邀请人'
      },
      company_id: {
        type: DataTypes.STRING(36),
        allowNull: false
      }
    },
    {
      hooks: {
        beforeCreate: async user => {
          user.salt = await bcrypt.genSaltSync(SALT_WORK_FACTOR)
          user.password = await bcrypt.hashSync(user.password, user.salt)
        }
      }
    }
  )

  // 在此不能使用箭头函数，否则this无法使用，获取不到相关的值
  tab.prototype.validatePassword = async function (password) {
    var encodedPassword = await bcrypt.hashSync(password, this.salt)
    return this.password === encodedPassword
  }

  tab.validatePassword = async (password, salt, enPassword) => {
    var encodedPassword = await bcrypt.hashSync(password, salt)
    return enPassword === encodedPassword
  }
  return tab
}
