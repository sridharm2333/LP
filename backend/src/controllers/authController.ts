import { Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import { config } from '../config';
import { User } from '../models';
import { AuthenticatedRequest } from '../middleware';
import { generateUsername } from '../services/usernameGenerator';

function signToken(userId: string, email: string): string {
  return jwt.sign(
    { userId, email },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn }
  );
}

// ── Email registration ──────────────────────────────────────────────────────

export const registerValidators = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }),
];

export async function register(req: AuthenticatedRequest, res: Response): Promise<void> {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }
  const { email, password } = req.body;
  const existing = await User.findOne({ email });
  if (existing) {
    res.status(409).json({ error: 'Email already registered' });
    return;
  }
  const passwordHash = await bcrypt.hash(password, 10);

  let username = generateUsername();
  while (await User.exists({ username })) {
    username = generateUsername();
  }

  const user = await User.create({ email, passwordHash, username, loginProvider: 'email' });
  const token = signToken(user._id.toString(), user.email);
  res.status(201).json({
    token,
    user: { id: user._id, email: user.email, username: user.username },
  });
}

// ── Email login ─────────────────────────────────────────────────────────────

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
  if (!user.passwordHash) {
    res.status(400).json({ error: 'This account uses social login. Please sign in with Google or Apple.' });
    return;
  }
  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) {
    res.status(401).json({ error: 'Invalid email or password' });
    return;
  }
  const token = signToken(user._id.toString(), user.email);
  res.json({
    token,
    user: { id: user._id, email: user.email, username: user.username },
  });
}

// ── OAuth (Google / Apple) ──────────────────────────────────────────────────
// Stub: in production verify id_token server-side with Google/Apple SDK.
// Client sends: { provider, oauthId, email }

export async function oauthLogin(req: AuthenticatedRequest, res: Response): Promise<void> {
  const { provider, oauthId, email } = req.body as {
    provider: 'google' | 'apple';
    oauthId: string;
    email: string;
  };

  if (!provider || !oauthId || !email) {
    res.status(400).json({ error: 'provider, oauthId and email are required' });
    return;
  }

  let user = await User.findOne({ oauthId, loginProvider: provider });
  if (!user) user = await User.findOne({ email });

  if (user && user.isBlocked) {
    res.status(403).json({ error: 'Account suspended' });
    return;
  }

  if (!user) {
    let username = generateUsername();
    while (await User.exists({ username })) {
      username = generateUsername();
    }
    user = await User.create({ email, oauthId, username, loginProvider: provider });
  } else if (!user.oauthId) {
    await User.findByIdAndUpdate(user._id, { oauthId, loginProvider: provider });
  }

  const token = signToken(user._id.toString(), user.email);
  res.json({
    token,
    user: { id: user._id, email: user.email, username: user.username },
  });
}

// ── Me ───────────────────────────────────────────────────────────────────────

export async function me(req: AuthenticatedRequest, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }
  const user = await User.findById(req.user.userId).select('-passwordHash').lean();
  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }
  res.json(user);
}
