import express from "express";
import { getMyChats } from "../controllers/chatController.js";
import { getMessages, sendMessage } from "../controllers/messageController.js";
import { protect } from "../middleware/authMiddleware.js"; // Ensure you have this

const router = express.Router();

// The missing route that the frontend is trying to call
router.get("/chats", protect, getMyChats); 

router.get("/:chatId", protect, getMessages);
router.post("/", protect, sendMessage);

export default router;