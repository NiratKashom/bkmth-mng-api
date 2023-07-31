import { Request, Response, NextFunction } from 'express';

export function errorHandlerMiddleware(err: Error, req: Request, res: Response, next: NextFunction) {
  if (res.headersSent) {
    return next(err);
  }

  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: err.stack,
  });
}

export function notFoundMiddleware(req: Request, res: Response, next: NextFunction) {
  res.status(404);
  const error = new Error(`- Not Found - ${req.originalUrl}`);
  next(error);
}
