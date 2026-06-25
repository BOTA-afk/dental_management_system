import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String },
    phone: { type: String, required: true },
    lastTreatment: { type: String },
    // Link the patient to the dentist who registered them
    registeredBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" } 
  },
  { timestamps: true }
);

export default mongoose.model("Patient", patientSchema);