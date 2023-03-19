'use strict'

module.exports = function (sequelize, DataTypes) {
  let tab = sequelize.define('api', {
    id: {
      type: DataTypes.STRING(36),
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV1
    },
    realm: {
      type: DataTypes.STRING(12)
      //comment: '领域(mes,srm,scm,oa...)'
    },
    name: {
      type: DataTypes.STRING(128),
      allowNull: false
    },
    description: {
      type: DataTypes.STRING(255)
    },
    script: {
      type: DataTypes.STRING(2000)
      //comment: 'mysql-配合spc进行配置'
    },
    use: {
      type: DataTypes.INTEGER,
      defaultValue: 0
      //comment: '0未启用，1启用'
    },
    script_type: {
      type: DataTypes.STRING(1)
      //comment: '0普通sql，1无返回值存储过程，2带返回值存储过程，3执行存储过程返回多个SELECT，9执行knex脚本'
    },
    exec_type: {
      type: DataTypes.STRING(32)
      //comment: 'data:数据，exec：执行insert、update、delete'
    },
    exec_count: {
      type: DataTypes.BIGINT
      //comment: 'api执行次数'
    },
    remark: {
      type: DataTypes.STRING(255)
    },
    created_by: {
      type: DataTypes.STRING(32),
      allowNull: true
    },
    updated_by: {
      type: DataTypes.STRING(32),
      allowNull: true
    }
  })

  return tab
}
