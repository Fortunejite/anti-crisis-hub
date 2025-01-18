import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

interface CustomError extends Error {
  statusCode?: number;
}

export default function errorHandler(
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  console.error(`[ERROR] ${err.message}`);

  if (err instanceof ZodError) {
    console.error('Validation error:', err);
    return res.status(400).json({ message: err.issues[0].message });
  }
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
}
