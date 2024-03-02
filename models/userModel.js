const mongoose = require("mongoose");
const validator = require("validator");

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
  },
  confirm_password: {
    type: String,
    required: [true, "Please confirm your password"],
    minlength: [8, "Password msut be 8 characters long"],
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
