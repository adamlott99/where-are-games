import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ApiResponse } from '../types';

interface AuthenticatedRequest extends Request {
  user?: any;
}

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    const response: ApiResponse = {
      success: false,
      error: 'Access token required'
    };
    res.status(401).json(response);
    return;
  }

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    const response: ApiResponse = {
      success: false,
      error: 'Server configuration error'
    };
    res.status(500).json(response);
    return;
  }

  jwt.verify(token, jwtSecret, (err, user) => {
    if (err) {
      const response: ApiResponse = {
        success: false,
        error: 'Invalid or expired token'
      };
      res.status(403).json(response);
      return;
    }

    req.user = user;
    next();
  });
};
