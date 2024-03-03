const AppError = require("../middleware/errorHandler");
const util = require("util");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const { tryCatch } = require("../utils/tryCatch");

const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRETKEY, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

const signUp = async (req, res) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirm_password: req.body.confirm_password,
  });

  const token = signToken(newUser._id);
  res.status(200).json({
    status: 200,
    token,
    data: {
      user: newUser,
    },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  //check if password and email exists
  if (!email || !password) {
    throw new AppError(
      "Empty email or password",
      "Please provide your email or password",
      400
    );
  }

  //check if the the user exists
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    throw new AppError("Invalid Credentials", "Invalid email or password", 400);
  }
  //if everything is ok we create the token
  const token = signToken(user._id);

  res.status(200).json({
    status: 200,
    token,
    data: {
      user: user,
    },
  });
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

  next();
});
module.exports = { signUp, login, protect };
