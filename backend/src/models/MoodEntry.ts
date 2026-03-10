import mongoose, { Document, Schema } from 'mongoose';

export type MoodLevel = 'great' | 'okay' | 'rough' | 'terrible';

export interface IMoodEntry extends Document {
  userId: mongoose.Types.ObjectId;
  mood: MoodLevel;
  note?: string;
  createdAt: Date;
  updatedAt: Date;
}

const MoodEntrySchema = new Schema<IMoodEntry>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    mood: { type: String, enum: ['great', 'okay', 'rough', 'terrible'], required: true },
    note: { type: String, maxlength: 300 },
  },
  { timestamps: true }
);

export const MoodEntry = mongoose.model<IMoodEntry>('MoodEntry', MoodEntrySchema);
