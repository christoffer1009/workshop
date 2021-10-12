const config = require("../config/db.config.js");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
  host: config.HOST,
  dialect: config.DIALECT,

  pool: {
    max: config.pool.max,
    min: config.pool.min,
    acquire: config.pool.acquire,
    idle: config.pool.idle,
  },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("../models/user.model.js")(sequelize, Sequelize);
db.theme = require("../models/theme.model.js")(sequelize, Sequelize);
db.interest = require("../models/interest.model.js")(sequelize, Sequelize);
db.schedule = require("../models/schedule.model.js")(sequelize, Sequelize);
db.scheduleTheme = require("../models/scheduleTheme.model.js")(
  sequelize,
  Sequelize
);

// associations
db.theme.belongsTo(db.user, {
  foreignKey: {
    name: "user_id",
    allowNull: false,
  },
});

db.interest.belongsTo(db.user, {
  foreignKey: {
    name: "user_id",
    allowNull: false,
  },
});

db.interest.belongsTo(db.theme, {
  foreignKey: {
    name: "theme_id",
    allowNull: false,
  },
});

db.theme.belongsToMany(db.schedule, {
  through: db.scheduleTheme,
  foreignKey: "theme_id",
  otherKey: "schedule_id",
});

db.schedule.belongsToMany(db.theme, {
  through: db.scheduleTheme,
  foreignKey: "schedule_id",
  otherKey: "theme_id",
});

module.exports = db;
