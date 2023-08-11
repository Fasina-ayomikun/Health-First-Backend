const express = require("express");
const { singleUser } = require("../controllers/user");
const router = express.Router();
router.route("/:id").get(singleUser);
module.exports = router;
