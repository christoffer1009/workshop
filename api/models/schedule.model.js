module.exports = (sequelize, Sequelize) => {
  const Schedule = sequelize.define(
    "schedules",
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING(500),
        allowNull: false,
      },
      date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    },
    { timestamps: false }
  );

  return Schedule;
};
