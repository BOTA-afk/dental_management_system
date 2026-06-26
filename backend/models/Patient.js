import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    dob: { type: String, required: true },        // <-- NEW
    gender: { type: String, required: true },     // <-- NEW
    phone: { type: String, required: true },
    email: { type: String, default: "N/A" },      // <-- NEW
    address: { type: String, required: true },    // <-- NEW
    age: { type: String, default: "N/A" },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
    lastVisit: { type: String, default: "-" },
    nextAppointment: { type: String, default: "-" },
    visits: { type: Number, default: 0 },
    registeredBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

export default mongoose.models.Patient || mongoose.model("Patient", patientSchema);