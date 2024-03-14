const express = require("express");
const { tryCatch } = require("../utils/tryCatch");
const Router = express.Router();
const { getReviews, postReviews } = require("../controller/reviewController");
const { protect, restrictTo } = require("../middleware/authMiddleware");

Router.route("/upload/:tour/:user").post(
  protect,
  restrictTo("user"),
  tryCatch(postReviews)
);
Router.route("/get/:tour").get(tryCatch(getReviews));

module.exports = Router;
