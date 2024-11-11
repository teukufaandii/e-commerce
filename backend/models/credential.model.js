export default (sequelize, DataTypes) => {
    const Credentials = sequelize.define('Credentials', {
      user_id: {
        type: DataTypes.CHAR(36),
        allowNull: false,
        primaryKey: true,
      },
      hasher:{
        type: DataTypes.ENUM('bcrypt', 'argon2'),
        allowNull: false
      },
      password_hash: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password_salt: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    }, {
      tableName: 'credentials',
      timestamps: false,
    });
  
    return Credentials;
  };
  