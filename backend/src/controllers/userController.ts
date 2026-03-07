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

const GUIDED_PROMPTS = [
  "What's one thing that felt heavy today?",
  "Describe a moment this week where you felt even a little okay.",
  "What would you tell a friend going through what you're going through?",
  "What does your body need right now — rest, movement, connection?",
  "What's one small thing you can do for yourself today?",
  "If your sadness had a colour, what would it be right now?",
  "What's something you're holding that you wish you could put down?",
  "When did you last feel genuinely seen by someone?",
  "What does 'healing' mean to you right now?",
  "What are you most afraid of, and what would it mean if it came true?",
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
  const { midnightOceanEnabled } = req.body;
  const update: Record<string, unknown> = {};
  if (typeof midnightOceanEnabled === 'boolean') update.midnightOceanEnabled = midnightOceanEnabled;
  const user = await User.findByIdAndUpdate(req.user.userId, update, { new: true }).select('-passwordHash').lean();
  res.json(user);
}

export async function companionMessage(_req: AuthenticatedRequest, res: Response): Promise<void> {
  const message = COMPANION_MESSAGES[Math.floor(Math.random() * COMPANION_MESSAGES.length)];
  res.json({ message });
}

export async function getGuidedPrompts(_req: AuthenticatedRequest, res: Response): Promise<void> {
  // Return 3 random prompts
  const shuffled = [...GUIDED_PROMPTS].sort(() => Math.random() - 0.5);
  res.json({ prompts: shuffled.slice(0, 3) });
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

// ── Soft Exit ─────────────────────────────────────────────────────────────────
// Stage 1: user requests deletion → 14-day grace period, shows gentle message
export async function softExitRequest(req: AuthenticatedRequest, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }
  await User.findByIdAndUpdate(req.user.userId, {
    softExitRequestedAt: new Date(),
  });
  res.json({
    message: "We'll hold your account for 14 days in case you change your mind. You can cancel any time by signing back in.",
    deletionDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
  });
}

// Stage 2: cancel soft exit (user signed back in or changed mind)
export async function cancelSoftExit(req: AuthenticatedRequest, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }
  await User.findByIdAndUpdate(req.user.userId, {
    $unset: { softExitRequestedAt: '' },
  });
  res.json({ message: 'Account deletion cancelled. Welcome back 🐧' });
}
