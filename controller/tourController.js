const { query } = require("express");
const Tour = require("../models/toursModel");

const getAllTours = async (req, res) => {
  try {
    const queryObj = { ...req.query };
    const excludedFields = ["page", "sort", "limit", "fiels"];
    excludedFields.forEach((el) => delete queryObj[el]);

    //filter
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    let query = Tour.find(JSON.parse(queryStr));

    //sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      console.log(sortBy);
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdDate");
    }

    //Limiting Fields
    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v");
    }

    //Pagination
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);

    if (req.query.page) {
      const numTours = await Tour.countDocuments();
      if (skip >= numTours) throw new Error("Page does not exist");
    }

    const tours = await query;

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
};
