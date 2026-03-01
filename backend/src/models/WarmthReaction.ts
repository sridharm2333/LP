import mongoose, { Document, Schema } from 'mongoose';

export interface IWarmthReaction extends Document {
  commentId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
}

const WarmthReactionSchema = new Schema<IWarmthReaction>(
  {
    commentId: { type: Schema.Types.ObjectId, ref: 'Comment', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

WarmthReactionSchema.index({ commentId: 1, userId: 1 }, { unique: true });

export const WarmthReaction = mongoose.model<IWarmthReaction>('WarmthReaction', WarmthReactionSchema);
