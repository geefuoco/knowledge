import { Router } from "express";
import type { PrismaClient } from "@prisma/client";

import { createUserPrisma } from "../data_access/user/user";
import createUserRouter from "./user/user_router";
import createUserController from "../controllers/user/user_controller";

import { createPostPrisma } from "../data_access/post/post";
import createPostRouter from "./post/post_router";
import createPostController from "../controllers/post/post_controller";

import { createCommentPrisma } from "../data_access/comment/comment";
import createCommentRouter from "./comment/comment_router";
import createCommentController from "../controllers/comment/comment_controller";
import {
  continueRoute,
  authenticateRoute,
  logoutUser
} from "../controllers/helpers";
import { createPassportStrategy } from "../config/passport";

export function createApiRouter(client: PrismaClient): Router {
  const router = Router();

  const User = createUserPrisma(client);
  const Post = createPostPrisma(client);
  const Comment = createCommentPrisma(client);

  const userController = createUserController(User);
  const postController = createPostController(Post);
  const commentController = createCommentController(Comment);

  const userRouter = createUserRouter(userController);
  const postRouter = createPostRouter(postController);
  const commentRouter = createCommentRouter(commentController);

  router.use(authenticateRoute, userRouter);
  router.use(authenticateRoute, postRouter);
  router.use(authenticateRoute, commentRouter);
  router.use(continueRoute);

  return router;
}

export function createPassportRouter(client: PrismaClient): Router {
  const passport = createPassportStrategy(client);
  const router = Router();
  const User = createUserPrisma(client);
  const userController = createUserController(User);

  router.use(passport.initialize());
  router.use(passport.session());

  router.post(
    "/login",
    passport.authenticate("local", {
      failureRedirect: "/login",
      successRedirect: "/"
    })
  );

  router.post("/logout", logoutUser);
  router.post("/register", userController.createUser);
  return router;
}
