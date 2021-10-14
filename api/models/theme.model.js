module.exports = (sequelize, Sequelize) => {
  const Theme = sequelize.define(
    "themes",
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING(500),
        allowNull: false,
      },
    },
    { timestamps: false }
  );

  return Theme;
};
