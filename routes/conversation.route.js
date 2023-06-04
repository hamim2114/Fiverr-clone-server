import express from 'express';
import { verifyToken } from '../middleware/verify.token.js';
import {
  createConversation,
  getConversations,
  getSingleConversation,
  updateConversation,
} from '../controllers/conversation.controllers.js';

export const conversationRoute = express.Router();

conversationRoute.get('/', verifyToken, getConversations);
conversationRoute.post('/', verifyToken, createConversation);
conversationRoute.get('/single/:id', verifyToken, getSingleConversation);
conversationRoute.put('/:id', verifyToken, updateConversation);
