const mongoose = require("mongoose");
const Tour = require("./toursModel");
const User = require("./userModel");

const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  review: {
    type: String,
    trim: true,
    minlength: [3, "A review must me be at least three characters long"],
  },
  rating: {
    type: Number,
    required: [true, "A review must have a rating"],
    min: 1,
    max: 5,
  },
  createdTime: {
    type: Date,
    default: Date.now(),
  },
  tour: {
    type: mongoose.Schema.ObjectId,
    ref: "Tours",
    required: [true, "Review must be given to a tour"],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Review must be given by a user"],
  },
});

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "tour",
    select: "name",
  }).populate({
    path: "user",
    select: "name",
  });
  next();
});

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
