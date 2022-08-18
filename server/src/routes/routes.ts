import { Router } from "express";
import { PrismaClient } from "@prisma/client";

import { createUserPrisma } from "../data_access/user/user";
import createUserRouter from "./user/user_router";
import createUserController from "../controllers/user/user_controller";

import { createPostPrisma } from "../data_access/post/post";
import createPostRouter from "./post/post_router";
import createPostController from "../controllers/post/post_controller";

import { createCommentPrisma } from "../data_access/comment/comment";
import createCommentRouter from "./comment/comment_router";
import createCommentController from "../controllers/comment/comment_controller";
import { continueRoute } from "../controllers/helpers";

const router = Router();
const client = new PrismaClient();

const User = createUserPrisma(client);
const Post = createPostPrisma(client);
const Comment = createCommentPrisma(client);

const userRouter = createUserRouter(createUserController(User));
const postRouter = createPostRouter(createPostController(Post));
const commentRouter = createCommentRouter(createCommentController(Comment));

router.use(userRouter);
router.use(postRouter);
router.use(commentRouter);
router.use(continueRoute);

export default router;
