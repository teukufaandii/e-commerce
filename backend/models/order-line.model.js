export default (sequelize, DataTypes) => {
    const OrderLines = sequelize.define('OrderLines', {
      id: {
        type: DataTypes.CHAR(36),
        primaryKey: true,
      },
      order_id: {
        type: DataTypes.CHAR(36),
        primaryKey: true,
      },
      product_id: {
        type: DataTypes.CHAR(36),
        primaryKey: true,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { min: 1 },
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      }
    }, {
      tableName: 'order_lines',
      timestamps: false,
    });
  
    return OrderLines;
  };
  