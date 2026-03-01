import { Router } from 'express';
import { checkDistress, requestCircle, myCircle, dissolveCircles } from '../controllers/penguinCircleController';
import { authMiddleware } from '../middleware';

const router = Router();
router.post('/check-distress', authMiddleware, checkDistress);
router.post('/request', authMiddleware, requestCircle);
router.get('/my', authMiddleware, myCircle);
router.post('/dissolve-expired', authMiddleware, dissolveCircles);
export default router;
