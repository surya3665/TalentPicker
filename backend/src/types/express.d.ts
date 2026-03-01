import type { UserRole } from '../interfaces/user.interface';

export interface AuthPayload {
  userId: string;
  role: UserRole;
  email: string;
}

// Augment Express Request
declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}