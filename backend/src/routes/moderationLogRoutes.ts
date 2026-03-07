import { Router } from 'express';
import { getMyLog, createLog } from '../controllers/moderationLogController';
import { authMiddleware } from '../middleware';

const router = Router();
router.get('/my', authMiddleware, getMyLog);
router.post('/', authMiddleware, createLog);  // admin use
export default router;
