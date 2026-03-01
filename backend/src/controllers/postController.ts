import { Response } from 'express';
import mongoose from 'mongoose';
import { body, validationResult } from 'express-validator';
import { Post } from '../models';
import { AuthenticatedRequest } from '../middleware';
import { containsDistressKeywords, CRISIS_GROUNDING_MESSAGE } from '../middleware/distress';

const EMOTION_TAGS = ['sad', 'anxious', 'lonely', 'grief', 'heartbreak', 'hopeful', 'grateful', 'other'];

export const createPostValidators = [
  body('content').trim().isLength({ min: 1, max: 2000 }),
  body('isAnonymous').optional().isBoolean(),
  body('emotionTags').optional().isArray(),
  body('emotionTags.*').isIn(EMOTION_TAGS),
  body('moodEmoji').optional().isString().isLength({ max: 10 }),
];

export async function createPost(req: AuthenticatedRequest, res: Response): Promise<void> {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }
  if (!req.user) {
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }
  const { content, isAnonymous = false, emotionTags = [], moodEmoji } = req.body;
  const post = await Post.create({
    authorId: req.user.userId,
    isAnonymous,
    content,
    emotionTags,
    moodEmoji,
  });
  const hasDistress = containsDistressKeywords(content);
  res.status(201).json({
    post: await post.populate('authorId', 'displayName'),
    groundingMessage: hasDistress ? CRISIS_GROUNDING_MESSAGE : undefined,
  });
}

export async function getFeed(req: AuthenticatedRequest, res: Response): Promise<void> {
  const limit = Math.min(parseInt(req.query.limit as string) || 20, 50);
  const skip = parseInt(req.query.skip as string) || 0;
  const posts = await Post.find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('authorId', 'displayName')
    .lean();
  const feed = posts.map((p: Record<string, unknown>) => ({
    ...p,
    authorName: (p.authorId as { displayName?: string })?.displayName ?? (p.isAnonymous ? 'Anonymous' : 'Unknown'),
    authorId: p.isAnonymous ? undefined : p.authorId,
  }));
  res.json({ posts: feed });
}

export async function getMyPosts(req: AuthenticatedRequest, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }
  const posts = await Post.find({ authorId: req.user.userId }).sort({ createdAt: -1 }).lean();
  res.json({ posts });
}

export async function getPostById(req: AuthenticatedRequest, res: Response): Promise<void> {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ error: 'Invalid post ID' });
    return;
  }
  const post = await Post.findById(id).populate('authorId', 'displayName').lean();
  if (!post) {
    res.status(404).json({ error: 'Post not found' });
    return;
  }
  const out = { ...post, authorName: (post.authorId as { displayName?: string })?.displayName ?? 'Anonymous' };
  if ((post as { isAnonymous?: boolean }).isAnonymous) (out as Record<string, unknown>).authorId = undefined;
  res.json(out);
}
