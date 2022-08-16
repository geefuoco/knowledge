import { Router } from "express";
import createUserController from "../../controllers/user/user_controller";
import { UserRepository } from "../../data_access/user/user_repository";

export default function createUserRouter(User: UserRepository): Router {
  const router = Router();
  const userController = createUserController(User);

  router.get("/user/:id", userController.getUser);

  return router;
}
