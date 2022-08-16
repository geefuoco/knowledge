import express, { Response, Request, NextFunction } from "express";
import helmet from "helmet";
import { join } from "path";
import { Router } from "express";
import { PrismaClient } from "@prisma/client";

import { createUserPrisma } from "./data_access/user/user";
import { createPostPrisma } from "./data_access/post/post";
import { createCommentPrisma } from "./data_access/comment/comment";

const prisma = new PrismaClient();

const User = createUserPrisma(prisma);
const Post = createPostPrisma(prisma);
const Comment = createCommentPrisma(prisma);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(express.json());

//TODO
//Move to use_cases module
const apiRouter = Router();
apiRouter.get("/users", async (_, res: Response, next: NextFunction) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
});

apiRouter.get("/posts", async (_, res: Response, next: NextFunction) => {
  try {
    const posts = await Post.findAll();
    res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
});

apiRouter.get(
  "/post/:id/comments",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params["id"]);
      const comments = await Comment.findByPostId(id);
      res.status(200).json(comments);
    } catch (error) {
      next(error);
    }
  }
);

apiRouter.get(
  "/comment/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params["id"]);
      const comment = await Comment.findById(id);
      res.status(200).json(comment);
    } catch (error) {
      next(error);
    }
  }
);

app.use("/api/v1", apiRouter);

app.use("*", async (_, res: Response) => {
  res.status(404).json({ error: "Not Found" });
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static(join(__dirname, "/dist")));

  app.get("*", (_, res: Response) => {
    res.sendFile(join(__dirname, "dist", "index.html"));
  });
}

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
