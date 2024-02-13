const Tour = require("../models/toursModel");


const checkId = async (req, res, next, val) => {
  console.log(`The Tour ID is ${val}`);


  next();
};

const checkBody = async (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(404).json({
      status: "fail",
      message: "Missing Name or Price",
    });
  }
};

const getAllTours = async (req, res) => {
  console.log(req.requestTime);

};

const getTour = async (req, res) => {
  console.log(req.params);
  const id = req.params.id * 1;

};

const createTour = async (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);


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
  checkId,
  checkBody,
  getTour,
};
