import { Router } from 'express';
import type { Request, Response, NextFunction } from 'express';
import { applicationController } from '../controllers/application.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/role.middleware';

const router = Router();

// Candidate routes
router.post('/:jobId', authenticate, authorize('candidate'), (req: Request, res: Response, next: NextFunction) => {
  void applicationController.apply(req, res, next);
});

router.get('/my-applications', authenticate, authorize('candidate'), (req: Request, res: Response, next: NextFunction) => {
  void applicationController.getMyApplications(req, res, next);
});

// Company routes
router.get('/job/:jobId', authenticate, authorize('company'), (req: Request, res: Response, next: NextFunction) => {
  void applicationController.getJobApplicants(req, res, next);
});

router.put('/:id/status', authenticate, authorize('company'), (req: Request, res: Response, next: NextFunction) => {
  void applicationController.updateStatus(req, res, next);
});

export default router;