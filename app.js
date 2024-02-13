const express = require("express");
const morgan = require("morgan");
const Router = require("./routes/toursRoutes");

const app = express();

app.use(express.json());
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// app.use("/api/v1/users");
app.use("/api/v1/tours", Router);

module.exports = app;
