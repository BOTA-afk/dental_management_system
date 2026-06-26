import Patient from "../models/Patient.js";

// 1. GET ALL PATIENTS & DYNAMIC STATS
export const getPatients = async (req, res) => {
  try {
    // Find all patients registered by the logged-in dentist
    const patients = await Patient.find({ registeredBy: req.user._id }).sort({ createdAt: -1 });

    // Calculate real-time stats based on the database
    const totalPatients = patients.length;
    const activePatients = patients.filter(p => p.status === "Active").length;
    const inactivePatients = patients.filter(p => p.status === "Inactive").length;

    // Calculate "New this month"
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const newThisMonth = patients.filter(p => {
      const createdAt = new Date(p.createdAt);
      return createdAt.getMonth() === currentMonth && createdAt.getFullYear() === currentYear;
    }).length;

    // Format stats exactly as your frontend expects them
    const stats = [
      { title: "Total Patients", count: totalPatients.toString(), bg: "bg-[#2577fa]" },
      { title: "Active Patients", count: activePatients.toString(), bg: "bg-[#28b5ee]" },
      { title: "New this month", count: newThisMonth.toString(), bg: "bg-[#2a839a]" },
      { title: "Inactive", count: inactivePatients.toString(), bg: "bg-[#f23b3b]" },
    ];

    res.status(200).json({ stats, patients });
  } catch (error) {
    console.error("Fetch Patients Error:", error);
    res.status(500).json({ message: "Failed to fetch patients" });
  }
};

// 2. CREATE NEW PATIENT
export const createPatient = async (req, res) => {
  try {
    // Grab ALL the new fields from the frontend modal
    const { name, dob, gender, phone, email, address, age, status } = req.body;

    // Create the patient in MongoDB
    const newPatient = new Patient({
      name,
      dob,
      gender,
      phone,
      email: email || "N/A",
      address,
      age: age || "N/A",
      status: status || "Active",
      visits: 0,
      registeredBy: req.user._id // Ties the patient to the logged-in dentist
    });

    // Save it!
    await newPatient.save();
    res.status(201).json({ message: "Patient added successfully", patient: newPatient });
    
  } catch (error) {
    console.error("Create Patient Error:", error);
    res.status(500).json({ message: "Failed to create patient" });
  }
};