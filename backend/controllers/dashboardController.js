import Appointment from "../models/Appointment.js";
import Patient from "../models/Patient.js";

export const getDentistDashboard = async (req, res) => {
  try {
    const dentistId = req.user._id;

    // 1. Get Today's Date Range (Midnight to Midnight)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // 2. Fetch Dashboard Stats
    const totalPatients = await Patient.countDocuments({ registeredBy: dentistId });
    
    const todaysAppointmentsCount = await Appointment.countDocuments({
      dentist: dentistId,
      date: { $gte: today, $lt: tomorrow }
    });

    // Calculate this month's revenue (Sum of all completed appointments this month)
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const revenueResult = await Appointment.aggregate([
      { 
        $match: { 
          dentist: dentistId, 
          status: "Completed",
          date: { $gte: startOfMonth }
        } 
      },
      { $group: { _id: null, totalRevenue: { $sum: "$cost" } } }
    ]);
    const thisMonthRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    // 3. Fetch "Today's Appointments" List (Populate with Patient Name)
    const todaysAppointmentsList = await Appointment.find({
      dentist: dentistId,
      date: { $gte: today, $lt: tomorrow }
    })
    .populate("patient", "name") // Get the patient's name
    .sort({ time: 1 }) // Sort by time
    .limit(5); // Only show first 5 on dashboard

    // 4. Fetch "Recent Patients" List
    const recentPatients = await Patient.find({ registeredBy: dentistId })
    .sort({ createdAt: -1 }) // Sort newest first
    .limit(3);

    // 5. Send everything back to the frontend
    res.status(200).json({
      stats: {
        todaysAppointments: todaysAppointmentsCount,
        totalPatients: totalPatients,
        pendingReviews: 8, // Keeping this static for now, or you can build logic for it
        thisMonthRevenue: thisMonthRevenue
      },
      appointments: todaysAppointmentsList.map(apt => ({
        id: apt._id,
        name: apt.patient.name,
        type: apt.type,
        time: apt.time,
        status: apt.status === "Completed" ? "success" : "alert"
      })),
      recentPatients: recentPatients.map(pat => ({
        id: pat._id,
        name: pat.name,
        treatment: pat.lastTreatment || "Initial Consultation",
        time: pat.createdAt // The frontend can format this to "2 days ago"
      }))
    });

  } catch (error) {
    console.error("Dashboard Error:", error);
    res.status(500).json({ message: "Server error fetching dashboard data" });
  }
};