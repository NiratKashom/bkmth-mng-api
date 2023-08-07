import express from 'express';
import { getStorefrontByDate,createStorefrontData,deleteStorefrontData } from '../controller/storefront.controller';
import { getTokenMiddleware } from '../middleware/token';

const router = express.Router();

router.route('/:date').get(getTokenMiddleware, getStorefrontByDate);
router.route('/').post(getTokenMiddleware, createStorefrontData);
router.route('/:id').delete(getTokenMiddleware, deleteStorefrontData);

export default router