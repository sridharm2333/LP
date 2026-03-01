import mongoose from 'mongoose';
import { PenguinCircle } from '../models';
import { getTopKindUsers } from './kindnessScore';

const CIRCLE_MIN_MEMBERS = 5;
const CIRCLE_MAX_MEMBERS = 10;
const CIRCLE_DURATION_HOURS = 24;

export interface IPenguinCircleDoc {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  memberIds: mongoose.Types.ObjectId[];
  status: string;
  expiresAt: Date;
}

export async function createCircle(userId: mongoose.Types.ObjectId): Promise<IPenguinCircleDoc | null> {
  const top = await getTopKindUsers(CIRCLE_MAX_MEMBERS);
  const exclude = new Set([userId.toString()]);
  const memberIds = top
    .filter((u) => !exclude.has(u._id.toString()))
    .slice(0, CIRCLE_MAX_MEMBERS)
    .map((u) => u._id);

  if (memberIds.length < CIRCLE_MIN_MEMBERS) {
    return null;
  }

  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + CIRCLE_DURATION_HOURS);

  const circle = await PenguinCircle.create({
    userId,
    memberIds,
    status: 'active',
    consentedAt: new Date(),
    expiresAt,
  });
  return circle as IPenguinCircleDoc;
}

export async function dissolveExpiredCircles(): Promise<number> {
  const result = await PenguinCircle.updateMany(
    { status: 'active', expiresAt: { $lte: new Date() } },
    { status: 'dissolved' }
  );
  return result.modifiedCount;
}

export async function getActiveCircleForUser(userId: mongoose.Types.ObjectId): Promise<IPenguinCircleDoc | null> {
  const circle = await PenguinCircle.findOne({
    userId,
    status: 'active',
    expiresAt: { $gt: new Date() },
  }).lean();
  return circle as IPenguinCircleDoc | null;
}
