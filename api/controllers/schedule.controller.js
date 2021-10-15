// const { Sequelize, sequelize, schedule, schedule } = require("../models");
const db = require("../models");
const Schedule = db.schedule;
const Theme = db.theme;
const ScheduleTheme = db.scheduleTheme;
const RequestError = require("../services/RequestError");
const ValidationError = require("../services/ValidationError");

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

const getPagingData = (dataSchedule, page, limit) => {
  const { count: totalItems, rows: data } = dataSchedule;
  const currentPage = page ? +page : 0;
  const totalPages = Math.ceil(totalItems / limit);

  return { totalItems, data, totalPages, currentPage };
};

//POST/schedules
exports.createSchedule = async (req, res, next) => {
  try {
    // Validate request
    if (!req.body.title || !req.body.description) {
      throw new RequestError(400, "Title and description cannot be empty!");
    }

    if (req.body.themes.length == 0) {
      throw new RequestError(400, "Themes cannot be empty!");
    }

    const today = new Date();

    if (
      !req.body.date ||
      new Date(req.body.date).valueOf() <= today.valueOf()
    ) {
      throw new RequestError(400, "Date must be greater than today");
    }

    // Create a schedule
    const data = {
      title: req.body.title,
      description: req.body.description,
      date: new Date(req.body.date),
      themes: req.body.themes,
      instructor_id: req.userId,
    };

    // Save schedule in the database
    const schedule = await Schedule.create(data);

    data.themes.forEach(async (theme) => {
      let newTheme = await Theme.findByPk(theme);
      await schedule.addTheme(newTheme);
    });

    // const schedule = Schedule.findByPk(newSchedule.id, {
    //   include: [
    //     {
    //       model: ScheduleTheme,
    //       as: "schedules",
    //       attributes: ["id", "title", "description"],
    //       through: {
    //         attributes: [],
    //       },
    //     },
    //   ],
    // });

    res.status(201).json({
      message: "Schedule was registered successfully!",
      scheduleId: schedule.id,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.error(err);
  }
};

//GET/schedules

// Falta retornar interesses

exports.getSchedulesByinstructor = async (req, res, next) => {
  try {
    const { page, pageSize } = req.query;
    console.log("PAGE", typeof page, "SIZE", typeof pageSize);
    const { limit, offset } = getPagination(page - 1, parseInt(pageSize));

    const dataSchedule = await Schedule.findAndCountAll({
      where: { instructor_id: req.userId },
      limit,
      offset,
      distinct: true,
      attributes: ["id", "title"],
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

    const response = getPagingData(dataSchedule, page, limit);
    res.send(response);
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.error(err);
  }
};

//PATCH/schedules/{id}
exports.updateSchedule = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;

    const schedule = await Schedule.findByPk(id);
    console.log(schedule.instructor_id);

    if (!schedule) {
      throw new ValidationError(404, "Schedule not found");
    }

    if (schedule.instructor_id != req.userId) {
      throw new RequestError(403, "User without permission");
    }

    if (data.title != null && data.title.toString().length == 0) {
      throw new ValidationError(400, "Title cannot be empty");
    }

    if (data.description != null && data.description.toString().length == 0) {
      throw new ValidationError(400, "Description cannot be empty");
    }

    const today = new Date();

    if (
      !req.body.date ||
      new Date(req.body.date).valueOf() <= today.valueOf()
    ) {
      throw new RequestError(400, "Date must be greater than today");
    }

    if (data.themes) {
      throw new ValidationError(400, "Themes cannot be updated");
    }

    //update schedule
    const updatedSchedule = await Schedule.update(
      { ...data },
      { where: { id: id } }
    );

    res.status(204).json({ message: "ok" });
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.error(err);
  }
};

//DELETE/schedules/{id}/themes/{themeId}
exports.deleteScheduleTheme = async (req, res) => {
  const { id, themeId } = req.params;
  try {
    const theme = await Theme.findByPk(themeId);

    if (!theme) {
      throw new ValidationError(404, "Theme not found");
    }

    const schedule = await Schedule.findByPk(id);

    if (!schedule) {
      throw new ValidationError(404, "Schedule not found");
    }

    if (schedule.instructor_id != req.userId) {
      throw new RequestError(403, "User without permission");
    }

    await schedule.removeTheme(themeId);

    res.status(204).json({ message: "ok" });
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.error(err);
  }
};

//POST/schedules/{id}/themes
exports.addScheduleTheme = async (req, res) => {
  const { id } = req.params;
  const { themeId } = req.body;
  try {
    const theme = await Theme.findByPk(themeId);

    if (!theme) {
      throw new ValidationError(404, "Theme not found");
    }

    const schedule = await Schedule.findByPk(id);

    if (!schedule) {
      throw new ValidationError(404, "Schedule not found");
    }

    if (schedule.instructor_id != req.userId) {
      throw new RequestError(403, "User without permission");
    }

    await schedule.addTheme(themeId);

    res.status(204).json({ message: "ok" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
