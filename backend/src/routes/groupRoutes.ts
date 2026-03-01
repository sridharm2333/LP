import { Router } from 'express';
import {
  listGroups,
  joinGroup,
  getGroupFeed,
  createGroupPost,
  createGroupPostValidators,
} from '../controllers/groupController';
import { authMiddleware } from '../middleware';
import { aiModerationMiddleware } from '../middleware/moderation';

const router = Router();
router.get('/', authMiddleware, listGroups);
router.post('/:groupId/join', authMiddleware, joinGroup);
router.get('/:groupId/feed', authMiddleware, getGroupFeed);
router.post('/:groupId/posts', authMiddleware, aiModerationMiddleware, createGroupPostValidators, createGroupPost);
export default router;
