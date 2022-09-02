import type { LikeController } from "../../controllers/like/like_controller";
import { Router } from "express";

export default function createLikeRouter(likeController: LikeController) {
  const router = Router();

  router.get("/like/:id", likeController.getLike);
  router.post("/likes", likeController.createLike);
  router.delete("/like/:id", likeController.deleteLike);

  return router;
}
