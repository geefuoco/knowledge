import type { PostController } from "../../controllers/post/post_controller";
import { Router } from "express";

export default function createPostRouter(
  postController: PostController
): Router {
  const router = Router();

  router.get("/post/:id", postController.getPost);

  return router;
}
