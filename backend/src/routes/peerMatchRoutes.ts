import { Router } from 'express';
import { requestMatch, getMyMatch, endMatch } from '../controllers/peerMatchController';
import { authMiddleware } from '../middleware';

const router = Router();
router.post('/request', authMiddleware, requestMatch);
router.get('/my', authMiddleware, getMyMatch);
router.post('/:matchId/end', authMiddleware, endMatch);
export default router;
