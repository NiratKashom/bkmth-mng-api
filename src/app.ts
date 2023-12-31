import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv'
import cors from 'cors'

import userRouter from './routes/userRoutes';
import storefrontRouter from './routes/storefrontRoutes';
import expenseRouter from './routes/expenseRoutes';  
import reportRouter from './routes/reportRoutes';  

import {errorHandlerMiddleware,
  notFoundMiddleware} from './middleware/handleError'; 

dotenv.config();

const app: Application = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to Kanomthai management API!');
});

// app.use('/api/todos', todosRouter);
app.use('/api/user', userRouter);
app.use('/api/storefront', storefrontRouter);
app.use('/api/expense', expenseRouter);
app.use('/api/report', reportRouter);

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

export default app