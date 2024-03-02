const fs = require("fs");
const mongoose = require("mongoose");
const Tour = require("../models/toursModel");

const db = process.env.DATABASE.replace(
  "<password>",
  process.env.DATABASE_PASSWORD
);
const dbConnect = async () => {
  try {
    await mongoose
      .connect(db, {})
      .then(() => console.log("Database Connection successful"));
  } catch (error) {
    console.log("Connection to Database Failed", error);
  }
};
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

const importData = async () => {
  try {
    await Tour.create(tours);
    console.log("Data successfully loaded!");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// DELETE ALL DATA FROM DB
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log("Data successfully deleted!");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
}
module.exports = { dbConnect };
