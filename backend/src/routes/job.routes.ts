import { Router } from 'express';
import type { Request, Response, NextFunction } from 'express';
import { jobController } from '../controllers/job.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/role.middleware';
import { createJobValidation } from '../middleware/validation.middleware';

const router = Router();

// Public routes
router.get('/', (req: Request, res: Response, next: NextFunction) => {
  void jobController.getJobs(req, res, next);
});

router.get('/:id', (req: Request, res: Response, next: NextFunction) => {
  void jobController.getJobById(req, res, next);
});

// Company routes
router.post('/', authenticate, authorize('company'), createJobValidation, (req: Request, res: Response, next: NextFunction) => {
  void jobController.createJob(req, res, next);
});

router.put('/:id', authenticate, authorize('company'), (req: Request, res: Response, next: NextFunction) => {
  void jobController.updateJob(req, res, next);
});

router.delete('/:id', authenticate, authorize('company'), (req: Request, res: Response, next: NextFunction) => {
  void jobController.deleteJob(req, res, next);
});

router.get('/company/my-jobs', authenticate, authorize('company'), (req: Request, res: Response, next: NextFunction) => {
  void jobController.getMyJobs(req, res, next);
});

export default router;