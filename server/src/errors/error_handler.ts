import type { Request, Response, NextFunction } from "express";
import { APIError, StatusCodes } from "./api_errors";

export async function errorHandler(
  err: Error,
  _: Request,
  res: Response,
  __: NextFunction
) {
  res.setHeader("Content-Type", "application/json");
  let statusCode = StatusCodes.NOT_FOUND;
  if (err instanceof APIError) {
    statusCode = err.statusCode;
  }
  res.status(statusCode).json({
    name: err.name,
    statusCode,
    message: err.message || "Not found"
  });
}

export async function notFoundHandler(
  _: Request,
  res: Response,
  __: NextFunction
) {
  res.setHeader("Content-Type", "application/json");
  const err = {
    statusCode: StatusCodes.NOT_FOUND,
    message: "Resource not found"
  };
  res.status(StatusCodes.NOT_FOUND).json(err);
}
