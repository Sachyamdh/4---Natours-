const { query } = require("express");
const Tour = require("../models/toursModel");
const apiFeaturs = require("../utils/apiFeatures");

const aliasTopTours = async (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name,price,ratingsAverage,summary,difficulty";
  next();
};

const getAllTours = async (req, res) => {
  try {
    const features = new apiFeaturs(Tour.find(), req.query)
      .filter()
      .sort()
      .limit()
      .paginate();

    if (req.query.page) {
      const numTours = await Tour.countDocuments();
      if (skip >= numTours) throw new Error("Page does not exist");
    }

    const tours = await features.query;

    res.status(200).json({
      status: "Success",
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(404).json({ status: "failed", message: err.message });
  }
};

const getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);

    res.status(200).json({
      message: "success",
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({ status: "Failed", message: err.message });
  }
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
  try {
    const UPDATEDTOUR = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: "success",
      data: {
        tour: UPDATEDTOUR,
      },
    });
  } catch (err) {
    res.status(404).json({ status: "failed", message: err.message });
  }
};

const deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(200).json({ status: "Success", data: null });
  } catch (err) {
    res.status(404).json({ status: "failed", message: err.message });
  }
};

module.exports = {
  deleteTour,
  updateTour,
  createTour,
  getAllTours,
  getTour,
  aliasTopTours,
};
