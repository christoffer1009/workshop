const db = require("../models");
const User = db.user;
const ValidationError = require("../services/ValidationError");
// const validateData = require("../services/validateData");

const validateSignUp = async (req, res, next) => {
  try {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!re.test(String(req.body.email).toLocaleLowerCase())) {
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

    if (req.body.type != "student" && req.body.type != "instructor") {
      throw new ValidationError(
        400,
        `Type must be "student" or "instructor", got ${typeof req.body.type} ${
          req.body.type
        }`
      );
    }

    if (req.body.name == null) {
      throw new ValidationError(400, "Name cannot be empty");
    } else if (req.body.name.toString().length == 0) {
      throw new ValidationError(400, "Name cannot be empty");
    }

    if (req.body.password == null) {
      throw new ValidationError(400, "Password cannot be empty");
    } else if (req.body.password.toString().length == 0) {
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
