class RequestError extends Error {
  constructor(status, message) {
    super();

    this.status = status;
    this.type = "RequestError";
    this.message = message;
  }
}

module.exports = RequestError;
