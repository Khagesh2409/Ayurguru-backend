import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import multer from "multer";
import pkg from "pg";
import fs from "fs";

// Existing routes for MongoDB
import authRoutes from "./routes/auth.js";
import conversationRoutes from "./routes/conversations.js";
import personalizedChatRoutes from "./routes/personalized.js";

// Load environment variables
dotenv.config();

const { Pool } = pkg;

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// MongoDB connection (as in your existing setup)
import dbConnection from "./config/db.js";
dbConnection();  // This will connect to MongoDB

// PostgreSQL connection (specifically for file uploads)
const pool = new Pool({
  connectionString: process.env.PG_URI,
});

pool.connect()
  .then(() => console.log('PostgreSQL connected'))
  .catch(err => console.error('Connection error', err.stack));

// Multer configuration for handling file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

// Route to handle file uploads and store them in PostgreSQL
app.post("/upload", upload.single("file"), async (req, res) => {
  const { userId } = req.body;
  const fileData = fs.readFileSync(req.file.path);
  const filename = req.file.originalname;
  const fileType = req.file.mimetype.startsWith("image") ? "image" : "pdf";  // Detect file type

  const queryText = `
    INSERT INTO user_files (user_id, filename, file_data, file_type) 
    VALUES ($1, $2, $3, $4) RETURNING id;
  `;
  const values = [userId, filename, fileData, fileType];

  try {
    const result = await pool.query(queryText, values);
    // Remove the file from the 'uploads' folder after saving to DB
    fs.unlinkSync(req.file.path);
    res.status(200).json({ id: result.rows[0].id, filename: filename });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).send("Error uploading file.");
  }
});

// Route to fetch filenames of files uploaded by a user based on userId
app.get("/userfiles/:userId", async (req, res) => {
  const { userId } = req.params;
  
  const queryText = `SELECT filename FROM user_files WHERE user_id = $1;`;
  try {
    const result = await pool.query(queryText, [userId]);
    const filenames = result.rows.map(row => row.filename);
    res.status(200).json(filenames);
  } catch (error) {
    console.error("Error fetching user files:", error);
    res.status(500).send("Error fetching user files.");
  }
});

// Route to download a file (PDF or image) by filename
app.get("/pdf/:filename", async (req, res) => {
  const { filename } = req.params;

  const queryText = `SELECT file_data, file_type FROM user_files WHERE filename = $1;`;
  try {
    const result = await pool.query(queryText, [filename]);
    if (result.rows.length === 0) {
      return res.status(404).send("File not found.");
    }

    const fileData = result.rows[0].file_data;
    const fileType = result.rows[0].file_type;
    res.contentType(fileType).send(fileData);
  } catch (error) {
    console.error("Error retrieving file:", error);
    res.status(500).send("Error retrieving file.");
  }
});

// Route to delete a file by filename
app.delete("/delete/:filename", async (req, res) => {
  const { filename } = req.params;

  const queryText = `DELETE FROM user_files WHERE filename = $1 RETURNING *;`;
  try {
    const result = await pool.query(queryText, [filename]);
    if (result.rowCount === 0) {
      return res.status(404).send("File not found.");
    }
    res.status(200).send("File deleted successfully.");
  } catch (error) {
    console.error("Error deleting file:", error);
    res.status(500).send("Error deleting file.");
  }
});

// Existing MongoDB routes
app.use("/api/auth", authRoutes);
app.use("/api/conversations", conversationRoutes);
app.use("/api/personalizedChats", personalizedChatRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
