import express, { Application, Request, Response } from 'express';
import { signIn, signOut, signUp } from '../controller/user.controller';
const router = express.Router();

router.route('/').post(signUp);
router.route('/login').post(signIn);
router.route('/signout').post(signOut);

export default router