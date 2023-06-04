import express from 'express';
import { verifyToken } from '../middleware/verify.token.js';
import { confirm, getOrders, intent } from '../controllers/order.controllers.js';

export const orderRoute = express.Router();

// orderRoute.post('/:gigId', verifyToken, createOrder);

orderRoute.get('/', verifyToken, getOrders);

orderRoute.post('/create-payment-intent/:id', verifyToken, intent)

orderRoute.put('/', confirm)