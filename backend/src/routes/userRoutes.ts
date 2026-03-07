import { Router } from 'express';
import {
  getProfile, updateProfile,
  companionMessage, recordCheckIn,
  getGuidedPrompts,
  softExitRequest, cancelSoftExit,
} from '../controllers/userController';
import { authMiddleware } from '../middleware';

const router = Router();
router.get('/profile', authMiddleware, getProfile);
router.patch('/profile', authMiddleware, updateProfile);
router.get('/companion-message', authMiddleware, companionMessage);
router.post('/check-in', authMiddleware, recordCheckIn);
router.get('/guided-prompts', authMiddleware, getGuidedPrompts);
router.post('/soft-exit', authMiddleware, softExitRequest);
router.post('/cancel-exit', authMiddleware, cancelSoftExit);
export default router;
