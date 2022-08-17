import type { Request, Response, NextFunction } from "express";

export type ExpressCallback = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

export function getIdOrThrow(req: Request): number {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    throw new Error("Invalid id");
  }
  return id;
}
