import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    chatId: { type: String, required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Made optional if you don't always have a sender ID
    text: { type: String, required: true },
    isDoctor: { type: Boolean, default: false }, // Added to match frontend
    time: { type: String }, // Added to match the string time sent from frontend
    timestamp: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export default mongoose.models.Message || mongoose.model("Message", messageSchema);