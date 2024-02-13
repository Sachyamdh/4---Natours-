const dotenv = require("dotenv");
dotenv.config({ path: "config.env" });
const app = require("./app");
const { dbConnect } = require("./config/db");

const port = process.env.PORT || 3000;
dbConnect();

app.listen(port, () => {
  console.log(`App runnng on port ${port}....`);
});
