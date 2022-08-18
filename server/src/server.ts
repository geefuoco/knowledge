import express, { Response } from "express";
import helmet from "helmet";
import { join } from "path";
import { PrismaClient } from "@prisma/client";

import config from "./config/config";
import { createSessionMiddleware } from "./config/sessions";
import { errorHandler, notFoundHandler } from "./errors/error_handler";
import { createApiRouter, createPassportRouter } from "./routes/routes";
import { authenticateRoute, testingRoute } from "./controllers/helpers";

const app = express();
const client = new PrismaClient();
const PORT = config.PORT;

app.use(helmet());
app.use(express.json());
app.use(createSessionMiddleware(client));
app.use(createPassportRouter(client));
app.use("/api/v1", authenticateRoute, createApiRouter(client));
app.get("/", testingRoute);
app.use(errorHandler);
app.use(notFoundHandler);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(join(__dirname, "/dist")));

  app.get("*", (_, res: Response) => {
    res.sendFile(join(__dirname, "dist", "index.html"));
  });
}

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
