const express = require("express");
const {
  createDonation,
  getUserDonations,
  getCharityDonations,
} = require("../controllers/donation");
const { authenticateUser } = require("../middlewares/authenticate");
const router = express.Router();
router.route("/").post(authenticateUser, createDonation);
router.route("/:id").get(getUserDonations);
router.route("/charity/:charityId").get(getCharityDonations);
module.exports = router;
