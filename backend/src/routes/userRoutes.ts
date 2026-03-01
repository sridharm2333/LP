import { Router } from 'express';
import { getProfile, updateProfile, companionMessage, recordCheckIn } from '../controllers/userController';
import { authMiddleware } from '../middleware';

const router = Router();
router.get('/profile', authMiddleware, getProfile);
router.patch('/profile', authMiddleware, updateProfile);
router.get('/companion-message', authMiddleware, companionMessage);
router.post('/check-in', authMiddleware, recordCheckIn);
export default router;
