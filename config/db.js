const mongoose = require("mongoose");

const db = process.env.DATABASE.replace(
  "<password>",
  process.env.DATABASE_PASSWORD
);
console.log(db);
const dbConnect = async () => {
  try {
    await mongoose
      .connect(db, {
        useNewUrlParser: true,
      })
      .then(() => console.log("Database Connection successful"));
  } catch (error) {
    console.log("Connection to Database Failed",error);
  }
};

module.exports = { dbConnect };
