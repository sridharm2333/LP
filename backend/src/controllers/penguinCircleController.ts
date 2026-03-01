import mongoose from 'mongoose';
import { Response } from 'express';
import { createCircle, getActiveCircleForUser, dissolveExpiredCircles } from '../services/penguinCircle';
import { AuthenticatedRequest } from '../middleware';
import { containsDistressKeywords } from '../middleware/distress';

export async function checkDistress(req: AuthenticatedRequest, res: Response): Promise<void> {
  const text = (req.body?.text ?? req.body?.content ?? '') as string;
  const detected = containsDistressKeywords(text);
  res.json({ distressDetected: detected });
}

export async function requestCircle(req: AuthenticatedRequest, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }
  const userId = new mongoose.Types.ObjectId(req.user.userId);
  const existing = await getActiveCircleForUser(userId);
  if (existing) {
    res.json({ circle: existing, message: 'You already have an active Penguin Circle' });
    return;
  }
  const circle = await createCircle(userId);
  if (!circle) {
    res.status(503).json({ error: 'Not enough kind users available to form a circle. Try again later.' });
    return;
  }
  res.status(201).json({ circle });
}

export async function myCircle(req: AuthenticatedRequest, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }
  const userId = new mongoose.Types.ObjectId(req.user.userId);
  const circle = await getActiveCircleForUser(userId);
  res.json({ circle: circle ?? null });
}

export async function dissolveCircles(_req: AuthenticatedRequest, res: Response): Promise<void> {
  const count = await dissolveExpiredCircles();
  res.json({ dissolved: count });
}
