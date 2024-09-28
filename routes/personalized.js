import express from "express";
import User from "../models/User.js";

const router = express.Router();

router.post("/checkPersonalizedChats", async (req, res) => {
  const { userId, authMessage } = req.body;
  if (authMessage === process.env.AUTH_MESSAGE) {
    try {
      const user = await User.findOne({ userId }).select("personalizedChats");

      if (!user || !user.personalizedChats) {
        return res.json({ result: "No" });
      }

      const personalizedChatsLength =
        user.personalizedChats.personalChats?.length || 0;
      const filesTextLength = user.personalizedChats.filesText?.length || 0;

      if (personalizedChatsLength === 0 || filesTextLength === 0) {
        return res.json({ result: "No" });
      }

      return res.json({ result: "Yes" });
    } catch (error) {
      console.error("Error retrieving personalized chats:", error);
      return res
        .status(500)
        .json({ message: "Error retrieving personalized chats", error });
    }
  } else {
    res.status(401).json({ error: "Access Denied" });
  }
});

router.post("/getPersonalizedChats", async (req, res) => {
  const { userId, authMessage } = req.body;
  if (authMessage === process.env.AUTH_MESSAGE) {
    try {
      const user = await User.findOne({ userId }).select("personalizedChats");

      if (
        !user ||
        !user.personalizedChats ||
        !user.personalizedChats.personalChats
      ) {
        return res.json([]);
      }

      res.json(user.personalizedChats.personalChats);
    } catch (error) {
      console.error("Error retrieving personalized chats:", error);
      res
        .status(500)
        .json({ message: "Error retrieving personalized chats", error });
    }
  } else {
    res.status(401).json({ error: "Access Denied" });
  }
});

router.post("/addPersonalizedChat", async (req, res) => {
  const { userId, authMessage, chat, sender } = req.body;

  if (authMessage === process.env.AUTH_MESSAGE) {
    try {
      const user = await User.findOne({ userId });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      if (!user.personalizedChats) {
        console.log("Initializing personalizedChats");
        user.personalizedChats = { personalChats: [], filesText: [] };
      }
      if (!user.personalizedChats.personalChats) {
        console.log("Initializing personalChats");
        user.personalizedChats.personalChats = [];
      }
      const newChat = {
        message: chat,
        sender,
        timestamp: new Date(),
      };
      user.personalizedChats.personalChats.push(newChat);
      console.log("Before save:", user.personalizedChats);
      const savedUser = await user.save();
      console.log("After save:", savedUser.personalizedChats);
      res.json(newChat);
    } catch (error) {
      console.error("Error adding personalized chat:", error);
      res
        .status(500)
        .json({ message: "Error adding personalized chat", error });
    }
  } else {
    res.status(401).json({ error: "Access Denied" });
  }
});

router.post("/getPersonalizedFileText", async (req, res) => {
  const { userId, authMessage } = req.body;
  if (authMessage === process.env.AUTH_MESSAGE) {
    try {
      const user = await User.findOne({ userId }).select("personalizedChats");

      if (
        !user ||
        !user.personalizedChats ||
        !user.personalizedChats.filesText
      ) {
        return res.json([]);
      }

      res.json(user.personalizedChats.filesText);
    } catch (error) {
      console.error("Error retrieving personalized file text:", error);
      res
        .status(500)
        .json({ message: "Error retrieving personalized file text", error });
    }
  } else {
    res.status(401).json({ error: "Access Denied" });
  }
});

router.post("/addPersonalizedFileText", async (req, res) => {
  const { userId, authMessage, text, sender } = req.body;
  if (authMessage === process.env.AUTH_MESSAGE) {
    try {
      const user = await User.findOne({ userId });

      if (!user.personalizedChats) {
        user.personalizedChats = { personalChats: [], filesText: [] };
      }

      if (!user.personalizedChats.filesText) {
        user.personalizedChats.filesText = [];
      }

      const newFileText = {
        text,
        sender,
        timestamp: new Date(),
      };
      
      user.personalizedChats.filesText.push(newFileText);
      await user.save();
      
      // Retrieve the ID of the newly added file text object
      const addedFileText = user.personalizedChats.filesText[user.personalizedChats.filesText.length - 1];
      
      res.json({ id: addedFileText._id });
    } catch (error) {
      console.error("Error adding personalized file text:", error);
      res
        .status(500)
        .json({ message: "Error adding personalized file text", error });
    }
  } else {
    res.status(401).json({ error: "Access Denied" });
  }
});

export default router;
