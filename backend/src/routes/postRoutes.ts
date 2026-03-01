import { Router } from 'express';
import { createPost, createPostValidators, getFeed, getMyPosts, getPostById } from '../controllers/postController';
import { authMiddleware } from '../middleware';
import { aiModerationMiddleware } from '../middleware/moderation';

const router = Router();
router.get('/', authMiddleware, getFeed);
router.get('/my', authMiddleware, getMyPosts);
router.get('/:id', authMiddleware, getPostById);
router.post('/', authMiddleware, aiModerationMiddleware, createPostValidators, createPost);
export default router;
