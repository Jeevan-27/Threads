import express from 'express';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "./models/User.js";
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

export const searchUsers = async (req, res) => {

    try {
      const { query } = req.body;
      // Perform a database query to find users matching the search query
      const users = await User.find({
        $or: [
          { firstName: { $regex: query, $options: 'i' } }, // Case-insensitive username search
  // Case-insensitive email search
          // Add more fields to search as needed (e.g., name, etc.)
        ]
      });
  
      // Respond with the found users
      res.json(users);
    } catch (error) {
      // If an error occurs, send an error response
      console.error('Error searching users:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  
