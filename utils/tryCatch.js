const AppError = require("../middleware/errorHandler");

exports.tryCatch = (controller) => async (req, res, next) => {
  try {
    await controller(req, res);
  } catch (err) {
    return next(new AppError(err.message, 404));
  }
};
