import { Router } from 'express';
import {
  register, registerValidators,
  login, loginValidators,
  oauthLogin,
  me,
} from '../controllers/authController';
import { authMiddleware } from '../middleware';

const router = Router();
router.post('/register', registerValidators, register);
router.post('/login', loginValidators, login);
router.post('/oauth', oauthLogin);
router.get('/me', authMiddleware, me);
export default router;
