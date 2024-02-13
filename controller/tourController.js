const Tour = require("../models/toursModel");

const getAllTours = async (req, res) => {
  console.log(req.requestTime);
};

const getTour = async (req, res) => {
  console.log(req.params);
  const id = req.params.id * 1;
};

const createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(404).json({ status: "Failed", message: err.message });
  }
};

const updateTour = async (req, res) => {
  res.status(200).json({
    status: "success",
    data: {
      tour: "<Updated tour here...>",
    },
  });
};

const deleteTour = async (req, res) => {
  res.status(204).json({
    status: "success",
    data: null,
  });
};

module.exports = {
  deleteTour,
  updateTour,
  createTour,
  getAllTours,
  getTour,
};
