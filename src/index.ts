import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv'

import todosRouter from './routes/todosRoutes';

import {errorHandlerMiddleware,
  notFoundMiddleware} from './middleware/handleError'; 

dotenv.config();

const app: Application = express();
const port = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.use('/api/todos', todosRouter);

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});