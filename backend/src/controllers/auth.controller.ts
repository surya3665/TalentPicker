import type { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import { sendSuccess } from '../utils/apiResponse';
import type { RegisterDTO, LoginDTO, UpdateProfileDTO } from '../types/auth.dto';

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      console.log('✅ REGISTER HIT - body:', req.body);
      const dto = req.body as RegisterDTO;
      const result = await authService.register(dto);
      sendSuccess(res, 'Registration successful', result, 201);
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      console.log('✅ LOGIN HIT - body:', req.body);
      const dto = req.body as LoginDTO;
      const result = await authService.login(dto);
      sendSuccess(res, 'Login successful', result);
    } catch (error) {
      next(error);
    }
  }

  async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const user = await authService.getProfile(userId);
      sendSuccess(res, 'Profile retrieved', user);
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const dto = req.body as UpdateProfileDTO;
      const user = await authService.updateProfile(userId, dto);
      sendSuccess(res, 'Profile updated', user);
    } catch (error) {
      next(error);
    }
  }

  async uploadResume(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({ success: false, message: 'No file uploaded' });
        return;
      }
      const userId = req.user!.userId;
      const user = await authService.uploadResume(userId, req.file.filename);
      sendSuccess(res, 'Resume uploaded successfully', user);
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();