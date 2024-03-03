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
    role: req.body.role,
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

const forgotPassword = async (req, res, next) => {};

const resetPassword = async (req, res, next) => {};

module.exports = { signUp, login };
