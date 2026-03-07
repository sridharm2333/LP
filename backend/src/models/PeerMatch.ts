import mongoose, { Document, Schema, Types } from 'mongoose';

export type PeerMatchStatus = 'pending' | 'active' | 'ended';

export interface IPeerMatch extends Document {
  userA: Types.ObjectId;
  userB?: Types.ObjectId;
  status: PeerMatchStatus;
  sharedTag: string;       // emotion tag both users share, e.g. "heartbreak"
  startedAt?: Date;
  endsAt?: Date;           // 48h window
  createdAt: Date;
}

const PeerMatchSchema = new Schema<IPeerMatch>(
  {
    userA: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    userB: { type: Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['pending', 'active', 'ended'], default: 'pending' },
    sharedTag: { type: String, required: true },
    startedAt: Date,
    endsAt: Date,
  },
  { timestamps: true }
);

export const PeerMatch = mongoose.model<IPeerMatch>('PeerMatch', PeerMatchSchema);
