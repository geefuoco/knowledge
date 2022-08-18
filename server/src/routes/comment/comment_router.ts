import type { CommentController } from "../../controllers/comment/comment_controller";
import { Router } from "express";

export default function createCommentRouter(
  commentController: CommentController
): Router {
  const router = Router();

  router.get("/comment/:id", commentController.getComment);
  router.post("/comments", commentController.createComment);
  router.delete("/comment/:id", commentController.deleteComment);

  return router;
}
