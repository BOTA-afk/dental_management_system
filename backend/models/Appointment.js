import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
    dentist: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true }, // e.g., "09:00 AM"
    type: { type: String, required: true }, // e.g., "Root Canal"
    status: { type: String, enum: ["Pending", "Completed", "Cancelled"], default: "Pending" },
    cost: { type: Number, default: 0 } // Used to calculate revenue
  },
  { timestamps: true }
);

export default mongoose.model("Appointment", appointmentSchema);