import { Response } from 'express';
import { User } from '../models';
import { AuthenticatedRequest } from '../middleware';

const COMPANION_MESSAGES = [
  "You're not alone. I'm here with you.",
  "It's okay to have hard days. Be gentle with yourself.",
  "Reaching out takes courage. I'm proud of you.",
  "One small step at a time. You're doing enough.",
  "Your feelings are valid. Hold space for yourself.",
];

export async function getProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
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

export async function updateProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }
  const { displayName, midnightOceanEnabled } = req.body;
  const update: Record<string, unknown> = {};
  if (typeof displayName === 'string' && displayName.trim()) update.displayName = displayName.trim();
  if (typeof midnightOceanEnabled === 'boolean') update.midnightOceanEnabled = midnightOceanEnabled;
  const user = await User.findByIdAndUpdate(req.user.userId, update, { new: true }).select('-passwordHash').lean();
  res.json(user);
}

export async function companionMessage(_req: AuthenticatedRequest, res: Response): Promise<void> {
  const message = COMPANION_MESSAGES[Math.floor(Math.random() * COMPANION_MESSAGES.length)];
  res.json({ message });
}

export async function recordCheckIn(req: AuthenticatedRequest, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }
  const user = await User.findById(req.user.userId);
  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }
  const now = new Date();
  const last = user.lastCheckInAt ? new Date(user.lastCheckInAt) : null;
  let streak = user.postingStreakDays ?? 0;
  if (last) {
    const dayDiff = Math.floor((now.getTime() - last.getTime()) / (24 * 60 * 60 * 1000));
    if (dayDiff === 0) {
      // same day, no change
    } else if (dayDiff === 1) {
      streak += 1;
    } else {
      streak = 1;
    }
  } else {
    streak = 1;
  }
  await User.findByIdAndUpdate(req.user.userId, {
    lastCheckInAt: now,
    postingStreakDays: streak,
  });
  res.json({ streak });
}
