export default (sequelize, DataTypes) => {
    const CartItems = sequelize.define('CartItems', {
      cart_id: {
        type: DataTypes.CHAR(36),
        primaryKey: true,
      },
      product_id: {
        type: DataTypes.CHAR(36),
        primaryKey: true,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { min: 1 },
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    }, {
      tableName: 'cart_items',
      timestamps: false,
    });
  
    return CartItems;
  };
  