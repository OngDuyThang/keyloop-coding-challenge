import { correlationIdMiddleware } from '../middleware/correlationId';
import { Request, Response, NextFunction } from 'express';

describe('Middleware Tests', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    req = { headers: {} };
    res = {
      setHeader: jest.fn().mockReturnThis(),
      set: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
  });

  describe('Correlation ID Middleware', () => {
    it('should generate correlation ID if not provided', () => {
      correlationIdMiddleware(req as Request, res as Response, next as NextFunction);

      expect((req as any).correlationId).toBeDefined();
      expect(res.setHeader).toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
    });

    it('should use existing correlation ID from headers', () => {
      const existingId = 'existing-correlation-id';
      req.headers = { 'x-correlation-id': existingId };

      correlationIdMiddleware(req as Request, res as Response, next as NextFunction);

      expect((req as any).correlationId).toBe(existingId);
      expect(next).toHaveBeenCalled();
    });

    it('should set correlation ID in response headers', () => {
      correlationIdMiddleware(req as Request, res as Response, next as NextFunction);

      expect(res.setHeader).toHaveBeenCalledWith('x-correlation-id', expect.any(String));
      expect(next).toHaveBeenCalled();
    });

    it('should generate UUID-format correlation ID', () => {
      correlationIdMiddleware(req as Request, res as Response, next as NextFunction);

      const correlationId = (req as any).correlationId;
      const uuidRegex = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/;
      expect(correlationId).toMatch(uuidRegex);
    });
  });
});
