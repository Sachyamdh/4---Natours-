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

const tourStats = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } },
      },
      {
        $group: {
          _id: null,
          numTours: { $sum: 1 },
          numRatings: { $sum: "$ratingsQuantity" },
          avgRating: { $avg: "$ratingsAverage" },
          avgPrice: { $avg: "$price" },
          minPrice: { $min: "$pirce" },
          maxPrice: { $max: "$pirce" },
        },
      },
    ]);
    res.status(200).json({
      status: "success",
      data: {
        stats,
      },
    });
  } catch (err) {
    res.stats(400).json({ status: "Failed", message: err.msg });
  }
};

const getMonthlyPlan = async (req, res) => {
  try {
    const year = req.params.year * 1;
    const plan = await Tour.aggregate([
      {
        $unwind: "$startDates",
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: "$startDates" },
          numTourStarts: { $sum: 1 },
          tours: { $push: "$name" },
        },
      },
      {
        $addFields: { month: "$_id" },
      },
      {
        $project: {
          _id: 0,
        },
      },
      {
        $sort: { numTourStarts: -1 },
      },
      {
        $limit: 12,
      },
    ]);

    res.status(200).json({ status: "success", data: plan });
  } catch (err) {
    res.status(404).json({ status: "Failed", message: err.message });
  }
};

module.exports = {
  deleteTour,
  updateTour,
  createTour,
  getAllTours,
  getTour,
  aliasTopTours,
  tourStats,
  getMonthlyPlan,
};
