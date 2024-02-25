const AppError = require("../middleware/errorHandler");

const handleCastError = (err) => {
  const message = `Invalid ${err.path}:{err.value}`;
  return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err.error,
    message: err.message,
    stack: err.stack,
  });
};

const handleDuplicateEntry = (err) => {
  const value = err.message.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplcate field value: x, Please use another value`;
  return new AppError(err.error, message, 400);
};

const sendErrorProduction = (err, res) => {
  // console.log(err);
  //operational, trusted error: send message. These are errors from our hard code
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }
  //programming or other errors send minimum message. These are errors from our third party app
  else {
    console.error("Error", err);
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    if (error.name === "CastError") error = handleCastError(err);
    if (error.error.code === 11000) error = handleDuplicateEntry(err);

    sendErrorProduction(error, res);
  }
};
