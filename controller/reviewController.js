const Review = require("../models/reviewModel");
const Tour = require("../models/toursModel");
const User = require("../models/userModel");

const getReviews = async (req, res) => {
  const { tour } = req?.params;

  const review = await Review.find({ tour })
    .populate({ path: "users", select: "name" })
    .exec();
  res.status(200).json({
    status: "sucess",
    data: {
      review,
    },
  });
};

const postReviews = async (req, res) => {
  const { review, rating } = req?.body;
  const { tour, user } = req?.params;
  const postReviewData = await Review.create({ review, rating, tour, user });

  res.status(200).json({
    status: "sucess",
    data: {
      postReviewData,
    },
  });
};

module.exports = { getReviews, postReviews };
