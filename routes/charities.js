const express = require("express");
const {
  getAllCharities,
  updateCharity,
  deleteCharity,
  createCharity,
  singleCharity,
  getUserCharities,
} = require("../controllers/charities");
const { authenticateUser } = require("../middlewares/authenticate");
const router = express.Router();
router.route("/").get(getAllCharities).post(authenticateUser, createCharity);
router
  .route("/:id")
  .get(authenticateUser, singleCharity)
  .patch(authenticateUser, updateCharity)
  .delete(authenticateUser, deleteCharity);
router.route("/user/:userId").get(authenticateUser, getUserCharities);
module.exports = router;
