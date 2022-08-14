import express, { Response } from "express";
import helmet from "helmet";
import { join } from "path";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(express.json());

if (process.env.NODE_ENV === "production") {
  app.use(express.static(join(__dirname, "/dist")));

  app.get("*", (_, res: Response) => {
    res.sendFile(join(__dirname, "dist", "index.html"));
  });
}

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
