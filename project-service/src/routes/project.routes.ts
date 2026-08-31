import { Router, type Request, type Response } from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import {
  createProjectController,
  launchProjectController,
} from "../controllers/project.controller.js";

const projectRouter = Router();

projectRouter.use(authenticate);

projectRouter.post("/", createProjectController);
projectRouter.post("/:projectId/launch", launchProjectController);

export default projectRouter;
