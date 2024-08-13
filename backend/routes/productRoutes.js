import express from 'express';
const router = express.Router();
import {getProduct , getProductById , createProduct , updateProduct , deleteProduct , createProductReview ,getTopProducts } from '../controllers/productController.js';
import { get } from 'http';
import { protect , admin } from '../middleware/authMiddleware.js';

router.route('/').get(getProduct).post( protect, admin ,createProduct);
router.route('/top').get(getTopProducts);

router.route('/:id').get(getProductById).put(protect, admin ,updateProduct).delete(protect, admin ,deleteProduct);

router.route('/:id/reviews').post(protect, createProductReview);
export default router;
 