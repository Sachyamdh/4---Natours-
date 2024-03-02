const express = require("express");
const { tryCatch } = require("../utils/tryCatch");
const Router = express.Router();
const { signUp } = require("../controller/authenticationController");

Router.route("/signup").post(tryCatch(signUp));

module.exports = Router;
