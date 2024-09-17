import express from "express";
import mongoose from "mongoose";
import User from "../models/User.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.userId }, "conversations");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user.conversations);
  } catch (error) {
    res.status(500).json({ error: "Error fetching conversations" });
  }
});

router.get("/:conversationId", async (req, res) => {
  const { conversationId } = req.params;
  try {
    const user = await User.findOne(
      { userId: req.userId, "conversations.conversationId": conversationId },
      { "conversations.$": 1 }
    );
    if (!user || user.conversations.length === 0) {
      return res.status(404).json({ error: "Conversation not found" });
    }
    res.json(user.conversations[0].chats);
  } catch (error) {
    res.status(500).json({ error: "Error fetching chats" });
  }
});

router.post("/new", async (req, res) => {
  try {
    const conversationId = new mongoose.Types.ObjectId().toString();
    const newConversation = {
      conversationId,
      chats: [],
      createdAt: new Date(),
    };
    const user = await User.findOneAndUpdate(
      { userId: req.userId },
      { $push: { conversations: newConversation } },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(newConversation);
  } catch (error) {
    res.status(500).json({ error: "Error creating conversation" });
  }
});

router.post("/:conversationId", async (req, res) => {
  const { conversationId } = req.params;
  const { message, sender } = req.body;
  try {
    const newChat = {
      message,
      sender,
      timestamp: new Date(),
    };
    const result = await User.updateOne(
      { userId: req.userId, "conversations.conversationId": conversationId },
      { $push: { "conversations.$.chats": newChat } }
    );
    if (result.nModified === 0) {
      return res.status(404).json({ error: "Conversation not found" });
    }
    res.json(newChat);
  } catch (error) {
    res.status(500).json({ error: "Error adding chat" });
  }
});

router.delete("/:conversationId", async (req, res) => {
  const { conversationId } = req.params;
  try {
    const result = await User.updateOne(
      { userId: req.userId },
      { $pull: { conversations: { conversationId } } }
    );
    if (result.nModified === 0) {
      return res.status(404).json({ error: "Conversation not found" });
    }
    res.json({ message: "Conversation deleted" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting conversation" });
  }
});

router.post("/checkprevpersonalizedchat", async (req, res) => {
  const { userId } = req.body;
  try {
    const user = await User.findOne({ userId }, "personalizedChat");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user.personalizedChat);
  } catch (error) {
    res.status(500).json({ error: "Error fetching personalized chat" });
  }
});

export default router;
