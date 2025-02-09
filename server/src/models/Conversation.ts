import { Schema, model, Document, Types } from 'mongoose';

interface IConversation extends Document {
  participants: Types.ObjectId[];
  lastMessage?: Types.ObjectId;
  type: 'direct' | 'group';
  name?: string;
  isGroup: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const conversationSchema = new Schema<IConversation>(
  {
    participants: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
    lastMessage: { type: Schema.Types.ObjectId, ref: 'Message' },
    type: { type: String, enum: ['direct', 'group'], default: 'direct' },
    name: { type: String },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Index to improve query performance
conversationSchema.index({ participants: 1 });

// Virtual field to check if conversation is a group chat
conversationSchema.virtual('isGroup').get(function(this: IConversation) {
  return this.type === 'group';
});

export const Conversation = model<IConversation>('Conversation', conversationSchema);
