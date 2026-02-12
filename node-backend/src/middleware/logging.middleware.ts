import { Request, Response, NextFunction } from 'express';

/**
 * Minimal request logger.
 */
export const requestLogger = (req: Request, _res: Response, next: NextFunction) => {
  // eslint-disable-next-line no-console
  console.log(`${req.method} ${req.url}`);
  next();
};
