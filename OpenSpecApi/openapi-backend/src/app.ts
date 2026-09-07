import fs from "node:fs";
import express from "express";
import swaggerUi from "swagger-ui-express";
import { apiReference } from "@scalar/express-api-reference";
import usersRouter from "./modules/users/users.routes.js";

const swaggerSpec = JSON.parse(
  fs.readFileSync( //Pichhle step ki openapi.json file padhta hai
    new URL("../generated/openapi.json", import.meta.url),
    "utf-8",
  ),
);

const app = express();

app.use(express.json());

app.use("/api/users", usersRouter);

app.get("/openapi.json", (_req, res) => {
  res.json(swaggerSpec);
});

app.use(
  "/swagger", //Swagger UI dikhata hai
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec),
);

app.use(
  "/docs", //Scalar documentation dikhata hai
  apiReference({
    url: "/openapi.json",
    showDeveloperTools: "never",
  }),
);

export default app;