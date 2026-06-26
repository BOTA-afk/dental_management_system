import express from "express";
import { 
  getAppointments, 
  createAppointment, 
  rescheduleAppointment, 
  cancelAppointment,
  getPatientsList
} from "../controllers/appointmentController.js";
import { protect, authorizeRole } from "../middleware/authMiddleware.js";

const router = express.Router();

// Apply security middleware to ALL routes in this file
// User must be logged in AND have the role of Dentist (or Assistant)
router.use(protect);
router.use(authorizeRole("Dentist", "Assistant")); 

// GET /api/appointments (Can accept ?search=text & ?status=Pending)
router.get("/", getAppointments);

// GET /api/appointments/patients (Fetch patient list for dropdown)
router.get("/patients", getPatientsList);

// POST /api/appointments
router.post("/", createAppointment);

// PUT /api/appointments/:id/reschedule
router.put("/:id/reschedule", rescheduleAppointment);

// PUT /api/appointments/:id/cancel
router.put("/:id/cancel", cancelAppointment);

export default router;