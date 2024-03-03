const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, "User must have a name"],
    trim: true,
    maxlength: [20, "User name cannot be more than 20 characters"],
    minlength: [3, "User name cannot  be less than 3 characters"],
  },
  email: {
    type: String,
    required: [true, "Email is madatory"],
    unique: [true, "Email already exists"],
    lowercase: true,
    validate: [validator.isEmail, "Please enter a valid email"],
  },
  photo: {
    type: String,
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
    minlength: [8, "Password msut be 8 characters long"],
    select: false,
  },
  confirm_password: {
    type: String,
    required: [true, "Please confirm your password"],
    minlength: [8, "Password msut be 8 characters long"],
    validate: {
      //This only works on CREATE and SAVE!!!
      validator: function (el) {
        return el === this.password;
      },
      message: "The passwords do not match",
    },
  },
  passwordChangedAt: {
    type: Date,
    default: Date.now(),
  },
});

userSchema.pre("save", async function (next) {
  //only run the function if password was actually modified
  if (!this.isModified("password")) return next();

  //encypting the password
  this.password = await bcrypt.hash(this.password, 10);

  this.confirm_password = undefined;
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    console.log(this.passwordChangedAt, JWTTimestamp);
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimeStamp;
  }
  //false means not changed
  return false;
};
const User = mongoose.model("User", userSchema);
module.exports = User;
