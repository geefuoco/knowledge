import { Router, Request, Response } from "express";
import type { UserRepository } from "../data_access/user/user_repository";
import type { PostRepository } from "../data_access/post/post_repository";
import type { CommentRepository } from "../data_access/comment/comment_repository";
import type { LikeRepository } from "../data_access/like/like_repository";

import createLikeRouter from "./like/like_router";
import createLikeController from "../controllers/like/like_controller";

import createUserRouter from "./user/user_router";
import createUserController from "../controllers/user/user_controller";

import createPostRouter from "./post/post_router";
import createPostController from "../controllers/post/post_controller";

import createCommentRouter from "./comment/comment_router";
import createCommentController from "../controllers/comment/comment_controller";
import {
  continueRoute,
  authenticateRoute,
  logoutUser
} from "../controllers/helpers";
import { createPassportStrategy } from "../config/passport";
import { StatusCodes } from "../errors/api_errors";

type Repositories = {
  User: UserRepository;
  Post: PostRepository;
  Comment: CommentRepository;
  Like: LikeRepository;
};

export function createApiRouter(repositories: Repositories): Router {
  const router = Router();
  const { User, Post, Comment, Like } = repositories;

  const userController = createUserController(User);
  const postController = createPostController(Post);
  const commentController = createCommentController(Comment);
  const likeController = createLikeController(Like);

  const userRouter = createUserRouter(userController);
  const postRouter = createPostRouter(postController);
  const commentRouter = createCommentRouter(commentController);
  const likeRouter = createLikeRouter(likeController);

  router.use(authenticateRoute, userRouter);
  router.use(authenticateRoute, postRouter);
  router.use(authenticateRoute, commentRouter);
  router.use(authenticateRoute, likeRouter);
  router.use(continueRoute);

  return router;
}

export function createPassportRouter(User: UserRepository): Router {
  const passport = createPassportStrategy(User);
  const router = Router();
  const userController = createUserController(User);

  router.use(passport.initialize());
  router.use(passport.session());

  router.post(
    "/login",
    passport.authenticate("local", {
      failureRedirect: "/login"
    }),
    (req: Request, res: Response) => {
      res.status(StatusCodes.OK).json(req.user);
    }
  );

  router.post("/logout", logoutUser);
  router.post("/register", userController.createUser);
  return router;
}
