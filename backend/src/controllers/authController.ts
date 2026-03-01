import { Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import { config } from '../config';
import { User } from '../models';
import { AuthenticatedRequest } from '../middleware';

export const registerValidators = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }),
  body('displayName').trim().isLength({ min: 1, max: 50 }),
];

export async function register(req: AuthenticatedRequest, res: Response): Promise<void> {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }
  const { email, password, displayName } = req.body;
  const existing = await User.findOne({ email });
  if (existing) {
    res.status(409).json({ error: 'Email already registered' });
    return;
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ email, passwordHash, displayName });
  const token = jwt.sign(
    { userId: user._id.toString(), email: user.email },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn }
  );
  res.status(201).json({
    token,
    user: { id: user._id, email: user.email, displayName: user.displayName },
  });
}

export const loginValidators = [
  body('email').isEmail().normalizeEmail(),
  body('password').exists(),
];

export async function login(req: AuthenticatedRequest, res: Response): Promise<void> {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || user.isBlocked) {
    res.status(401).json({ error: 'Invalid email or password' });
    return;
  }
  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) {
    res.status(401).json({ error: 'Invalid email or password' });
    return;
  }
  const token = jwt.sign(
    { userId: user._id.toString(), email: user.email },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn }
  );
  res.json({
    token,
    user: { id: user._id, email: user.email, displayName: user.displayName },
  });
}

export async function me(req: AuthenticatedRequest, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }
  const user = await User.findById(req.user.userId)
    .select('-passwordHash')
    .lean();
  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }
  res.json(user);
}
