import express from "express";
import { getDentistDashboard } from "../controllers/dashboardController.js";
import { protect, authorizeRole } from "../middleware/authMiddleware.js";

const router = express.Router();

// Endpoint: GET /api/dashboard/dentist
// Middleware: Must be logged in (protect) AND must be a Dentist (authorizeRole)
router.get("/dentist", protect, authorizeRole("Dentist"), getDentistDashboard);

export default router;