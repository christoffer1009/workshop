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
  through: "schedules_themes",
  as: "schedules",
  foreignKey: { name: "theme_id", allowNull: false },
});

db.schedule.belongsToMany(db.theme, {
  through: "schedules_themes",
  as: "themes",
  foreignKey: { name: "schedule_id", allowNull: false },
  otherKey: { name: "theme_id", allowNull: false },
});

db.schedule.belongsTo(db.user, {
  foreignKey: { name: "instructor_id", allowNull: false },
});

module.exports = db;
