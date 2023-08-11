const express = require("express");
const { createDonation, getUserDonations } = require("../controllers/donation");
const { authenticateUser } = require("../middlewares/authenticate");
const router = express.Router();
router.route("/").post(authenticateUser, createDonation);
router.route("/:id").get(getUserDonations);
module.exports = router;
