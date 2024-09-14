import mongoose from "mongoose";
import Conversation from "./Conversation.js";

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  conversations: [Conversation.schema],
});

export default mongoose.model("User", userSchema);
