const crypto = require("crypto");
const AppError = require("../middleware/errorHandler");
const util = require("util");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const { tryCatch } = require("../utils/tryCatch");
const sendEmail = require("../middleware/mailer");

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

const forgotPassword = async (req, res, next) => {
  //get user based on the email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new AppError(
        "ValidationError",
        "There is no user with the associated email address",
        404
      )
    );
  }
  // Call the createPasswordToken method on the user instance
  const resetToken = user.createPasswordToken();
  // Save the user with the resetToken
  await user.save({ validateBeforeSave: false });

  //send it to users email
  const resetURL = `${req.protocol}://${req.get("host")}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nToken valid for 5minutes only\n If you didn't forget your password, please ignore this email.`;
  try {
    await sendEmail({
      email: user.email,
      subject: "Password Reset.",
      message: message,
    });
  } catch (error) {
    (user.passwordResetToken = undefined),
      (user.passwordResetExpire = undefined);
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        error,
        "There was an error sending the password reset token,Try again later",
        500
      )
    );
  }

  res.status(200).json({
    status: "success",
    message: "Token sent to the mail",
  });
};

const resetPassword = tryCatch(async (req, res, next) => {
  //get user based on the token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpire: { $gt: Date.now() },
  });
  if (!user) {
    throw new AppError(
      "ValidationError",
      "The token you provided is invalid",
      400
    );
  }
  // if token has not expired reset the password
  user.password = req.body.password;
  user.confirm_password = req.body.confirm_password;
  user.passwordChangedAt = Date.now();
  user.passwordResetToken = undefined;
  user.passwordResetExpire = undefined;

  await user.save();
  //update changed password at propertu of the user
  const token = signToken(user._id);
  //   log the user in and send jwt
  res.status(200).json({
    status: 200,
    token,
    data: {
      user: user,
    },
  });
});

module.exports = { signUp, login, forgotPassword, resetPassword };

