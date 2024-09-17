import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  message: { type: String, required: true },
  sender: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const conversationSchema = new mongoose.Schema({
  conversationId: { type: String, required: true },
  chats: [chatSchema],
  createdAt: { type: Date, default: Date.now },
});

const filesTextSchema = new mongoose.Schema({
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const personalizedChatSchema = new mongoose.Schema({
  personalizedChats: [chatSchema],
  filesText: [filesTextSchema],
});

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  conversations: [conversationSchema],
  personalizedChat: [personalizedChatSchema],
});

export default mongoose.model("User", userSchema);
