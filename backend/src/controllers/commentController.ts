import { Response } from 'express';
import mongoose from 'mongoose';
import { body, validationResult } from 'express-validator';
import { Comment, WarmthReaction, Post } from '../models';
import { addKindnessPoints } from '../services/kindnessScore';
import { AuthenticatedRequest } from '../middleware';
import { COMMENT_TEMPLATES } from '../constants/commentTemplates';

export const createCommentValidators = [
  body('content').trim().isLength({ min: 1, max: 500 }),
  body('usedTemplateId').optional().isString(),
];

export async function createComment(req: AuthenticatedRequest, res: Response): Promise<void> {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }
  if (!req.user) {
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }
  const postId = req.params.postId;
  if (!mongoose.Types.ObjectId.isValid(postId)) {
    res.status(400).json({ error: 'Invalid post ID' });
    return;
  }
  const post = await Post.findById(postId);
  if (!post) {
    res.status(404).json({ error: 'Post not found' });
    return;
  }
  const { content, usedTemplateId } = req.body;
  const comment = await Comment.create({
    postId,
    authorId: req.user.userId,
    content,
    usedTemplateId,
  });
  await addKindnessPoints(new mongoose.Types.ObjectId(req.user.userId), 'supportive_comment', comment._id);
  const populated = await comment.populate('authorId', 'displayName');
  res.status(201).json(populated);
}

export async function getComments(req: AuthenticatedRequest, res: Response): Promise<void> {
  const postId = req.params.postId;
  if (!mongoose.Types.ObjectId.isValid(postId)) {
    res.status(400).json({ error: 'Invalid post ID' });
    return;
  }
  const comments = await Comment.find({ postId }).sort({ createdAt: 1 }).populate('authorId', 'displayName').lean();
  res.json({ comments });
}

export async function addWarmth(req: AuthenticatedRequest, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }
  const commentId = req.params.commentId;
  if (!mongoose.Types.ObjectId.isValid(commentId)) {
    res.status(400).json({ error: 'Invalid comment ID' });
    return;
  }
  const comment = await Comment.findById(commentId);
  if (!comment) {
    res.status(404).json({ error: 'Comment not found' });
    return;
  }
  const existing = await WarmthReaction.findOne({ commentId, userId: req.user.userId });
  if (existing) {
    res.status(400).json({ error: 'Already sent warmth' });
    return;
  }
  await WarmthReaction.create({ commentId, userId: req.user.userId });
  await Comment.findByIdAndUpdate(commentId, { $inc: { warmthCount: 1 } });
  await addKindnessPoints(comment.authorId, 'warmth_received', comment._id);
  const updated = await Comment.findById(commentId).lean();
  res.json(updated);
}

export function getTemplates(_req: AuthenticatedRequest, res: Response): void {
  res.json({ templates: COMMENT_TEMPLATES });
}
