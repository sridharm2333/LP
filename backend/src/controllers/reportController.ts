import { Response } from 'express';
import mongoose from 'mongoose';
import { body, validationResult } from 'express-validator';
import { Report } from '../models';
import { AuthenticatedRequest } from '../middleware';

export const reportValidators = [
  body('targetType').isIn(['post', 'comment', 'user']),
  body('targetId').isString(),
  body('reason').trim().isLength({ min: 1, max: 500 }),
];

export async function createReport(req: AuthenticatedRequest, res: Response): Promise<void> {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }
  if (!req.user) {
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }
  const { targetType, targetId, reason } = req.body;
  if (!mongoose.Types.ObjectId.isValid(targetId)) {
    res.status(400).json({ error: 'Invalid target ID' });
    return;
  }
  await Report.create({
    reporterId: req.user.userId,
    targetType,
    targetId,
    reason,
  });
  res.status(201).json({ message: 'Report submitted. Our team will review it.' });
}
