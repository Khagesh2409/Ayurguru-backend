import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
const router = express.Router();
import mongoose from "mongoose";

router.post("/signup", async (req, res) => {
  const { email, username, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = new mongoose.Types.ObjectId();
    const newUser = new User({
      email,
      username,
      password: hashedPassword,
      userId,
    });
    await newUser.save();
    return res.json({ userId });
  } catch (error) {
    res.status(500).json({ error: "Server error during signup" });
  }
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }
    const token = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ token, userId: user.userId });
  } catch (error) {
    res.status(500).json({ error: "Error during sign-in" });
  }
});

router.post("/is-auth", async (req, res) => {
  const { token } = req.body;
  try {
    if (!token) {
      return res.status(401).json({ error: "Invalid token" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json(decoded);
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
});

export default router;
