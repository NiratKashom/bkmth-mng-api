import express, { Application, Request, Response } from 'express';
import { getStorefrontByDate,createStorefrontData,deleteStorefrontData } from '../controller/storefront.controller';
const router = express.Router();

router.route('/:date').get(getStorefrontByDate);
router.route('/').post(createStorefrontData);
router.route('/:id').delete(deleteStorefrontData);

export default router