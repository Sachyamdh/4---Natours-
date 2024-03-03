const express = require("express");
const { tryCatch } = require("../utils/tryCatch");
const Router = express.Router();
const {
  signUp,
  login,
  forgotPassword,
  resetPassword,
} = require("../controller/authenticationController");

Router.route("/signup").post(tryCatch(signUp));
Router.route("/login").post(tryCatch(login));
Router.post("/forgotPasword", tryCatch(forgotPassword));
Router.patch("/resetPasword/:token", tryCatch(resetPassword));

module.exports = Router;
