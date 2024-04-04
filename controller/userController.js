const User = require("../models/userModel");

const getAllUsers = async (req, res, next) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined",
  });
};

const getUser = async (req, res, next) => {
  const user = User.findById(req?.body.params);
  console.log(user);
  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
};
const createUser = async (req, res, next) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined",
  });
};

const updateUser = async (req, res, next) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined",
  });
};

const deleteUser = async (req, res, next) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined",
  });
};

module.exports = { getAllUsers, getUser, createUser, updateUser, deleteUser };
