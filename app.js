const express = require("express");
const morgan = require("morgan");
const Router = require("./routes/toursRoutes");
const AppError = require("./middleware/errorHandler");
const errorController = require("./controller/errorController");

const app = express();
require("express-async-errors");

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json());
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();

  next();
});

// app.use("/api/v1/users");
app.use("/api/v1/tours", Router);

app.all("*", async (req, res) => {
  throw new AppError("No asscosiated routes", `Can't find the ${req.url}`, 404);
});
app.use(errorController);
module.exports = app;
