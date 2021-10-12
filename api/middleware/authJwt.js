const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.user;
const RequestError = require("../services/RequestError");

const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers["token"];

    if (!token) {
      throw new RequestError(401, "Unauthenticated user");
    }

    await jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
        throw new RequestError(401, "Unauthenticated user");
      }

      req.userId = decoded.id;
      next();
    });
  } catch (err) {
    console.log(err);
    res.status(err.status).json({ message: `${err.type}: ${err.message}` });
  }
};

isInstructor = async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: {
        id: req.userId,
      },
    });

    const type = user.type;

    if (type === "instructor") {
      next();
      return;
    }

    throw new RequestError(403, "User without permission");
  } catch (err) {
    console.log(err);
    res.status(err.status).json({ message: `${err.type}: ${err.message}` });
  }
};

isStudent = async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: {
        id: req.userId,
      },
    });

    const type = user.type;
    if (type === "student") {
      next();
      return;
    }

    throw new RequestError(403, "User without permission");

    return;
  } catch (err) {
    console.log(err);
    res.status(err.status).json({ message: `${err.type}: ${err.message}` });
  }
};

isStudentOrInstructor = async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: {
        id: req.userId,
      },
    });

    const type = user.type;
    if (type === "student" || type === "instructor") {
      next();
      return;
    }

    throw new RequestError(403, "User without permission");
  } catch (err) {
    console.log(err);
    res.status(err.status).json({ message: `${err.type}: ${err.message}` });
  }
};

const authJwt = {
  verifyToken: verifyToken,
  isInstructor: isInstructor,
  isStudent: isStudent,
  isStudentOrInstructor: isStudentOrInstructor,
};

module.exports = authJwt;
