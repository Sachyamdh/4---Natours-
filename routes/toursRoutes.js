const express = require("express");
const {
  getAllTours,
  createTour,
  updateTour,
  deleteTour,
  getTour,
  aliasTopTours,
  tourStats,
  getMonthlyPlan,
} = require("../controller/tourController");
const { tryCatch } = require("../utils/tryCatch");
const {
  protect,
  restrictTo,
} = require("../controller/authenticationController");
const Router = express.Router();

// Router.param("id", checkId);
Router.route("/top-5-cheap").get(
  tryCatch(aliasTopTours),
  tryCatch(getAllTours)
);
Router.route("/tour-stats").get(protect, tryCatch(tourStats));
Router.route("/monthly-plan/:year").get(protect, tryCatch(getMonthlyPlan));
Router.route("/")
  .get(protect, tryCatch(getAllTours))
  .post(protect, tryCatch(createTour));
Router.route("/:id")
  .get(protect, tryCatch(getTour))
  .patch(protect, tryCatch(updateTour))
  .delete(protect, restrictTo("admin", "lead-guide"), tryCatch(deleteTour));

module.exports = Router;
