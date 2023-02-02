/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'Led_Projectdatas',
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      projectId: {
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
      contentData: {
        type: 'LONGTEXT',
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: 'Led_Projectdatas'
    }
  )
}
