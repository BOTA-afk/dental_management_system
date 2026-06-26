import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
  dentist: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  type: { type: String, required: true },
  note: { type: String }, // <-- NEW FIELD ADDED HERE
  status: { type: String, enum: ["Pending", "In Progress", "Confirmed", "Cancelled"], default: "Pending" },
  cost: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model("Appointment", appointmentSchema);