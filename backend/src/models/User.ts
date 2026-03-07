import mongoose, { Document, Schema } from 'mongoose';

export type LoginProvider = 'email' | 'google' | 'apple';

export interface IUser extends Document {
  email: string;
  passwordHash?: string;
  username: string;           // anonymous Reddit-style, e.g. "QuietWave42"
  loginProvider: LoginProvider;
  oauthId?: string;           // Google/Apple subject ID
  createdAt: Date;
  updatedAt: Date;
  kindnessScore: number;
  lastCheckInAt?: Date;
  postingStreakDays: number;
  midnightOceanEnabled: boolean;
  isBlocked: boolean;
  softExitRequestedAt?: Date; // set when user starts account deletion flow
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String },
    username: { type: String, required: true, unique: true },
    loginProvider: { type: String, enum: ['email', 'google', 'apple'], default: 'email' },
    oauthId: { type: String, sparse: true },
    kindnessScore: { type: Number, default: 0 },
    lastCheckInAt: Date,
    postingStreakDays: { type: Number, default: 0 },
    midnightOceanEnabled: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
    softExitRequestedAt: Date,
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>('User', UserSchema);
