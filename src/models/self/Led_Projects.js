/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'Led_Projects',
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      projectName: {
        type: 'LONGTEXT',
        allowNull: true
      },
      state: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      createTime: {
        type: DataTypes.DATE,
        allowNull: true
      },
      createUserId: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      isDelete: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      indexImage: {
        type: 'LONGTEXT',
        allowNull: true
      },
      remarks: {
        type: 'LONGTEXT',
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: 'Led_Projects'
    }
  )
}
