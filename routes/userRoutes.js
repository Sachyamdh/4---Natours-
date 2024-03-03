const {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} = require("../controller/userController");
const express = require("express");
const { tryCatch } = require("../utils/tryCatch");

const router = express.Router();

router.route("/").get(tryCatch(getAllUsers)).post(tryCatch(createUser));

router
  .route("/:id")
  .get(tryCatch(getUser))
  .patch(tryCatch(updateUser))
  .delete(tryCatch(deleteUser));

module.exports = router;
