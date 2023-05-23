import express from 'express';
import { verifyToken } from '../middleware/verify.token.js';
import {
  createGig,
  deleteGig,
  getGig,
  getGigs,
} from '../controllers/gig.controllers.js';

export const gigRoute = express.Router();

gigRoute.post('/', verifyToken, createGig);

gigRoute.delete('/:id', verifyToken, deleteGig);

gigRoute.get('/single/:id', getGig);

gigRoute.get('/', getGigs);
