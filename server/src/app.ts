import express, { Response } from "express";
import helmet from "helmet";
import { join } from "path";
import { PrismaClient } from "@prisma/client";

import { createSessionMiddleware } from "./config/sessions";
import { errorHandler, notFoundHandler } from "./errors/error_handler";
import { createApiRouter, createPassportRouter } from "./routes/routes";
import { authenticateRoute, testingRoute } from "./controllers/helpers";
import { createUserPrisma } from "./data_access/user/user";
import { createPostPrisma } from "./data_access/post/post";
import { createCommentPrisma } from "./data_access/comment/comment";

const app = express();
const client = new PrismaClient();

const User = createUserPrisma(client);
const Post = createPostPrisma(client);
const Comment = createCommentPrisma(client);

app.use(helmet());
app.use(express.json());
app.use(createSessionMiddleware(client));
app.use(createPassportRouter(User));
app.use("/api/v1", authenticateRoute, createApiRouter({ User, Post, Comment }));
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