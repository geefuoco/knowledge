import type { Response, Request, NextFunction } from "express";
import type { UserRepository } from "../../data_access/user/user_repository";

export type UserController = {
  getUser: (req: Request, res: Response, next: NextFunction) => Promise<void>;
};

export default function createUserController(
  User: UserRepository
): UserController {
  async function getUser(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params["id"]);
      if (isNaN(id)) {
        const error = new Error("Invalid user id");
        return next(error);
      }
      const user = await User.findById(id, false);
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }

  return Object.freeze({
    getUser
  });
}
