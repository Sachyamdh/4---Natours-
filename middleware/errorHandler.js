class AppError extends Error {
  constructor(err, message, statusCode) {
    super(message);
    console.log("App error", err);
    this.error = err;
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
