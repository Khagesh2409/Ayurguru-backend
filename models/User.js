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

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  conversations: [conversationSchema],
  userId: String,
  personalizedChats: {
    personalChats: [{ message: String, sender: String, timestamp: Date }],
    filesText: [{ text: String, sender: String, timestamp: Date }],
  },
});

export default mongoose.model("User", userSchema);
