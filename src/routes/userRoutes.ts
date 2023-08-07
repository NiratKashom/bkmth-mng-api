import express from 'express';
import { signIn, signOut, signUp } from '../controller/user.controller';
import { getTokenMiddleware } from '../middleware/token';

const router = express.Router();

router.route('/').post(signUp);
router.route('/login').post(signIn);
router.route('/signout').post(getTokenMiddleware,signOut);

export default router