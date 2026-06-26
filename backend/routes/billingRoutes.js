import express from "express";
import { getBillingData } from "../controllers/billingController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();
router.get("/", protect, getBillingData);

export default router;