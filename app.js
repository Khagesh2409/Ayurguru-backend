import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import dbConnection from "./config/db.js";
import authRoutes from "./routes/auth.js";
import conversationRoutes from "./routes/conversations.js";
import cors from "cors";
import User from "./models/User.js";
import { authMiddleware } from "./middleware/authMiddleware.js";
dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

dbConnection();

app.use("/api/auth", authRoutes);
app.use("/api/conversations", conversationRoutes);

app.post("/checkPersonalizedChats", async (req, res) => {
  const { userId, authMessage } = req.body;
  if (authMessage == process.env.AUTH_MESSAGE) {
    try {
      console.log("fuckers");
      const user = await User.findOne({ userId: userId }).select(
        "personalizedChats"
      );
      console.log(user);
      console.log("hello");
      const personalizedChatsLength = user.personalizedChats.length;
      res.json({ result: user, length: personalizedChatsLength });
    } catch (error) {
      console.error("Error retrieving personalized chats:", error);
      return { message: "Error retrieving personalized chats", error };
    }
  }
  else{
    res.status(401).json({"error":"Access Denied"})
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
