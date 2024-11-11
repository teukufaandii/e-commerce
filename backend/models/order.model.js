export default (sequelize, DataTypes) => {
    const Orders = sequelize.define('Orders', {
      id: {
        type: DataTypes.CHAR(36),
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.CHAR(36),
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    }, {
      tableName: 'orders',
      timestamps: false,
    });
  
    return Orders;
  };
  