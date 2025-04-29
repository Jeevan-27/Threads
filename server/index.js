// index.js
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import serverless from "serverless-http";

// Your routes and controllers
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import { register } from "./controllers/auth.js";
import { createPost } from "./controllers/posts.js";
import { verifyToken } from "./middleware/auth.js";
import User from "./models/User.js";
import Post from "./models/Post.js";
import { users, posts } from "./data/index.js";

/* CONFIGURATIONS */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();

const app = express();

// Middlewares
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors({
  origin: ["https://threads-bay-delta.vercel.app"],
  methods: ["POST", "GET"],
  credentials: true
}));
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

/* FILE STORAGE SETUP */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

/* ROUTES WITH FILES */
app.post("/auth/register", upload.single("picture"), register);
app.post("/posts", verifyToken, upload.single("picture"), createPost);

/* ROUTES */
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);

/* Basic Route */
app.get("/", (req, res) => {
  res.send("Server is running");
});

/* Additional Routes */
app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/user/:name', async (req, res) => {
  const { name } = req.params;
  try {
    const user = await User.findOne({ firstName: name });
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/postss', async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/users/:name/posts', async (req, res) => {
  const { name } = req.params;
  try {
    const user = await User.findOne({ firstName: name });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const userPosts = await Post.find({ userId: user._id });
    res.json(userPosts);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/save/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const userDataToUpdate = req.body;
    const updatedUser = await User.findByIdAndUpdate(userId, userDataToUpdate, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error updating user data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get("/search", async (req, res) => {
  try {
    const { query } = req.query;
    const users = await User.find({
      $or: [
        { firstName: { $regex: query, $options: 'i' } },
        // Extend to lastName, email if needed
      ]
    });
    res.json(users);
  } catch (error) {
    console.error('Error searching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/* DATABASE CONNECTION - COLD START OPTIMIZED */
let cachedConnection = null;

async function connectToDatabase() {
  if (cachedConnection) {
    return cachedConnection;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    cachedConnection = conn;
    console.log("✅ MongoDB connected successfully!");
    return conn;
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    throw error;
  }
}

// Immediately connect once serverless container loads
connectToDatabase().catch((error) => {
  console.error("Initial MongoDB connection failed:", error);
});

/* Export serverless handler */
const handler = serverless(app);
export default handler;
