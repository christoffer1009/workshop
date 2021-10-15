const db = require("../models");
const Theme = db.theme;
const User = db.user;
const Schedule = db.schedule;
const Op = db.Sequelize.Op;
const ValidationError = require("../services/ValidationError");
const RequestError = require("../services/RequestError");
const { schedule } = require("../models");
// const { schedule } = require("../models");

const getPagination = (page, size) => {
  // let limit = size ? +size : 5;

  console.log("PAGE", typeof page, "SIZE", typeof size);

  let limit = size;

  if (!limit || limit < 5) {
    limit = 5;
  }
  if (limit > 15) {
    limit = 15;
  }

  const offset = page ? page * limit : 0;

  return { limit, offset };
};

const getPagingData = (data, page, limit) => {
  const { count: totalItems, rows: themes } = data;
  const currentPage = page ? +page : 0;
  const totalPages = Math.ceil(totalItems / limit);

  return { totalItems, themes, totalPages, currentPage };
};

// Create and Save a new Themes
exports.create = async (req, res) => {
  try {
    // Validate request
    if (!req.body.title || !req.body.description) {
      throw new RequestError(400, "Title and description cannot be empty!");
    }

    // Create a theme
    const data = {
      title: req.body.title,
      description: req.body.description,
      user_id: req.userId,
    };

    const themeExists = await Theme.findOne({
      where: {
        title: data.title,
      },
    });

    if (themeExists) {
      throw new ValidationError(400, "Already registered theme");
    }

    // Save theme in the database
    const theme = await Theme.create(data);

    res.status(201).json({
      message: "Theme was registered successfully!",
      themeId: theme.id,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.error(err);
  }
};

// Retrieve all Tutorials from the database.
exports.findAll = async (req, res) => {
  try {
    const { page, pageSize } = req.query;
    console.log("PAGE", typeof page, "SIZE", typeof pageSize);
    const { limit, offset } = getPagination(page - 1, parseInt(pageSize));

    const data = await Theme.findAndCountAll({ where: {}, limit, offset });
    const response = getPagingData(data, page, limit);
    res.send(response);
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.error(err);
  }
};

// Find a single Tutorial with an id
exports.findOne = async (req, res) => {
  try {
    const id = req.params.id;
    const theme = await Theme.findByPk(id, {
      distinct: true,
      attributes: ["id", "title", "user_id"],
      include: [
        {
          model: Schedule,
          as: "schedules",
          attributes: ["id", "title", "instructor_id", "date"],
          through: {
            attributes: [],
          },
        },
      ],
    });

    const dataSchedule = await Schedule.findAndCountAll({
      where: {},

      distinct: true,
      attributes: ["id", "title", "date", "instructor_id"],
      include: [
        {
          model: Theme,
          as: "themes",
          attributes: ["id", "title"],
          through: {
            attributes: [],
          },
        },
      ],
    });

    let resultSchedules = [];

    dataSchedule.rows.some((schedule) => {
      schedule.themes.some((theme) => {
        if (theme.id == id) {
          resultSchedules.push(schedule);
        }
      });
    });

    const user = await User.scope("withoutPassword").findByPk(theme.user_id);

    const asyncRes = await Promise.all(
      resultSchedules.map(async (schedule) => {
        let instructor = await User.findByPk(schedule.instructor_id);
        return { schedule, instructor: instructor.name };
      })
    );

    console.log(asyncRes);

    const response = {
      id: theme.id,
      title: theme.title,
      description: theme.description,
      createdBy: user.name,
      interested: "TODO usuários interessados",
      schedules: asyncRes,
    };

    res.json({ response });
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.error(err);
  }
};

// Update a Tutorial by the id in the request
exports.update = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;

    const theme = await Theme.findByPk(id);

    if (!theme) {
      throw new ValidationError(404, "Theme not found");
    }

    if (theme.user_id != req.userId) {
      console.log(req.params, req.userId);
      throw new RequestError(403, "User without permission");
    }

    if (req.body.title != null && req.body.title.toString().length == 0) {
      throw new ValidationError(400, "Title cannot be empty");
    }

    if (
      req.body.description != null &&
      req.body.description.toString().length == 0
    ) {
      throw new ValidationError(400, "Description cannot be empty");
    }

    //update theme
    const updatedTheme = await Theme.update({ ...data }, { where: { id: id } });

    res.status(204).json({ message: "ok" });
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.error(err);
  }
};
