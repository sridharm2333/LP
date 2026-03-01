import mongoose, { Document, Schema } from 'mongoose';

export interface IKindnessLog extends Document {
  userId: mongoose.Types.ObjectId; // user who received kindness points
  source: 'warmth_received' | 'supportive_comment';
  referenceId: mongoose.Types.ObjectId; // comment or reaction id
  points: number;
  createdAt: Date;
}

const KindnessLogSchema = new Schema<IKindnessLog>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    source: { type: String, enum: ['warmth_received', 'supportive_comment'], required: true },
    referenceId: { type: Schema.Types.ObjectId, required: true },
    points: { type: Number, required: true, default: 1 },
  },
  { timestamps: true }
);

export const KindnessLog = mongoose.model<IKindnessLog>('KindnessLog', KindnessLogSchema);
