import mongoose from 'mongoose'

const ChatSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  username: { type: String, required: true },
  chat: [{ type: String, required: true }],
})

export const ChatModel = mongoose.model('chats', ChatSchema)
