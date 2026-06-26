import mongoose from "mongoose";

const treatmentSchema = new mongoose.Schema(
  {
    patientName: { type: String, required: true },
    procedure: { type: String, required: true },
    date: { type: String, required: true },
    doctor: { type: String, required: true },
    notes: { type: String },
    status: { type: String, enum: ["Completed", "In Progress", "Scheduled"], default: "Scheduled" },
    registeredBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

export default mongoose.models.Treatment || mongoose.model("Treatment", treatmentSchema);