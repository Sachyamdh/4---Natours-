const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const signUp = async (req, res) => {
  const newUser = await User.create(req.body);
  res.status(200).json({
    status: 200,
    data: {
      user: newUser,
    },
  });
};

module.exports = { signUp };
