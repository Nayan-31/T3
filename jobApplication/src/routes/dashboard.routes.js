const express = require("express");

const { getDashboard } = require("../controllers/dashboard.controller.js");

const { protect } = require("../middleware/auth.middleware.js");

const router = express.Router();

router.get("/", protect, getDashboard);

module.exports = router;
