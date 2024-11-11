export default (sequelize, DataTypes) => {
    const Reviews = sequelize.define('Reviews', {
      id: {
        type: DataTypes.CHAR(36),
        primaryKey: true,
      },
      product_id: {
        type: DataTypes.CHAR(36),
        allowNull: false,
      },
      user_id: {
        type: DataTypes.CHAR(36),
        allowNull: false,
      },
      rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { min: 1, max: 5 },
      },
      comment: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    }, {
      tableName: 'reviews',
      timestamps: false,
    });
  
    return Reviews;
  };
  