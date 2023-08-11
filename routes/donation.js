const express = require("express");
const { createDonation } = require("../controllers/donation");
const { authenticateUser } = require("../middlewares/authenticate");
const router = express.Router();
router.route("/").post(authenticateUser, createDonation);
module.exports = router;
