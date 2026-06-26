import mongoose from "mongoose";

const recordSchema = new mongoose.Schema(
  {
    type: { type: String, required: true }, // e.g., Treatment Report, X-ray
    patientName: { type: String, required: true },
    date: { type: String, required: true },
    procedure: { type: String, required: true },
    fileSize: { type: String, required: true },
    status: { type: String, enum: ["Completed", "In Progress", "Pending"], default: "Pending" },
    fileUrl: { type: String }, // Path to the actual file if you implement uploads
    registeredBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

export default mongoose.models.MedicalRecord || mongoose.model("MedicalRecord", recordSchema);