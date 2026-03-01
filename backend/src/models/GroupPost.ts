import mongoose, { Document, Schema } from 'mongoose';

export interface IGroupPost extends Document {
  groupId: mongoose.Types.ObjectId;
  authorId: mongoose.Types.ObjectId;
  isAnonymous: boolean;
  content: string;
  emotionTags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const GroupPostSchema = new Schema<IGroupPost>(
  {
    groupId: { type: Schema.Types.ObjectId, ref: 'Group', required: true },
    authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    isAnonymous: { type: Boolean, default: false },
    content: { type: String, required: true },
    emotionTags: [String],
  },
  { timestamps: true }
);

export const GroupPost = mongoose.model<IGroupPost>('GroupPost', GroupPostSchema);
