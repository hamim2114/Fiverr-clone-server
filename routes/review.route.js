import express from 'express';
import { verifyToken } from '../middleware/verify.token.js';
import { addReview, getReviews } from '../controllers/review.controllers.js';

export const reviewRoute = express.Router();

reviewRoute.post('/', verifyToken, addReview)

reviewRoute.get('/:id', getReviews)