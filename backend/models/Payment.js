import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    patientName: { type: String, required: true },
    amount: { type: Number, required: true },
    method: { type: String, required: true }, // e.g., Credit Card, Insurance, Cash
    date: { type: String, required: true },
    referenceNumber: { type: String, required: true },
    status: { type: String, enum: ["Paid", "Pending", "Overdue"], default: "Pending" },
    registeredBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

export default mongoose.models.Payment || mongoose.model("Payment", paymentSchema);