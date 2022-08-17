import { Router } from "express";
import { PrismaClient } from "@prisma/client";

import { createUserPrisma } from "../data_access/user/user";
import createUserRouter from "./user/user_router";
import createUserController from "../controllers/user/user_controller";

const router = Router();
const client = new PrismaClient();

const User = createUserPrisma(client);

const userRouter = createUserRouter(createUserController(User));

router.use(userRouter);

export default router;
