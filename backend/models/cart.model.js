export default (sequelize, DataTypes) => {
    const Carts = sequelize.define('Carts', {
      id: {
        type: DataTypes.CHAR(36),
        primaryKey: true,
      },
      status: {
        type: DataTypes.ENUM('active', 'completed', 'abandoned'),
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      created_by: {
        type: DataTypes.CHAR(36),
        allowNull: false,
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    }, {
      tableName: 'carts',
      timestamps: false,
    });
  
    return Carts;
  };
  