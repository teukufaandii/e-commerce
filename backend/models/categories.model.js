export default (sequelize, DataTypes) => {
    const Categories = sequelize.define('Categories', {
      id: {
        type: DataTypes.CHAR(36),
        primaryKey: true,
      },
      slug: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      parent_category: {
        type: DataTypes.CHAR(36),
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    }, {
      tableName: 'categories',
      timestamps: false,
    });
  
    return Categories;
  };
  