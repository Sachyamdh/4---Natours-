const express = require("express");
const morgan = require("morgan");
const path = require("path");
const tourRouter = require("./routes/toursRoutes");
const AppError = require("./middleware/errorHandler");
const errorController = require("./controller/errorController");
const authRouter = require("./routes/authRoutes");
const userRouter = require("./routes/userRoutes");
const reviewRouter = require("./routes/reviewRoutes");

const app = express();
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "dev-data/templates/views"));

app.use(express.static(path.join(__dirname, "dev-data/templates/public")));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json());
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.get("/", (req, res) => {
  res.status(200).render("base");
});

app.use("/api/v1/users", userRouter);
app.use("/api/v1/auth/", authRouter);
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/review", reviewRouter);

app.get("/favicon.ico", (req, res) => {
  res.status(204).end(); 
});

app.all("*", async (req, res) => {
  throw new AppError("No asscosiated routes", `Can't find the ${req.url}`, 404);
});
app.use(errorController);
module.exports = app;
