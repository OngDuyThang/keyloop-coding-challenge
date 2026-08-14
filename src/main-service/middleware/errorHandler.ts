import { Request, Response, NextFunction } from 'express';
import logger from '../../shared/logger';
import { ErrorResponse } from '../../shared/types';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  const correlationId = req.correlationId || 'unknown';

  logger.error('Unhandled error', {
    correlationId,
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  const errorResponse: ErrorResponse = {
    error: 'Internal Server Error',
    message: 'An unexpected error occurred',
    timestamp: new Date().toISOString(),
  };

  res.status(500).json(errorResponse);
}
