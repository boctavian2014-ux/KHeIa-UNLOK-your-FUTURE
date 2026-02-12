import { Request, Response, NextFunction } from 'express';

/**
 * Validates a shared service token for server-to-server calls.
 */
export const serviceAuth = (req: Request, res: Response, next: NextFunction) => {
  const expected = process.env.SERVICE_TOKEN;
  const token = req.header('x-service-token');

  if (!expected || token !== expected) {
    res.status(401).json({ error: { code: 'unauthorized', message: 'Invalid token' } });
    return;
  }

  next();
};
