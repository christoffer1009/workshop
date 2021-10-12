const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { user } = require("../models");
// const Op = db.Sequelize.Op;

exports.login = async (req, res) => {
  try {
    //find user
    const user = await User.findOne({
      where: {
        email: req.body.email,
      },
    });

    //user with given email not found
    if (!user) {
      return res.status(401).json({ message: "Invalid Email or Password!" });
    }

    //check password
    const passwordIsValid = await bcrypt.compareSync(
      req.body.password,
      user.password
    );

    //wrong password
    if (!passwordIsValid) {
      return res.status(401).json({
        message: "Invalid Email or Password!",
      });
    }

    //generate token
    const token = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: 86400, // 24 hours
    });

    res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
      type: user.type,
      accessToken: token,
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
