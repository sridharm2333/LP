import mongoose, { Document, Schema } from 'mongoose';

export interface IPenguinCircle extends Document {
  userId: mongoose.Types.ObjectId; // user in distress
  memberIds: mongoose.Types.ObjectId[]; // 5-10 support circle members
  status: 'active' | 'dissolved';
  consentedAt: Date;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PenguinCircleSchema = new Schema<IPenguinCircle>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    memberIds: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    status: { type: String, enum: ['active', 'dissolved'], default: 'active' },
    consentedAt: { type: Date, required: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

export const PenguinCircle = mongoose.model<IPenguinCircle>('PenguinCircle', PenguinCircleSchema);
