import express, { Response, Request, NextFunction } from "express";
import helmet from "helmet";
import { join } from "path";
import apiRouter from "./routes/routes";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(express.json());

app.use("/api/v1", apiRouter);

app.use(async (error: Error, _: Request, res: Response, next: NextFunction) => {
  res.setHeader("Content-Type", "application/json");
  res.status(400).json({ name: error.name, message: error.message });
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static(join(__dirname, "/dist")));

  app.get("*", (_, res: Response) => {
    res.sendFile(join(__dirname, "dist", "index.html"));
  });
}

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
