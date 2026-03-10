import { Response } from 'express';
import mongoose from 'mongoose';
import { body, validationResult } from 'express-validator';
import { Post, Comment } from '../models';
import { AuthenticatedRequest } from '../middleware';
import { containsDistressKeywords, CRISIS_GROUNDING_MESSAGE } from '../middleware/distress';

const EMOTION_TAGS = ['sad', 'anxious', 'lonely', 'grief', 'heartbreak', 'hopeful', 'grateful', 'other'];

export const createPostValidators = [
  body('content').trim().isLength({ min: 1, max: 2000 }),
  body('isAnonymous').optional().isBoolean(),
  body('emotionTags').optional().isArray(),
  body('emotionTags.*').isIn(EMOTION_TAGS),
  body('moodEmoji').optional().isString().isLength({ max: 10 }),
  body('isUrgent').optional().isBoolean(),
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
  const { content, isAnonymous = false, emotionTags = [], moodEmoji, isUrgent = false } = req.body;
  const post = await Post.create({
    authorId: req.user.userId,
    isAnonymous,
    content,
    emotionTags,
    moodEmoji,
    isUrgent,
  });
  const hasDistress = containsDistressKeywords(content);
  res.status(201).json({
    post: await post.populate('authorId', 'username'),
    groundingMessage: hasDistress ? CRISIS_GROUNDING_MESSAGE : undefined,
  });
}

export async function getFeed(req: AuthenticatedRequest, res: Response): Promise<void> {
  const limit = Math.min(parseInt(req.query.limit as string) || 20, 50);
  const skip = parseInt(req.query.skip as string) || 0;

  // Urgent posts always float to the top, then newest first
  const posts = await Post.find()
    .sort({ isUrgent: -1, createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('authorId', 'username')
    .lean();

  const postIds = posts.map((p) => (p as Record<string, unknown>)._id as mongoose.Types.ObjectId);
  const commentCounts = await Comment.aggregate([
    { $match: { postId: { $in: postIds } } },
    { $group: { _id: '$postId', count: { $sum: 1 } } },
  ]);
  const countMap: Record<string, number> = {};
  for (const c of commentCounts) countMap[c._id.toString()] = c.count;

  const feed = posts.map((p: Record<string, unknown>) => ({
    ...p,
    authorUsername: p.isAnonymous ? undefined : (p.authorId as { username?: string })?.username,
    authorId: p.isAnonymous ? undefined : p.authorId,
    commentCount: countMap[(p._id as mongoose.Types.ObjectId).toString()] ?? 0,
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
  const post = await Post.findById(id).populate('authorId', 'username').lean();
  if (!post) {
    res.status(404).json({ error: 'Post not found' });
    return;
  }
  const commentCount = await Comment.countDocuments({ postId: id });
  const out = {
    ...post,
    authorUsername: (post as { isAnonymous?: boolean }).isAnonymous
      ? undefined
      : (post.authorId as { username?: string })?.username,
    commentCount,
  };
  if ((post as { isAnonymous?: boolean }).isAnonymous) (out as Record<string, unknown>).authorId = undefined;
  res.json(out);
}
