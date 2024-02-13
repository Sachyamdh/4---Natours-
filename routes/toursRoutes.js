const express = require("express");
const {
  checkId,
  getAllTours,
  checkBody,
  createTour,
  updateTour,
  deleteTour,
  getTour,
} = require("../controller/tourController");
const Router = express.Router();

Router.param("id", checkId);

Router.route("/").get(getAllTours).post(checkBody, createTour);
Router.route("/:id").get(getTour).patch(updateTour).delete(deleteTour);

module.exports = Router;
