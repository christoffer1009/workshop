const db = require("../models");
const User = db.user;
const ValidationError = require("../services/ValidationError");
const validateData = require("../services/validateData");

const validateSignUp = async (req, res, next) => {
  try {
    if (validateData.isValidEmail(req.body.email) == false) {
      throw new ValidationError(400, "Invalid email");
    }

    const user = await User.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (user) {
      throw new ValidationError(400, "Already registered user");
    }

    if (validateData.isValidType(req.body.type) == false) {
      throw new ValidationError(
        400,
        `Type must be "student" or "instructor", got ${typeof req.body.type} ${
          req.body.type
        }`
      );
    }

    if (validateData.isValidName(req.body.name) == false) {
      throw new ValidationError(400, "Name cannot be empty");
    }

    if (validateData.isValidPassword(req.body.password) == false) {
      throw new ValidationError(400, "Password cannot be empty");
    }

    next();
  } catch (err) {
    console.error(err);
    if (err instanceof ValidationError) {
      res.status(err.status).json({ message: `${err.type}: ${err.message}` });
    }
  }
};

module.exports = validateSignUp;
