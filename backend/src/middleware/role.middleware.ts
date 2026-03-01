import type { Request, Response, NextFunction } from 'express';
import type { UserRole } from '../interfaces/user.interface';
import { sendError } from '../utils/apiResponse';

export const authorize = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      sendError(res, 'Authentication required', 401);
      return;
    }

    if (!roles.includes(req.user.role)) {
      sendError(
        res,
        `Access denied. Required roles: ${roles.join(', ')}`,
        403
      );
      return;
    }

    next();
  };
};