class ValidationError extends Error {
  constructor(status, message) {
    super();

    this.status = status;
    this.type = "ValidationError";
    this.message = message;
  }
}

module.exports = ValidationError;
