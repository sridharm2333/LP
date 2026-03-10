import mongoose, { Document, Schema } from 'mongoose';

export type EmotionTag = 'sad' | 'anxious' | 'lonely' | 'grief' | 'heartbreak' | 'hopeful' | 'grateful' | 'other';

export interface IPost extends Document {
  authorId: mongoose.Types.ObjectId;
  isAnonymous: boolean;
  content: string;
  emotionTags: EmotionTag[];
  moodEmoji?: string;
  isUrgent: boolean;       // "I need support now" — floats to top of feed
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new Schema<IPost>(
  {
    authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    isAnonymous: { type: Boolean, default: false },
    content: { type: String, required: true },
    emotionTags: [{ type: String, enum: ['sad', 'anxious', 'lonely', 'grief', 'heartbreak', 'hopeful', 'grateful', 'other'] }],
    moodEmoji: String,
    isUrgent: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Post = mongoose.model<IPost>('Post', PostSchema);
