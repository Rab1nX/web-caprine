import { Schema, model, Document, Types } from 'mongoose';

interface IMessage extends Document {
  conversation: Types.ObjectId;
  sender: Types.ObjectId;
  content: string;
  contentType: string;
  fileUrl: string;
  readBy: Types.ObjectId[];
  reactions: {
    user: Types.ObjectId;
    type: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new Schema<IMessage>(
  {
    conversation: { type: Schema.Types.ObjectId, ref: 'Conversation', required: true },
    sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    contentType: { type: String, enum: ['text', 'image', 'file'], default: 'text' },
    fileUrl: { type: String },
    readBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    reactions: [{
      user: { type: Schema.Types.ObjectId, ref: 'User' },
      type: { type: String, enum: ['like', 'love', 'laugh', 'wow', 'sad', 'angry'] },
    }],
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
messageSchema.index({ conversation: 1, createdAt: -1 });
messageSchema.index({ sender: 1 });

export const Message = model<IMessage>('Message', messageSchema);
