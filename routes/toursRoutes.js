const express = require("express");
const {
  getAllTours,
  createTour,
  updateTour,
  deleteTour,
  getTour,
  aliasTopTours,
  tourStats,
} = require("../controller/tourController");
const Router = express.Router();

// Router.param("id", checkId);
Router.route("/top-5-cheap").get(aliasTopTours, getAllTours);
Router.route("/tour-stats").get(tourStats);
Router.route("/").get(getAllTours).post(createTour);
Router.route("/:id").get(getTour).patch(updateTour).delete(deleteTour);

module.exports = Router;
