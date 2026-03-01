import { Response } from 'express';
import mongoose from 'mongoose';
import { body, validationResult } from 'express-validator';
import { Group, GroupMember, GroupPost } from '../models';
import { AuthenticatedRequest } from '../middleware';

export async function listGroups(_req: AuthenticatedRequest, res: Response): Promise<void> {
  const groups = await Group.find().sort({ topic: 1 }).lean();
  res.json({ groups });
}

export async function joinGroup(req: AuthenticatedRequest, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }
  const groupId = req.params.groupId;
  if (!mongoose.Types.ObjectId.isValid(groupId)) {
    res.status(400).json({ error: 'Invalid group ID' });
    return;
  }
  const group = await Group.findById(groupId);
  if (!group) {
    res.status(404).json({ error: 'Group not found' });
    return;
  }
  await GroupMember.findOneAndUpdate(
    { groupId, userId: req.user.userId },
    {},
    { upsert: true }
  );
  res.json({ joined: true });
}

export async function getGroupFeed(req: AuthenticatedRequest, res: Response): Promise<void> {
  const groupId = req.params.groupId;
  if (!mongoose.Types.ObjectId.isValid(groupId)) {
    res.status(400).json({ error: 'Invalid group ID' });
    return;
  }
  const limit = Math.min(parseInt(req.query.limit as string) || 20, 50);
  const posts = await GroupPost.find({ groupId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('authorId', 'displayName')
    .lean();
  const feed = posts.map((p: Record<string, unknown>) => ({
    ...p,
    authorName: (p.authorId as { displayName?: string })?.displayName ?? ((p.isAnonymous && 'Anonymous') || 'Unknown'),
  }));
  res.json({ posts: feed });
}

export const createGroupPostValidators = [
  body('content').trim().isLength({ min: 1, max: 2000 }),
  body('isAnonymous').optional().isBoolean(),
  body('emotionTags').optional().isArray(),
];

export async function createGroupPost(req: AuthenticatedRequest, res: Response): Promise<void> {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }
  if (!req.user) {
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }
  const groupId = req.params.groupId;
  if (!mongoose.Types.ObjectId.isValid(groupId)) {
    res.status(400).json({ error: 'Invalid group ID' });
    return;
  }
  const { content, isAnonymous = false, emotionTags = [] } = req.body;
  const post = await GroupPost.create({
    groupId,
    authorId: req.user.userId,
    isAnonymous,
    content,
    emotionTags,
  });
  const populated = await post.populate('authorId', 'displayName');
  res.status(201).json(populated);
}
