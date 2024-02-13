const mongoose = require("mongoose");

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

module.exports = { dbConnect };
