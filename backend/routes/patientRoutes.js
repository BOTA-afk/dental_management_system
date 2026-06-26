import express from "express";
import { getPatients, createPatient } from "../controllers/patientController.js";
import { protect } from "../middleware/authMiddleware.js"; // Ensures only logged-in users access this

const router = express.Router();

// Route: /api/patients
router.get("/", protect, getPatients);
router.post("/", protect, createPatient);

export default router;