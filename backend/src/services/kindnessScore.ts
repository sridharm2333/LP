import mongoose from 'mongoose';
import { User, KindnessLog } from '../models';

const POINTS_PER_WARMTH = 1;
const POINTS_PER_SUPPORTIVE_COMMENT = 2;

export async function addKindnessPoints(
  userId: mongoose.Types.ObjectId,
  source: 'warmth_received' | 'supportive_comment',
  referenceId: mongoose.Types.ObjectId
): Promise<number> {
  const points = source === 'warmth_received' ? POINTS_PER_WARMTH : POINTS_PER_SUPPORTIVE_COMMENT;
  await KindnessLog.create({ userId, source, referenceId, points });
  const user = await User.findByIdAndUpdate(
    userId,
    { $inc: { kindnessScore: points } },
    { new: true }
  );
  return user?.kindnessScore ?? 0;
}

export async function getTopKindUsers(limit: number = 10): Promise<{ _id: mongoose.Types.ObjectId; kindnessScore: number }[]> {
  const list = await User.find({ isBlocked: false })
    .sort({ kindnessScore: -1 })
    .limit(limit)
    .select('_id kindnessScore')
    .lean();
  return list as { _id: mongoose.Types.ObjectId; kindnessScore: number }[];
}
