import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js"; // <-- Add loginUser here
const router = express.Router();

// POST route for registering a new user
// Endpoint: /api/auth/register
router.post("/register", registerUser);
   router.post("/login", loginUser); // <-- Add this new route 
// This is the line that fixes your specific error!
export default router;