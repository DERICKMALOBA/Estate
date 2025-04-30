import jwt from 'jsonwebtoken';
import { errorHandler } from './Error.js';
import User from '../models/UserModel.js';

export const verifyToken = async (req, res, next) => {
  const token = req.cookies.access_token || req.headers['authorization']?.split(' ')[1];

  if (!token) return next(errorHandler(401, 'Unauthorized'));

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('_id username avatar');
    if (!user) return next(errorHandler(404, 'User not found'));

    req.user = user;
    next();
  } catch (err) {
    return next(errorHandler(403, 'Forbidden'));
  }
};
