module.exports = (sequelize, Sequelize) => {
  const ScheduleTheme = sequelize.define(
    "schedules_themes",
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
    },
    { timestamps: false }
  );

  return ScheduleTheme;
};
