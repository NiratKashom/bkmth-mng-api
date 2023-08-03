import express, { Application, Request, Response } from 'express';
import { getAllTodos } from '../controller/todos.controller';
// import { getAllTodos } from '../utils/supabase';
const router = express.Router();

router.route('/').get(getAllTodos);

router.route('/').post((req: Request, res: Response) => {
  res.json({ message: 'POST TODOS' });
});

router.route('/:id').put((req: Request, res: Response) => {
  res.json({ message: 'PUT TODOS FOR ' + req.params.id });
});

router.route('/:id').delete((req: Request, res: Response) => {
  res.json({ message: 'DELETE TODOS FOR ' + req.params.id });
});

export default router;