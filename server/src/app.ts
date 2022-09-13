import express, { Response } from "express";
import helmet from "helmet";
import cors from "cors";
import { join } from "path";
import { PrismaClient } from "@prisma/client";
import AWS from "aws-sdk";

import { createSessionMiddleware } from "./config/sessions";
import { errorHandler, notFoundHandler } from "./errors/error_handler";
import {
  createApiRouter,
  createPassportRouter,
  createS3Router
} from "./routes/routes";
import { authenticateRoute, testingRoute } from "./controllers/helpers";
import { createUserPrisma } from "./data_access/user/user";
import { createPostPrisma } from "./data_access/post/post";
import { createLikePrisma } from "./data_access/like/like";
import { createCommentPrisma } from "./data_access/comment/comment";
import config, { createProfanityFilter } from "./config/config";

const app = express();
const client = new PrismaClient();

const corsOptions = {
  origin: config.CLIENT,
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
  optionsSuccessStatus: 204,
  credentials: true
};

const s3 = new AWS.S3({
  accessKeyId: config.AWS_KEY,
  secretAccessKey: config.AWS_S3_SECRET,
  region: "us-east-2"
});

const filter = createProfanityFilter();
const User = createUserPrisma(client, filter);
const Post = createPostPrisma(client, filter);
const Comment = createCommentPrisma(client, filter);
const Like = createLikePrisma(client);

app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());
app.use(createSessionMiddleware(client));
app.use(createPassportRouter(User));
app.use(
  "/api/v1",
  authenticateRoute,
  createApiRouter({ User, Post, Comment, Like })
);
app.use(createS3Router(s3));
app.get("/", testingRoute);
app.use(errorHandler);
app.use(notFoundHandler);

export default app;
