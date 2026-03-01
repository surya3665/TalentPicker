import { Router } from 'express';
import { adminController } from '../controllers/admin.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/role.middleware';

const router = Router();

// All admin routes protected
router.use(authenticate, authorize('admin'));

router.get('/stats', (req, res, next) => {
  void adminController.getStats(req, res, next);
});

router.get('/users', (req, res, next) => {
  void adminController.getAllUsers(req, res, next);
});

router.delete('/users/:id', (req, res, next) => {
  void adminController.deleteUser(req, res, next);
});

router.put('/companies/:id/approve', (req, res, next) => {
  void adminController.approveCompany(req, res, next);
});

router.get('/jobs', (req, res, next) => {
  void adminController.getAllJobs(req, res, next);
});

router.delete('/jobs/:id', (req, res, next) => {
  void adminController.deleteJob(req, res, next);
});

export default router;