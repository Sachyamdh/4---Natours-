const dotenv = require("dotenv");
process.on("uncaughtException", (err) => {
  console.log(err.message, err.name);
  console.error(err.stack);
  console.log("Unhandled Exception; Shutting down the server");
  process.exit(1);
});

dotenv.config({ path: "config.env" });
const app = require("./app");
const { dbConnect } = require("./config/db");

const port = process.env.PORT || 3000;
dbConnect();

const server = app.listen(port, () => {
  console.log(`App runnng on port ${port}....`);
});

process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message, err.stack);
  console.log("Unhandled rejection");
  server.close(() => {
    process.exit(1);
  });
});
