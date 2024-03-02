const express = require("express");
const { tryCatch } = require("../utils/tryCatch");
const Router = express.Router();
const { signUp, login } = require("../controller/authenticationController");

Router.route("/signup").post(tryCatch(signUp));
Router.route("/login").post(tryCatch(login));

module.exports = Router;
