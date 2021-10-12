module.exports = (sequelize, Sequelize) => {
  const Interest = sequelize.define("interests", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
  });

  return Interest;
};
