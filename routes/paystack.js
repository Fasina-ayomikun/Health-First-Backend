const express = require("express");
const { initializePayment } = require("../controllers/paystack");
const router = express.Router();

router.route("/").post(initializePayment);
module.exports = router;
