import type { Request, Response, NextFunction } from "express";
import apiErrors, { StatusCodes } from "../errors/api_errors";

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

export function logoutUser(req: Request, res: Response, next: NextFunction) {
  req.logout((error) => {
    if (error) {
      return next(error);
    }
    res.status(StatusCodes.NO_CONTENT).end();
  });
}

export function authenticateRoute(
  req: Request,
  _: Response,
  next: NextFunction
) {
  if (req.isAuthenticated()) {
    return next();
  }
  return next(apiErrors.createUnauthorizedError());
}

export async function testingRoute(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (req.isAuthenticated()) {
      res.status(StatusCodes.OK).send("<h1>Authorized Root Route</h1>");
    } else {
      res.status(StatusCodes.UNAUTHORIZED).send("<h1>Root Route</h1>");
    }
  } catch (error) {
    next(error);
  }
}
