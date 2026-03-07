import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware';
import { ModerationLog } from '../models';

// GET /api/moderation/my  — user sees their own log (transparency)
export async function getMyLog(req: AuthenticatedRequest, res: Response): Promise<void> {
  if (!req.user) { res.status(401).json({ error: 'Not authenticated' }); return; }

  const logs = await ModerationLog.find({ userId: req.user.userId })
    .sort({ createdAt: -1 })
    .lean();
  res.json({ logs });
}

// POST /api/moderation  — internal/admin: record a moderation action
export async function createLog(req: AuthenticatedRequest, res: Response): Promise<void> {
  const { userId, action, reason, contentId, contentType } = req.body;
  if (!userId || !action || !reason) {
    res.status(400).json({ error: 'userId, action and reason are required' });
    return;
  }

  const appealDeadline = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  const log = await ModerationLog.create({
    userId,
    action,
    reason,
    contentId,
    contentType,
    appealAllowed: true,
    appealDeadline,
  });
  res.status(201).json({ log });
}
