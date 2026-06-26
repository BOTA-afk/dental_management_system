import Appointment from "../models/Appointment.js";
import Patient from "../models/Patient.js";

// 1. GET ALL APPOINTMENTS (With Search & Filter Support)
// Matches your "All" filter and "Search Appointments..." bar
export const getAppointments = async (req, res) => {
  try {
    const { search, status } = req.query;
    
    // Base query: Only get appointments for the logged-in dentist
    let query = { dentist: req.user._id };

    // Apply status filter if it's not "All"
    if (status && status !== "All") {
      query.status = status;
    }

    // Fetch appointments and pull in patient details (name, email, phone)
    const appointments = await Appointment.find(query)
      .populate("patient", "name email phone")
      .sort({ date: 1, time: 1 }); // Sort chronologically

    // Apply search filter on the populated patient name if a search term exists
    let filteredAppointments = appointments;
    if (search) {
      filteredAppointments = appointments.filter((app) => 
        app.patient.name.toLowerCase().includes(search.toLowerCase()) ||
        app.type.toLowerCase().includes(search.toLowerCase())
      );
    }

    res.status(200).json(filteredAppointments);
  } catch (error) {
    console.error("Fetch Appointments Error:", error);
    res.status(500).json({ message: "Failed to fetch appointments" });
  }
};

// 2. CREATE NEW APPOINTMENT
// Matches your "+ New Appointment" button
export const createAppointment = async (req, res) => {
  try {
    const { patientId, date, time, type } = req.body;

    // Verify patient exists
    const patient = await Patient.findById(patientId);
    if (!patient) return res.status(404).json({ message: "Patient not found" });

    const newAppointment = new Appointment({
      patient: patientId,
      dentist: req.user._id,
      date,
      time,
      type,
      status: "Pending" // Default status for new appointments
    });

    await newAppointment.save();
    
    // Return the saved appointment with populated patient info
    const populatedAppointment = await Appointment.findById(newAppointment._id).populate("patient", "name email phone");

    res.status(201).json({ message: "Appointment created", appointment: populatedAppointment });
  } catch (error) {
    console.error("Create Appointment Error:", error);
    res.status(500).json({ message: "Failed to create appointment" });
  }
};

// 3. RESCHEDULE APPOINTMENT
// Matches your "Reschedule" button
export const rescheduleAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { newDate, newTime } = req.body;

    const appointment = await Appointment.findOneAndUpdate(
      { _id: id, dentist: req.user._id }, // Ensure this dentist owns the appointment
      { date: newDate, time: newTime, status: "Confirmed" },
      { new: true }
    ).populate("patient", "name email phone");

    if (!appointment) return res.status(404).json({ message: "Appointment not found" });

    res.status(200).json({ message: "Appointment rescheduled", appointment });
  } catch (error) {
    console.error("Reschedule Error:", error);
    res.status(500).json({ message: "Failed to reschedule appointment" });
  }
};

// 4. CANCEL APPOINTMENT
// Matches your "Cancel" button
export const cancelAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findOneAndUpdate(
      { _id: id, dentist: req.user._id },
      { status: "Cancelled" }, // We don't delete it, just mark it cancelled for records
      { new: true }
    ).populate("patient", "name email phone");

    if (!appointment) return res.status(404).json({ message: "Appointment not found" });

    res.status(200).json({ message: "Appointment cancelled", appointment });
  } catch (error) {
    console.error("Cancel Error:", error);
    res.status(500).json({ message: "Failed to cancel appointment" });
  }
};

// 5. GET ALL PATIENTS (For select dropdown in modal)
export const getPatientsList = async (req, res) => {
  try {
    const patients = await Patient.find({}).sort({ name: 1 });
    res.status(200).json(patients);
  } catch (error) {
    console.error("Fetch Patients Error:", error);
    res.status(500).json({ message: "Failed to fetch patients" });
  }
};