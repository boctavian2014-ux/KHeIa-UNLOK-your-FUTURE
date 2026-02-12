import { Request, Response, NextFunction } from 'express';
import { allowRequest } from '../services/ratelimit.service';

/**
 * Simple rate limit middleware.
 */
export const rateLimit = (req: Request, res: Response, next: NextFunction) => {
  const key = req.ip ?? 'unknown';

  if (!allowRequest(key)) {
    res.status(429).json({ error: { code: 'rate_limited', message: 'Too many requests' } });
    return;
  }

  next();
};
