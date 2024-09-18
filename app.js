import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import dbConnection from "./config/db.js";
import authRoutes from "./routes/auth.js";
import conversationRoutes from "./routes/conversations.js";
import personalizedChatRoutes from "./routes/personalized.js";
import cors from "cors";
dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

dbConnection();

app.use("/api/auth", authRoutes);
app.use("/api/conversations", conversationRoutes);
app.use("/api/personalizedChats", personalizedChatRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
