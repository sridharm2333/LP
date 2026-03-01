import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  displayName: string;
  createdAt: Date;
  updatedAt: Date;
  kindnessScore: number;
  lastCheckInAt?: Date;
  postingStreakDays: number;
  midnightOceanEnabled: boolean;
  isBlocked: boolean;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    displayName: { type: String, required: true },
    kindnessScore: { type: Number, default: 0 },
    lastCheckInAt: Date,
    postingStreakDays: { type: Number, default: 0 },
    midnightOceanEnabled: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>('User', UserSchema);
