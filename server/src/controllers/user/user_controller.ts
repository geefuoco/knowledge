import type { Response, Request } from "express";
import type { UserRepository } from "../../data_access/user/user_repository";
import {
  parseIdOrThrow,
  expressWrapper,
  createTimestamp,
  ExpressCallback
} from "../helpers";
import apiErrors, { StatusCodes } from "../../errors/api_errors";

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
  async function getUser(req: Request, res: Response) {
    const id = parseIdOrThrow(req);
    const user = await User.findById(id, false);
    res.status(StatusCodes.OK).json(user);
  }

  async function getUsers(_: Request, res: Response) {
    const users = await User.findAll();
    res.status(StatusCodes.OK).json(users);
  }

  async function getUserPosts(req: Request, res: Response) {
    const id = parseIdOrThrow(req);
    const users = await User.findByIdWithPosts(id);
    res.status(StatusCodes.OK).json(users);
  }

  async function createUser(req: Request, res: Response) {
    validateInput(req);
    const { email, password, avatar, bio } = req.body;
    const createdAt = createTimestamp();
    const user = await User.create({
      email,
      password,
      avatar,
      bio,
      createdAt
    });
    res.status(StatusCodes.CREATED).json(user);
  }

  async function deleteUser(req: Request, res: Response) {
    const id = parseIdOrThrow(req);
    const user = await User.deleteById(id);
    if (!user) {
      throw apiErrors.createNotFoundError();
    }
    res.status(StatusCodes.OK).json(user);
  }

  function validateInput(req: Request) {
    const { email, password, avatar, bio } = req.body;

    if (!email || !password) {
      throw apiErrors.createInvalidRequestError();
    }

    if (!isValidEmail(email)) {
      throw apiErrors.createInvalidEmailError();
    }
    if (bio && bio.length > 250) {
      throw apiErrors.createInvalidContentLengthError();
    }
    if (avatar && typeof avatar !== "string") {
      throw apiErrors.createInvalidRequestError();
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
    getUser: expressWrapper(getUser),
    getUsers: expressWrapper(getUsers),
    getUserPosts: expressWrapper(getUserPosts),
    createUser: expressWrapper(createUser),
    deleteUser: expressWrapper(deleteUser)
  });
}
