import type { Request, Response, NextFunction } from "express";

export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
  ) {
    super(message);
  }
}

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ message: err.message });
    return;
  }
  console.log(err);
  res.status(500).json({ message: "Internal server error" });
}
