import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors"; 

// 1. Import all Routes
import authRoutes from "./routes/authRoutes.js"; 
import dashboardRoutes from "./routes/dashboardRoutes.js"; 
import appointmentRoutes from "./routes/appointmentRoutes.js"; 
import patientRoutes from "./routes/patientRoutes.js"; // <-- ADDED THIS
import treatmentRoutes from "./routes/treatmentRoutes.js";
import recordRoutes from "./routes/recordRoutes.js";
import billingRoutes from "./routes/billingRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors()); 

// 2. Use Routes
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes); 
app.use("/api/appointments", appointmentRoutes); 
app.use("/api/patients", patientRoutes); // <-- ADDED THIS
app.use("/api/treatments", treatmentRoutes);
app.use("/api/records", recordRoutes);
app.use("/api/billing", billingRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// MongoDB Connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};

// Start Server
const startServer = async () => {
  await connectDB();
  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
};

startServer();