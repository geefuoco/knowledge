import { Router } from "express";
import type { UserController } from "../../controllers/user/user_controller";

export default function createUserRouter(
  userController: UserController
): Router {
  const router = Router();

  router.patch("/user/:id", userController.updateUser);
  router.get("/user/:id", userController.getUser);
  router.get("/users", userController.getUsers);
  router.get("/user/:id/posts", userController.getUserPosts);
  router.get("/user/:id/likes", userController.getUserLikes);
  router.post("/user/search", userController.searchUsers);
  router.delete("/user/:id", userController.deleteUser);
  router.post("/user/reset-password", userController.resetPassword);
  router.post("/user/update-password", userController.updatePassword);

  return router;
}
