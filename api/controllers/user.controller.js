const db = require("../models");
const User = db.user;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const RequestError = require("../services/RequestError");
const ValidationError = require("../services/ValidationError");
const validateData = require("../services/validateData");

exports.allAccess = (req, res) => {
  res.status(200).json({ msg: "Public Content." });
};

exports.studentContent = (req, res) => {
  res.status(200).json({ msg: "Student Content." });
};

exports.instructorContent = (req, res) => {
  res.status(200).json({ msg: "Instructor Content." });
};

exports.studentOrInstructorContent = (req, res) => {
  res.status(200).json({ msg: "Student or instructor Content." });
};

exports.signUp = async (req, res) => {
  try {
    //create user
    const user = await User.create({
      name: req.body.name.toString(),
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
      type: req.body.type,
    });

    res
      .status(201)
      .json({ message: "User was registered successfully!", userId: user.id });
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.error(err);
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    //find user without returning password
    const user = await User.scope("withoutPassword").findOne({
      where: { id: req.params.id },
    });

    //user not found
    if (!user) {
      throw new RequestError(404, "User not found");
    }

    ////user tries to access other user's content
    if (req.params.id != req.userId) {
      throw new RequestError(403, "User without permission");
    }

    res.status(200).json({ user });
  } catch (err) {
    console.log(err);
    res.status(err.status).json({ message: `${err.type}: ${err.message}` });
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const data = req.body;

    // find user on db
    const user = await User.findOne({
      where: { id: req.params.id },
    });

    //user not found
    if (!user) {
      throw new RequestError(404, "User not found");
    }

    //user tries to update other user's content
    if (req.params.id != req.userId) {
      console.log(req.params, req.userId);
      throw new RequestError(403, "User without permission");
    }

    //update password
    if (
      data.password != null &&
      validateData.isValidPassword(data.password) == true
    ) {
      // password exists and is valid
      data.password = bcrypt.hashSync(req.body.password, 8); //encrypt password
    } else if (
      data.password != null &&
      validateData.isValidPassword(data.password) == false
    ) {
      //password exists and is not valid
      throw new ValidationError(400, "Password cannot be empty");
    }

    //update type
    if (data.type != null && validateData.isValidType(data.type) == false) {
      // type exists and is not valid
      throw new ValidationError(
        400,
        `Type must be "student" or "instructor", got ${typeof data.type} ${
          data.type
        }`
      );
    }

    //update email
    if (data.email != null && validateData.isValidEmail(data.email) == false) {
      //email exists an is not valid
      throw new ValidationError(400, "Invalid email");
    }

    //update name
    if (data.name != null && validateData.isValidName(req.body.name) == false) {
      //name exists an is not valid
      throw new ValidationError(400, "Name cannot be empty");
    }

    //update user
    const updatedUser = await User.update(
      { ...data },
      { where: { id: req.params.id } }
    );

    res.status(204).json({ message: "ok" });
  } catch (err) {
    console.log(err);
    res.status(err.status).json({ message: `${err.type}: ${err.message}` });
  }
};
