module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define(
    "users",
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      type: {
        type: Sequelize.STRING,
        // type: Sequelize.ENUM("student", "instructor"),
        allowNull: false,
      },
    },
    {
      scopes: {
        withoutPassword: {
          attributes: { exclude: ["password"] },
        },
      },
    }
  );

  return User;
};
