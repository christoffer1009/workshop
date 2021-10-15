const { interest, theme } = require("../models");
const db = require("../models");
const Schedule = db.schedule;
const Theme = db.theme;
const Interest = db.interest;
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

const getPagingData = (dataInterest, page, limit) => {
  const totalItems = dataInterest.length;
  const data = dataInterest;
  const currentPage = page ? +page : 0;
  const totalPages = Math.ceil(totalItems / limit);

  return { totalItems, data, totalPages, currentPage };
};

exports.createInterest = async (req, res, next) => {
  try {
    // Validate request
    if (!req.body.themeId) {
      throw new RequestError(400, "Theme cannot be empty!");
    }

    if (req.body.themeId.length > 1) {
      throw new RequestError(400, "Cannot register more than one theme!");
    }

    const data = {
      theme_id: req.body.themeId,
      user_id: req.userId,
    };

    const theme = await Theme.findByPk(data.theme_id);

    if (!theme) {
      throw new RequestError(400, "Theme does not exists!");
    }

    const interestExists = await Interest.findOne({
      where: {
        user_id: data.user_id,
        theme_id: data.theme_id,
      },
    });

    if (interestExists) {
      throw new ValidationError(400, "Already registered interest");
    }

    // Save theme in the database
    const interests = await Interest.create(data);

    res.status(201).json({
      message: "Interest was registered successfully!",
      interestId: interest.id,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.error(err);
  }
};

exports.deleteInterest = async (req, res) => {
  const { id } = req.params;
  try {
    const interest = await Interest.findByPk(Number(id));

    if (!interest) {
      throw new ValidationError(404, "Interest not found");
    }

    if (interest.user_id != req.userId) {
      throw new RequestError(403, "User without permission");
    }

    await Interest.destroy({
      where: { id: Number(id) },
    });
    res.status(204).json({ message: "ok" });
  } catch (err) {
    res.status(err.status).json({ message: err.message });
    console.error(err);
  }
};

exports.getInterests = async (req, res, next) => {
  const userId = req.userId;

  const { page, pageSize } = req.query;
  try {
    const { limit, offset } = getPagination(page - 1, parseInt(pageSize));

    const interests = await Interest.findAndCountAll({
      where: { user_id: userId },
      limit,
      offset,
    });

    console.log(interests);

    const data = await Promise.all(
      interests.rows.map(async (interest) => {
        let theme = await Theme.findByPk(interest.theme_id);
        return {
          interest: interest.id,
          userId: interest.user_id,
          theme: { id: theme.id, tilte: theme.title },
        };
      })
    );

    const response = getPagingData(data, page, limit);
    res.json(response);
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.error(err);
  }
};
