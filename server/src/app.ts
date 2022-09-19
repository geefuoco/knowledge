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
  createS3Router,
  createUpdatePasswordRouter
} from "./routes/routes";
import { authenticateRoute } from "./controllers/helpers";
import { createUserPrisma } from "./data_access/user/user";
import { createPostPrisma } from "./data_access/post/post";
import { createLikePrisma } from "./data_access/like/like";
import { createCommentPrisma } from "./data_access/comment/comment";
import config, { createProfanityFilter } from "./config/config";

const app = express();
const client = new PrismaClient();

const corsOptions = {
  origin: [config.CLIENT, "http://localhost:5000", "http://192.168.2.210:3000"],
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

if (process.env.NODE_ENV === "production") {
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          "connect-src": `'self' https://s3.us-east-2.amazonaws.com/${config.BUCKET}`,
          "img-src": `'self' blob: https://${config.BUCKET}.s3.us-east-2.amazonaws.com/`
        }
      },
      crossOriginEmbedderPolicy: false
    })
  );
} else {
  app.use(helmet());
}
app.use(cors(corsOptions));
app.use(express.json());
app.use(createSessionMiddleware(client));
app.use(createPassportRouter(User));
app.use(createUpdatePasswordRouter(User));
app.use(
  "/api/v1",
  authenticateRoute,
  createApiRouter({ User, Post, Comment, Like })
);
app.use(createS3Router(s3));

if (process.env.NODE_ENV === "production") {
  app.use(express.static(join(__dirname, "/dist")));

  app.get("/*", (_, res: Response) => {
    res.sendFile(join(__dirname, "dist", "index.html"));
  });
}

app.use(errorHandler);
app.use(notFoundHandler);

export default app;
