const express = require("express");
const morgan = require("morgan");
const Router = require("./routes/toursRoutes");
const AppError = require("./middleware/errorHandler");
const errorController = require("./controller/errorController");

const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json());

// app.use("/api/v1/users");
app.use("/api/v1/tours", Router);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find the ${req.url}`, 404));
});

app.use(errorController);
module.exports = app;
