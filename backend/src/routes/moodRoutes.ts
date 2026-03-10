import { Router } from 'express';
import { logMood, getRecentMoods } from '../controllers/moodController';
import { authMiddleware } from '../middleware';

const router = Router();
router.post('/', authMiddleware, logMood);
router.get('/recent', authMiddleware, getRecentMoods);
export default router;
