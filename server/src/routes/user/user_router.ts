import { Router } from "express";
import type { UserController } from "../../controllers/user/user_controller";

export default function createUserRouter(
  userController: UserController
): Router {
  const router = Router();

  router.get("/user/:id", userController.getUser);
  router.get("/users", userController.getUsers);
  router.post("/users", userController.createUser);
  router.delete("/user/:id", userController.deleteUser);

  return router;
}
