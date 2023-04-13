/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('Projects', {
    id: {
      //项目id
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    projectName: {
      //项目名称
      type: 'LONGTEXT',
      allowNull: true
    },
    state: {
      // 发布状态: [-1未发布, 1发布]
      type: DataTypes.INTEGER,
      allowNull: false
    },
    createTime: {
      //创建时间
      type: DataTypes.DATE,
      allowNull: true
    },
    createUserId: {
      //创建用户id
      type: DataTypes.INTEGER,
      allowNull: true
    },
    isDelete: {
      // 是否被删除
      type: DataTypes.INTEGER,
      allowNull: false
    },
    indexImage: {
      //略缩图路径
      type: 'LONGTEXT',
      allowNull: true
    },
    remarks: {
      //标记
      type: 'LONGTEXT',
      allowNull: true
    }
  })
}
