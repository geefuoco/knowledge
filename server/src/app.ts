import express, { Response } from "express";
import helmet from "helmet";
import cors from "cors";
import { join } from "path";
import { PrismaClient } from "@prisma/client";

import { createSessionMiddleware } from "./config/sessions";
import { errorHandler, notFoundHandler } from "./errors/error_handler";
import { createApiRouter, createPassportRouter } from "./routes/routes";
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
app.get("/", testingRoute);
app.use(errorHandler);
app.use(notFoundHandler);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(join(__dirname, "/dist")));

  app.get("*", (_, res: Response) => {
    res.sendFile(join(__dirname, "dist", "index.html"));
  });
}

export default app;
