import express, { Application, Request, Response } from 'express';
import { getStorefrontByDate,createStorefrontData } from '../controller/storefront.controller';
const router = express.Router();

router.route('/:date').get(getStorefrontByDate);
router.route('/').post(createStorefrontData);

export default router