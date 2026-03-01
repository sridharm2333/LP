import { Router } from 'express';
import {
  createComment,
  createCommentValidators,
  getComments,
  addWarmth,
  getTemplates,
} from '../controllers/commentController';
import { authMiddleware } from '../middleware';
import { toneCheckMiddleware } from '../middleware/moderation';

const router = Router();
router.get('/templates', authMiddleware, getTemplates);
router.get('/post/:postId', authMiddleware, getComments);
router.post('/post/:postId', authMiddleware, toneCheckMiddleware, createCommentValidators, createComment);
router.post('/:commentId/warmth', authMiddleware, addWarmth);
export default router;
