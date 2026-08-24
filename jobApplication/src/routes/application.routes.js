import express from "express";

import { protect } from "../middleware/auth.middleware.js";

import {
  createApplication,
  getApplications,
  getApplication,
  updateApplication,
  deleteApplication,
} from "../controllers/application.controller.js";

const router = express.Router();

router.use(protect);

router.post("/", createApplication);

router.get("/", getApplications);

router.get("/:id", getApplication);

router.patch("/:id", updateApplication);

router.delete("/:id", deleteApplication);

export default router;