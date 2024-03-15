const Review = require("../models/reviewModel");
const Tour = require("../models/toursModel");
const User = require("../models/userModel");

const getReviews = async (req, res) => {
  const { tour } = req?.params;

  const review = await Review.find({ tour });
  res.status(200).json({
    status: "sucess",
    data: {
      review,
    },
  });
};

const postReviews = async (req, res) => {
  const { review, rating } = req?.body;
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user._id;
  const postReviewData = await Review.create({ review, rating, tour, user });

  res.status(200).json({
    status: "sucess",
    data: {
      postReviewData,
    },
  });
};

module.exports = { getReviews, postReviews };
