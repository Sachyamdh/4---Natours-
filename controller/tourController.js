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
};

const getTour = async (req, res) => {

  const tour = await Tour.findById(req.params.id);
 
  res.status(200).json({
    message: "success",
    data: {
      tour,
    },
  });
};

const createTour = async (req, res) => {
  const newTour = await Tour.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      tour: newTour,
    },
  });
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
  Tour.findByIdAndDelete(req.params.id);
  res.status(200).json({ status: "Success", data: null });
};

const tourStats = async (req, res) => {
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
};

const getMonthlyPlan = async (req, res) => {
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
