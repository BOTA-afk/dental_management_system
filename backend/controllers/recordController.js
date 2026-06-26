import MedicalRecord from "../models/MedicalRecord.js";

export const getRecords = async (req, res) => {
  try {
    const records = await MedicalRecord.find({ registeredBy: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ records });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch records" });
  }
};