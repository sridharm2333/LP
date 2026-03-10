import { Response } from 'express';
import { MoodEntry } from '../models';
import { AuthenticatedRequest } from '../middleware';

export const MOOD_EMOJI: Record<string, string> = {
  great: '😊',
  okay: '😐',
  rough: '😔',
  terrible: '😢',
};

// POST /api/mood  { mood, note? }
export async function logMood(req: AuthenticatedRequest, res: Response): Promise<void> {
  if (!req.user) { res.status(401).json({ error: 'Not authenticated' }); return; }

  const { mood, note } = req.body as { mood: string; note?: string };
  const validMoods = ['great', 'okay', 'rough', 'terrible'];
  if (!validMoods.includes(mood)) {
    res.status(400).json({ error: 'mood must be one of: great, okay, rough, terrible' });
    return;
  }

  const entry = await MoodEntry.create({
    userId: req.user.userId,
    mood,
    note: note?.trim().slice(0, 300),
  });

  res.status(201).json({ entry });
}

// GET /api/mood/recent  → last 7 entries (one per day ideally)
export async function getRecentMoods(req: AuthenticatedRequest, res: Response): Promise<void> {
  if (!req.user) { res.status(401).json({ error: 'Not authenticated' }); return; }

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const entries = await MoodEntry.find({
    userId: req.user.userId,
    createdAt: { $gte: sevenDaysAgo },
  })
    .sort({ createdAt: -1 })
    .limit(7)
    .lean();

  res.json({ entries });
}
