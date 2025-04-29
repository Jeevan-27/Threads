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
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

/* FILE STORAGE */
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

/* Root URL Route Handler */
app.get("/", (req, res) => {
  res.send("Server is running");
});

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
    // Search for users where firstName or lastName matches the provided name
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
    // Find the user by firstName (assuming firstName stores the user's name)
    const user = await User.findOne({ firstName: name });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Find all posts by the user using their user ID
    const userPosts = await Post.find({ userId: user._id });
    
    res.json(userPosts);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/save/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const userDataToUpdate = req.body; // Assuming the updated user data is sent in the request body

    // Update user data in the database
    const updatedUser = await User.findByIdAndUpdate(userId, userDataToUpdate, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Respond with updated user data
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error updating user data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get("/search", async (req, res) => {
  try {
    const { query } = req.query; // Extract the search query from query parameters
    // Perform a database query to find users matching the search query
    const users = await User.find({
      $or: [
        { firstName: { $regex: query, $options: 'i' } },
        // Add more fields to search as needed (e.g., lastName, email, etc.)
      ]
    });

    // Respond with the found users
    res.json(users);
  } catch (error) {
    // If an error occurs, send an error response
    console.error('Error searching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/* MONGOOSE SETUP */
const PORT = process.env.PORT || 6001;
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

  .then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));

    /* ADD DATA ONE TIME */
    // User.insertMany(users);
    // Post.insertMany(posts);
  })
  .catch((error) => console.log(`${error} did not connect`));
