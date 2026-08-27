import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof ZodError) {
    const issues = err.errors.map((e) => e.message).join(', ');
    res.status(400).json({
      success: false,
      error: `Validation error: ${issues}`,
    });
    return;
  }

  const errorMessage = err instanceof Error ? err.message : 'Internal server error';
  console.error('Server error:', err);

  res.status(500).json({
    success: false,
    error: errorMessage,
  });
};
