import { Router } from 'express';
import type { Request, Response, NextFunction } from 'express';
import { authController } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/role.middleware';
import { registerValidation, loginValidation } from '../middleware/validation.middleware';
import { uploadResume } from '../utils/multer';

const router = Router();

router.post('/register', registerValidation, (req: Request, res: Response, next: NextFunction) => {
  void authController.register(req, res, next);
});

router.post('/login', loginValidation, (req: Request, res: Response, next: NextFunction) => {
  void authController.login(req, res, next);
});

router.get('/profile', authenticate, (req: Request, res: Response, next: NextFunction) => {
  void authController.getProfile(req, res, next);
});

router.put('/profile', authenticate, (req: Request, res: Response, next: NextFunction) => {
  void authController.updateProfile(req, res, next);
});

router.post(
  '/upload-resume',
  authenticate,
  authorize('candidate'),
  uploadResume.single('resume'),
  (req: Request, res: Response, next: NextFunction) => {
    void authController.uploadResume(req, res, next);
  }
);

export default router;