const ValidationError = require("./ValidationError");

exports.isValidName = (name) => {
  if (name.length == 0 || !name instanceof String) {
    return false;
  }
  return true;
};

exports.isValidEmail = (email) => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (!re.test(String(email).toLocaleLowerCase())) {
    return false;
  }
  return true;
};

exports.isValidPassword = (password) => {
  if (password.length == 0) {
    return false;
  }
  return true;
};

exports.isValidType = (type) => {
  if (type != "student" && type != "instructor") {
    return false;
  }
  return true;
};
