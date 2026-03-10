import { Router } from 'express';
import { requestMatch, getMyMatch, endMatch } from '../controllers/peerMatchController';
import { sendMessage, getMessages } from '../controllers/matchMessageController';
import { authMiddleware } from '../middleware';

const router = Router();
router.post('/request', authMiddleware, requestMatch);
router.get('/my', authMiddleware, getMyMatch);
router.post('/:matchId/end', authMiddleware, endMatch);
// Peer chat
router.post('/:matchId/messages', authMiddleware, sendMessage);
router.get('/:matchId/messages', authMiddleware, getMessages);
export default router;
