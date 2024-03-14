const Review = require("../models/reviewModel");
const Tour = require("../models/toursModel");
const User = require("../models/userModel");

const getReviews = async (req, res) => {
  const { tour } = req?.params;
  res.status(200).json({
    status: "sucess",
  });
};

const postReviews = async (req, res) => {
  const { review, rating } = req?.body;
  const { tour, user } = req?.params;

  console.log(review, rating, tour, user);

  res.status(200).json({
    status: "sucess",
  });
};

module.exports = { getReviews, postReviews };
