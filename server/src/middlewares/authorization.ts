import { verifyToken } from '@/utils/jwt';
import { NextFunction, Request, Response } from 'express';
// Authentication Middleware
export const auth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    res.status(401).json({ message: 'Access denied' });
    return;
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ message: 'Invalid token' });
  }
};

// Authorization Middleware
export const authorize =
  (roles: string[]) => (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user?.role!)) {
      res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
      return;
    }
    next();
  };
