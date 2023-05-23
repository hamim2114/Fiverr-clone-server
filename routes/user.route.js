import express from 'express';
import { verifyToken } from '../middleware/verify.token.js';
import { deleteUser, findUser } from '../controllers/user.controllers.js';

export const userRoute = express.Router();

userRoute.delete('/:id', verifyToken, deleteUser);

userRoute.get('/:id', findUser)