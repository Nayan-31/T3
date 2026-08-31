import dotenv from "dotenv";
dotenv.config();
import express from "express";

import morgan from "morgan";
import type { Request, Response, NextFunction } from "express";
import router from "./index.routes.js";
import { createProxyMiddleware } from "http-proxy-middleware";
import {
  onPreviewReaped,
  recordActivity,
} from "../services/activity.service.js";
import { errorHandler } from "../middlewares/errror.middleware.js";

const app = express();
app.use(express.json());

const proxyMap: { [key: string]: Function } = {};
const proxyMapForFiles: { [key: string]: Function } = {};

onPreviewReaped((uniqueId: string) => {
  delete proxyMap[uniqueId];
  delete proxyMapForFiles[uniqueId]
});

function getProxy(uniqueId: string) {
  if (proxyMap[uniqueId]) {
    return proxyMap[uniqueId];
  }

  const targetUrl = `http://nextjs-service-${uniqueId}`;

  const proxyMiddleware = createProxyMiddleware({
    target: targetUrl,
    changeOrigin: true,
    pathRewrite: {
      "^/": "/",
    },
  });

  proxyMap[uniqueId] = proxyMiddleware;
  return proxyMiddleware;
}

function getProxyForFiles(uniqueId: string) {
  if (proxyMapForFiles[uniqueId]) {
    return proxyMapForFiles[uniqueId];
  }

  const travelUrl = `http://nextjs-service-${uniqueId}:8000`;

  const proxyMiddleware = createProxyMiddleware({
    target: travelUrl,
    changeOrigin: true,
    pathRewrite: {
      "^/": "/",
    },
  });

  proxyMapForFiles[uniqueId] = proxyMiddleware;
  return proxyMiddleware;
}

app.use(morgan("dev"));

app.use((req: Request, res: Response, next: NextFunction) => {
  const host = req.headers.host || "";

  console.log("host", host);
  if (!host.includes("preview") && !host.includes("file-system")) {
    return next();
  }

  const subdomains = host.split(".");
  const uniqueId = subdomains[0];
  if (!uniqueId) {
    return res.status(400).json({
      message: "Invalid preview url",
    });
  }

  void recordActivity(uniqueId);

  if (host.includes("file-system")) {
    recordActivity(uniqueId);
    return getProxyForFiles(uniqueId)(req, res, next);
  }

  return getProxy(uniqueId)(req, res, next);
});

app.use("/api/projects", router);

app.get("/_status/healthz", (_req, res) => {
  res.status(200).json({ ok: true, service: "project-service" });
});

app.get("/_status/readyz", (req: Request, res: Response) => {
  res.status(200).json({ ok: true, service: "project-service" });
});

app.use(errorHandler)

export default app;
