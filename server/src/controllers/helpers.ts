import type { Request, Response, NextFunction } from "express";
import apiErrors from "../errors/api_errors";

export type ExpressCallback = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

export type Void = (req: Request, res: Response) => Promise<void>;

export function parseIdOrThrow(req: Request): number {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    throw apiErrors.createInvalidIdError();
  }
  return id;
}

export function createTimestamp(): Date {
  return new Date(Date.now());
}

export function expressWrapper(callback: Void): ExpressCallback {
  return async function (req: Request, res: Response, next: NextFunction) {
    try {
      res.setHeader("Content-Type", "application/json");
      await callback(req, res);
    } catch (error) {
      next(error);
    }
  };
}

export function continueRoute(_: Request, __: Response, next: NextFunction) {
  next(apiErrors.createNotFoundError());
}
