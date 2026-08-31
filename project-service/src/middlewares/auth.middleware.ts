import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { AppError } from "../middlewares/errror.middleware.js";

export type AuthenticateUser = {
  id: string;
  email: string;
  name: string;
};

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticateUser;
    }
  }
}

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const [schema, token] = req.headers.authorization?.split(" ") ?? [];

  if (schema !== "Bearer" || !token) {
    throw new AppError(401, "Expected Authorization: Bearer <token>");
  }

  try {
    const payload = jwt.verify(token, env.ACCESS_TOKEN_SECRET) as {
      sub?: string;
      email?: string;
      name?: string;
    };

    if (!payload.sub || !payload.email || !payload.name) {
      throw new AppError(401, "Messing required token claims");
    }
    req.user = {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
    };

    next();
  } catch (error) {
    next(new AppError(401, "Invalid or expired access token"));
  }
}
