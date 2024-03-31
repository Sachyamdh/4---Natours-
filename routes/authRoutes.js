const express = require("express");
const { tryCatch } = require("../utils/tryCatch");
const Router = express.Router();
const {
  signUp,
  login,
  forgotPassword,
  resetPassword,
  updatePassword,
} = require("../controller/authenticationController");
const { protect } = require("../middleware/authMiddleware");

Router.route("/signup").post(tryCatch(signUp));
Router.route("/login").post(tryCatch(login));
Router.post("/forgotPasword", tryCatch(forgotPassword));
Router.patch("/resetPasword/:token", tryCatch(resetPassword));
Router.patch("/updatePassword/:id", protect, tryCatch(updatePassword));

module.exports = Router;
