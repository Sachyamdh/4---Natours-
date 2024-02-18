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
const Router = express.Router();

// Router.param("id", checkId);
Router.route("/top-5-cheap").get(
  tryCatch(aliasTopTours),
  tryCatch(getAllTours)
);
Router.route("/tour-stats").get(tryCatch(tourStats));
Router.route("/monthly-plan/:year").get(tryCatch(getMonthlyPlan));
Router.route("/").get(tryCatch(getAllTours)).post(tryCatch(createTour));
Router.route("/:id")
  .get(tryCatch(getTour))
  .patch(tryCatch(updateTour))
  .delete(tryCatch(deleteTour));

module.exports = Router;
