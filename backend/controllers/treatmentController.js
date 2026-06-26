import Treatment from "../models/Treatment.js";

export const getTreatments = async (req, res) => {
  try {
    const treatments = await Treatment.find({ registeredBy: req.user._id }).sort({ createdAt: -1 });
    
    // Calculate stats dynamically
    const stats = [
      { title: "Completed", count: treatments.filter(t => t.status === "Completed").length.toString(), bg: "bg-[#2577fa]" },
      { title: "In Progress", count: treatments.filter(t => t.status === "In Progress").length.toString(), bg: "bg-[#28b5ee]" },
      { title: "Scheduled", count: treatments.filter(t => t.status === "Scheduled").length.toString(), bg: "bg-[#2a839a]" },
      { title: "Total Treatments", count: treatments.length.toString(), bg: "bg-[#4a6cf7]" },
    ];

    res.status(200).json({ stats, treatments });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch treatments" });
  }
};