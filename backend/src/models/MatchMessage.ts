import mongoose, { Document, Schema } from 'mongoose';

export interface IMatchMessage extends Document {
  matchId: mongoose.Types.ObjectId;
  senderId: mongoose.Types.ObjectId;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const MatchMessageSchema = new Schema<IMatchMessage>(
  {
    matchId: { type: Schema.Types.ObjectId, ref: 'PeerMatch', required: true },
    senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true, maxlength: 1000 },
  },
  { timestamps: true }
);

// Index for fast chat history lookup
MatchMessageSchema.index({ matchId: 1, createdAt: 1 });

export const MatchMessage = mongoose.model<IMatchMessage>('MatchMessage', MatchMessageSchema);
