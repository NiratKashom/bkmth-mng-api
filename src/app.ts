import express, { Application, Request, Response } from "express";
import {
  errorHandlerMiddleware,
  notFoundMiddleware
} from "./middleware/handleError";
import dotenv from "dotenv";

dotenv.config();

const app: Application = express();
const port = process.env.PORT;

// Body parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});