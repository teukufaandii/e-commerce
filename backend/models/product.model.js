export default (sequelize, DataTypes) => {
    const Products = sequelize.define('Products', {
      id: {
        type: DataTypes.CHAR(36),
        primaryKey: true,
      },
      category_id: {
        type: DataTypes.CHAR(36),
        allowNull: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      picture:{
        type: DataTypes.STRING,
        allowNull: false
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      discount_type:{
        type: DataTypes.ENUM('percentage', 'fixed'),
        allowNull: false,
      },
      discount_value: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    }, {
      tableName: 'products',
      timestamps: false,
    });
  
    return Products;
  };
  