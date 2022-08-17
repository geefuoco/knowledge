import type { Response, Request, NextFunction } from "express";
import type { UserRepository } from "../../data_access/user/user_repository";

type ExpressCallback = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

export type UserController = {
  getUser: ExpressCallback;
  getUsers: ExpressCallback;
  createUser: ExpressCallback;
  deleteUser: ExpressCallback;
  getUserPosts: ExpressCallback;
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

  async function getUsers(_: Request, res: Response, next: NextFunction) {
    try {
      const users = await User.findAll();
      res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  }

  async function getUserPosts(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params["id"]);
      if (isNaN(id)) {
        const error = new Error("Invalid user id");
        return next(error);
      }
      const users = await User.findByIdWithPosts(id);
      res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  }

  async function createUser(req: Request, res: Response, next: NextFunction) {
    try {
      validateInput(req);
      const { email, password, avatar, bio } = req.body;
      const createdAt = new Date(Date.now());
      const user = await User.create({
        email,
        password,
        avatar,
        bio,
        createdAt
      });
      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  }

  async function deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params["id"]);
      if (isNaN(id)) {
        const error = new Error("Invalid id");
        return next(error);
      }
      const user = await User.deleteById(id);
      if (!user) {
        const error = new Error(`User with id ${id} does not exists`);
        return next(error);
      }
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }

  function validateInput(req: Request) {
    const { email, password, avatar, bio } = req.body;

    if (!email || !password) {
      throw new Error("Please supply an email and password");
    }

    if (!isValidEmail(email)) {
      throw new Error("Invalid email");
    }
    if (bio && bio.length > 250) {
      throw new Error("Bio length is longer than 250 characters");
    }
    if (avatar && typeof avatar !== "string") {
      throw new Error("Invalid avatar image link");
    }
  }

  function isValidEmail(email: string): boolean {
    email = email.trim();
    if (email.length > 318) {
      return false;
    }
    if (!email.includes("@") || email.includes(" ")) {
      return false;
    }
    const [recipient, domain] = email.split("@");
    if (
      domain.charAt(0) === "." ||
      domain.match(/\W/) === null ||
      domain.charAt(domain.length - 1).match(/\W/) !== null
    ) {
      return false;
    }
    if (recipient.charAt(0).match(/\W/) !== null) {
      return false;
    }
    return true;
  }

  return Object.freeze({
    getUser,
    getUsers,
    getUserPosts,
    createUser,
    deleteUser
  });
}
