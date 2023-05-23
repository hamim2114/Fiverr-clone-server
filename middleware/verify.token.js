import { createError } from '../utils/error.handler.js';
import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) return next(createError(401, 'you are not authenticated!'));

  jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err) return next(createError(403, 'token invalid!'));
    req.userId = payload.id;
    req.isSeller = payload.isSeller;
    next();
  });
};
