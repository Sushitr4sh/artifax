class ExpressError extends Error {
  constructor(statusCode, message, description) {
    super();
    this.statusCode = statusCode;
    this.message = message;
    this.description = description;
  }
}

module.exports = ExpressError;
