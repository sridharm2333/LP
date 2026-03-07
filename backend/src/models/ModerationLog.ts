import mongoose, { Document, Schema, Types } from 'mongoose';

export type ModerationAction = 'post_removed' | 'comment_removed' | 'user_warned' | 'user_blocked';

export interface IModerationLog extends Document {
  userId: Types.ObjectId;
  action: ModerationAction;
  reason: string;
  contentId?: Types.ObjectId;  // post or comment that was acted on
  contentType?: 'post' | 'comment';
  appealAllowed: boolean;
  appealDeadline?: Date;
  createdAt: Date;
}

const ModerationLogSchema = new Schema<IModerationLog>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    action: {
      type: String,
      enum: ['post_removed', 'comment_removed', 'user_warned', 'user_blocked'],
      required: true,
    },
    reason: { type: String, required: true },
    contentId: Schema.Types.ObjectId,
    contentType: { type: String, enum: ['post', 'comment'] },
    appealAllowed: { type: Boolean, default: true },
    appealDeadline: Date,
  },
  { timestamps: true }
);

export const ModerationLog = mongoose.model<IModerationLog>('ModerationLog', ModerationLogSchema);
