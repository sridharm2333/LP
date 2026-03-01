import { Router } from 'express';
import { createReport, reportValidators } from '../controllers/reportController';
import { authMiddleware } from '../middleware';

const router = Router();
router.post('/', authMiddleware, reportValidators, createReport);
export default router;
