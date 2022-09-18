import type { Response, Request } from "express";
import type { UserRepository } from "../../data_access/user/user_repository";
import {
  parseIdOrThrow,
  expressWrapper,
  createTimestamp,
  ExpressCallback
} from "../helpers";
import apiErrors, { StatusCodes } from "../../errors/api_errors";
import config from "../../config/config";
import { sendPasswordResetEmail } from "../../config/mailer";
import { v4 as uuid } from "uuid";

const MIN_PASSWORD_LENGTH = 6;

export type UserController = {
  getUser: ExpressCallback;
  getUsers: ExpressCallback;
  searchUsers: ExpressCallback;
  createUser: ExpressCallback;
  deleteUser: ExpressCallback;
  getUserPosts: ExpressCallback;
  loginUser: ExpressCallback;
  updateUser: ExpressCallback;
  getUserLikes: ExpressCallback;
  resetPassword: ExpressCallback;
  updatePassword: ExpressCallback;
};

export default function createUserController(
  User: UserRepository
): UserController {
  async function getUser(req: Request, res: Response) {
    const id = parseIdOrThrow(req);
    const user = await User.findById(id, false);
    if (!user) {
      throw apiErrors.createNotFoundError();
    }
    res.status(StatusCodes.OK).json(user);
  }

  async function getUsers(_: Request, res: Response) {
    const users = await User.findAll();
    if (!users) {
      throw apiErrors.createNotFoundError();
    }
    res.status(StatusCodes.OK).json(users);
  }

  async function getUserPosts(req: Request, res: Response) {
    const id = parseIdOrThrow(req);
    const users = await User.findByIdWithPosts(id);
    if (!users) {
      throw apiErrors.createNotFoundError();
    }
    res.status(StatusCodes.OK).json(users);
  }

  async function getUserLikes(req: Request, res: Response) {
    const id = parseIdOrThrow(req);
    const user = await User.getUserLikes(id);
    if (!user) {
      throw apiErrors.createNotFoundError();
    }
    res.status(StatusCodes.OK).json(user);
  }

  async function searchUsers(req: Request, res: Response) {
    const { username } = req.body;
    if (!username) {
      throw apiErrors.createBadInputError();
    }
    const users = await User.findByUsername(username);
    if (!users) {
      throw apiErrors.createNotFoundError();
    }
    res.status(StatusCodes.OK).json(users);
  }

  async function loginUser(req: Request, res: Response) {
    const { email, password } = req.body;
    if (!email || !password) {
      throw apiErrors.createInvalidCredentialsError();
    }
    const user = await User.login(email, password);
    if (!user) {
      throw apiErrors.createInvalidCredentialsError();
    }
    res.status(StatusCodes.OK).json(user);
  }

  async function createUser(req: Request, res: Response) {
    validateInput(req);
    const { username, email, password, avatar, bio } = req.body;
    const oldUser = await User.findByEmail(email);
    if (oldUser) {
      throw apiErrors.createUserExistsError();
    }
    const createdAt = createTimestamp();
    const user = await User.create({
      username,
      email,
      password,
      avatar,
      bio,
      createdAt
    });
    if (!user) {
      throw apiErrors.createBadInputError();
    }
    user.password = "";
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

  async function updateUser(req: Request, res: Response) {
    const id = parseIdOrThrow(req);
    const { bio, avatar } = req.body;
    const user = await User.updateUser(id, {
      bio: bio || null,
      avatar: avatar || null
    });
    if (!user) {
      throw apiErrors.createBadInputError();
    }
    res.setHeader("Access-Control-Allow-Origin", config.CLIENT);
    res.status(StatusCodes.OK).json(user);
  }

  async function resetPassword(req: Request, res: Response) {
    const { email } = req.body;
    const valid = isValidEmail(email);
    if (!valid) {
      throw apiErrors.createInvalidEmailError();
    }
    const user = await User.findByEmail(email);
    if (!user) {
      throw apiErrors.createBadInputError();
    }
    const resetToken = uuid();
    const success = await sendPasswordResetEmail(
      user.email as string,
      resetToken
    );
    if (success) {
      await User.updateUserToken(user.id as number, resetToken);
      res.status(StatusCodes.OK).json({ success, email });
    } else {
      res.status(StatusCodes.BAD_REQUEST).end();
    }
  }

  async function updatePassword(req: Request, res: Response) {
    const { password, token } = req.body;
    const user = await User.findByToken(token);
    if (!user) {
      throw apiErrors.createBadInputError();
    }
    if (password.length < MIN_PASSWORD_LENGTH) {
      throw apiErrors.createInvalidPasswordLength();
    }
    await User.updateUserPassword(user.id as number, password);
    res.status(StatusCodes.NO_CONTENT).end();
  }

  function validateInput(req: Request) {
    const { email, password, username, avatar, bio } = req.body;

    if (!email || !password || !username) {
      throw apiErrors.createInvalidRequestError();
    }

    if (username.length < 3) {
      throw apiErrors.createInvalidContentLengthError();
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
      throw apiErrors.createInvalidPasswordLength();
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
    searchUsers: expressWrapper(searchUsers),
    getUserPosts: expressWrapper(getUserPosts),
    getUserLikes: expressWrapper(getUserLikes),
    createUser: expressWrapper(createUser),
    deleteUser: expressWrapper(deleteUser),
    loginUser: expressWrapper(loginUser),
    updateUser: expressWrapper(updateUser),
    updatePassword: expressWrapper(updatePassword),
    resetPassword: expressWrapper(resetPassword)
  });
}
