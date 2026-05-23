import jwt from 'jsonwebtoken';
import asyncHandler from '../utils/asyncHandler.js';
import User from '../models/User.js';

export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer')) {
    [, token] = req.headers.authorization.split(' ');
  }

  if (!token) {
    res.status(401);
    throw new Error('Please log in to continue');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      res.status(401);
      throw new Error('User account not found');
    }

    if (!user.isActive) {
      res.status(401);
      throw new Error('This account has been disabled');
    }

    req.user = user;
    next();
  } catch {
    res.status(401);
    throw new Error('Session expired or invalid — please log in again');
  }
});

export const authorize =
  (...roles) =>
  asyncHandler(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      res.status(403);
      throw new Error('You do not have permission for this action');
    }
    next();
  });
