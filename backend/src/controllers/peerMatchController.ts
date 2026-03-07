import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware';
import { PeerMatch } from '../models';

const MATCH_DURATION_MS = 48 * 60 * 60 * 1000;

// POST /api/peer-match/request  { sharedTag: string }
export async function requestMatch(req: AuthenticatedRequest, res: Response): Promise<void> {
  if (!req.user) { res.status(401).json({ error: 'Not authenticated' }); return; }

  const { sharedTag } = req.body as { sharedTag: string };
  if (!sharedTag) { res.status(400).json({ error: 'sharedTag is required' }); return; }

  // Check if user already has a pending/active match
  const existing = await PeerMatch.findOne({
    $or: [{ userA: req.user.userId }, { userB: req.user.userId }],
    status: { $in: ['pending', 'active'] },
  });
  if (existing) {
    res.json({ match: existing });
    return;
  }

  // Look for an existing pending match with the same tag (not by this user)
  const waiting = await PeerMatch.findOne({
    sharedTag,
    status: 'pending',
    userA: { $ne: req.user.userId },
    userB: { $exists: false },
  });

  if (waiting) {
    const now = new Date();
    waiting.userB = req.user.userId as unknown as typeof waiting.userB;
    waiting.status = 'active';
    waiting.startedAt = now;
    waiting.endsAt = new Date(now.getTime() + MATCH_DURATION_MS);
    await waiting.save();
    res.json({ match: waiting });
    return;
  }

  // No match found — create a pending request
  const match = await PeerMatch.create({
    userA: req.user.userId,
    sharedTag,
    status: 'pending',
  });
  res.status(201).json({ match });
}

// GET /api/peer-match/my
export async function getMyMatch(req: AuthenticatedRequest, res: Response): Promise<void> {
  if (!req.user) { res.status(401).json({ error: 'Not authenticated' }); return; }

  const match = await PeerMatch.findOne({
    $or: [{ userA: req.user.userId }, { userB: req.user.userId }],
    status: { $in: ['pending', 'active'] },
  });
  res.json({ match: match ?? null });
}

// POST /api/peer-match/:matchId/end
export async function endMatch(req: AuthenticatedRequest, res: Response): Promise<void> {
  if (!req.user) { res.status(401).json({ error: 'Not authenticated' }); return; }

  const match = await PeerMatch.findById(req.params.matchId);
  if (!match) { res.status(404).json({ error: 'Match not found' }); return; }

  const uid = req.user.userId;
  const isParticipant =
    match.userA.toString() === uid ||
    (match.userB && match.userB.toString() === uid);

  if (!isParticipant) { res.status(403).json({ error: 'Forbidden' }); return; }

  match.status = 'ended';
  await match.save();
  res.json({ ok: true });
}
