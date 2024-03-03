const AppError = require("./errorHandler");
const util = require("util");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const { tryCatch } = require("../utils/tryCatch");

const restrictTo = (...roles) => {
  return (req, res, next) => {
    //roles  can be either of these "user", "guide", "lead-guide", "admin"
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          "Authorizarion Error",
          "You do not have access to perform this action",
          403
        )
      );
    }
    next();
  };
};

const protect = tryCatch(async (req, res, next) => {
  //Getting the token
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    throw new AppError("Authorazization Failed", "You are not logged in", 401);
  }

  //Validating the token
  const decoded = await util.promisify(jwt.verify)(
    token,
    process.env.JWT_SECRETKEY
  );

  //Check if the user still exists
  const freshUser = await User.findById(decoded.id);
  if (!freshUser) {
    throw new AppError("Inavlid User", "User no longer exists", 401);
  }
  //check if the user changed password after the jwt token was issued
  if (await freshUser.changedPasswordAfter(decoded.iat)) {
    throw new AppError("Authorization Failed", "Password was changed", 401);
  }

  //granting access
  req.user = freshUser;
  next();
});

module.exports = { protect, restrictTo };
