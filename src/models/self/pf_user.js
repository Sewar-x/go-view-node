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
        allowNull: false,
        validate: {
          notEmpty: true
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
        type: DataTypes.STRING
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
      email: {
        type: DataTypes.STRING,
        validate: {
          isEmail: {
            msg: '用户账号必须是邮箱！'
          }
        }
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
