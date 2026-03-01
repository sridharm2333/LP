import mongoose, { Document, Schema } from 'mongoose';

export type GroupTopic = 'heartbreak' | 'grief' | 'loneliness' | 'anxiety' | 'general';

export interface IGroup extends Document {
  name: string;
  topic: GroupTopic;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

const GroupSchema = new Schema<IGroup>(
  {
    name: { type: String, required: true },
    topic: { type: String, enum: ['heartbreak', 'grief', 'loneliness', 'anxiety', 'general'], required: true },
    description: { type: String, default: '' },
  },
  { timestamps: true }
);

export const Group = mongoose.model<IGroup>('Group', GroupSchema);
