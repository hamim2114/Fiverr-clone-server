import express from 'express';
import { verifyToken } from '../middleware/verify.token.js';
import {
  createMessage,
  getMessages,
} from '../controllers/message.controllers.js';

export const messageRoute = express.Router();

messageRoute.post('/', verifyToken, createMessage);

messageRoute.get('/:id', verifyToken, getMessages);
