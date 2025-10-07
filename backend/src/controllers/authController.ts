import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { LoginRequest, LoginResponse, ApiResponse } from '../types';

export const login = (req: Request, res: Response): void => {
  const { password }: LoginRequest = req.body;
  const sitePassword = process.env.SITE_PASSWORD;

  if (!sitePassword) {
    const response: ApiResponse = {
      success: false,
      error: 'Server configuration error'
    };
    res.status(500).json(response);
    return;
  }

  if (password !== sitePassword) {
    const response: ApiResponse = {
      success: false,
      error: 'Invalid password'
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

  const token = jwt.sign({ authenticated: true }, jwtSecret, { expiresIn: '24h' });
  
  const response: ApiResponse<LoginResponse> = {
    success: true,
    data: {
      token,
      message: 'Login successful'
    }
  };

  res.json(response);
};
