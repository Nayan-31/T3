const express = require("express");

const { protect } = require("../middleware/auth.middleware.js");
const {
  createApplication,
  getApplications,
  getApplication,
  updateApplication,
  deleteApplication,
} = require("../controllers/application.controller.js");

const router = express.Router();

router.use(protect);

router.post("/", createApplication);

router.get("/", getApplications);

router.get("/:id", getApplication);

router.patch("/:id", updateApplication);

router.delete("/:id", deleteApplication);

module.exports = router;
