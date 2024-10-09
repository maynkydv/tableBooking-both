const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User',
    {
      userId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      mobile: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.STRING,
        defaultValue: 'customer',
      },
      email: { //* credential
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          msg: 'Email already exists. Please Login.',
        }
      },
      password: { //* credential
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [6, 100],
            msg: 'Password must be at least 6 characters long.',
          },
        },
      },
    },
    { timestamps: false },
  );

  async function hashPassword(customer) {
    if (customer.changed('password')) {
      const salt = await bcrypt.genSalt(10);
      customer.password = await bcrypt.hash(customer.password, salt);
    }
  }
  User.beforeSave(hashPassword);

  User.prototype.validPassword = async function (password) {
    return bcrypt.compare(password, this.password);
  };

  return User;
};
