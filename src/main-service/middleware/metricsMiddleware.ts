import { Request, Response, NextFunction } from 'express';
import { httpRequestDuration } from '../../shared/metrics';

export function metricsMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const start = Date.now();

  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    const route = req.route?.path || req.path;

    httpRequestDuration.observe(
      {
        method: req.method,
        route,
        status: res.statusCode.toString(),
        service: 'main-service',
      },
      duration
    );
  });

  next();
}
