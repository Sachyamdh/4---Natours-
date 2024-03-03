const AppError = require("../middleware/errorHandler");

exports.tryCatch = (controller) => async (req, res, next) => {
  try {
    await controller(req, res, next);
  } catch (err) {
    return next(new AppError(err, err.message, 404));
  }
};
