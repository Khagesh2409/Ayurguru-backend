import mongoose from "mongoose";
import Chat from "./Chat.js";

const conversationSchema = new mongoose.Schema({
  conversationId: { type: String, required: true, unique: true },
  chats: [Chat.schema],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Conversation", conversationSchema);
