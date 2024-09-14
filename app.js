import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import dbConnection from "./config/db.js";
import authRoutes from "./routes/auth.js";
import conversationRoutes from "./routes/conversations.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use(cookieParser());

dbConnection();

app.use("/api/auth", authRoutes);
app.use("/api/conversations", conversationRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
