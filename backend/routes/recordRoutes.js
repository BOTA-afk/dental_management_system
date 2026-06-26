import express from "express";
import { getRecords } from "../controllers/recordController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();
router.get("/", protect, getRecords);

export default router;