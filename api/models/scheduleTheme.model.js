module.exports = (sequelize, Sequelize) => {
  const scheduleTheme = sequelize.define("schedules_themes", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
  });

  return scheduleTheme;
};
