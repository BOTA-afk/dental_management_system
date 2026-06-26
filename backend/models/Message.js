import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    chatId: { type: String, required: true }, // Links sender and receiver
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export default mongoose.models.Message || mongoose.model("Message", messageSchema);