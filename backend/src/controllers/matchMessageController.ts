import { Response } from 'express';
import { MatchMessage, PeerMatch } from '../models';
import { AuthenticatedRequest } from '../middleware';

// Verify the requesting user is part of the match
async function verifyParticipant(matchId: string, userId: string) {
  const match = await PeerMatch.findById(matchId);
  if (!match) return null;
  const isParticipant =
    match.userA.toString() === userId ||
    (match.userB && match.userB.toString() === userId);
  return isParticipant ? match : null;
}

// POST /api/peer-match/:matchId/messages  { content }
export async function sendMessage(req: AuthenticatedRequest, res: Response): Promise<void> {
  if (!req.user) { res.status(401).json({ error: 'Not authenticated' }); return; }

  const match = await verifyParticipant(req.params.matchId, req.user.userId);
  if (!match) { res.status(403).json({ error: 'Not part of this match' }); return; }
  if (match.status === 'ended') { res.status(400).json({ error: 'This match has ended' }); return; }

  const { content } = req.body as { content: string };
  if (!content?.trim()) { res.status(400).json({ error: 'Message cannot be empty' }); return; }

  const message = await MatchMessage.create({
    matchId: match._id,
    senderId: req.user.userId,
    content: content.trim().slice(0, 1000),
  });

  res.status(201).json({ message });
}

// GET /api/peer-match/:matchId/messages
export async function getMessages(req: AuthenticatedRequest, res: Response): Promise<void> {
  if (!req.user) { res.status(401).json({ error: 'Not authenticated' }); return; }

  const match = await verifyParticipant(req.params.matchId, req.user.userId);
  if (!match) { res.status(403).json({ error: 'Not part of this match' }); return; }

  const messages = await MatchMessage.find({ matchId: match._id })
    .sort({ createdAt: 1 })
    .lean();

  res.json({ messages, myUserId: req.user.userId });
}
