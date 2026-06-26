import express from "express";
import http from "http"; // 1. Added http
import { Server } from "socket.io"; // 2. Added Socket.io
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors"; 

// Import Routes
import authRoutes from "./routes/authRoutes.js"; 
import dashboardRoutes from "./routes/dashboardRoutes.js"; 
import appointmentRoutes from "./routes/appointmentRoutes.js"; 
import patientRoutes from "./routes/patientRoutes.js";
import treatmentRoutes from "./routes/treatmentRoutes.js";
import recordRoutes from "./routes/recordRoutes.js";
import billingRoutes from "./routes/billingRoutes.js";
import messageRoutes from "./routes/messageRoutes.js"; // 3. Added Message Routes

dotenv.config();

const app = express();
const server = http.createServer(app); // 4. Create HTTP server from app

// Initialize Socket.io
const io = new Server(server, { 
    cors: { origin: "*" } 
});

// Socket.io connection logic
io.on("connection", (socket) => {
    console.log("User connected:", socket.id);
    socket.on("join_chat", (chatId) => socket.join(chatId));
    socket.on("send_message", (data) => {
        io.to(data.chatId).emit("receive_message", data);
    });
});

// Middleware
app.use(express.json());
app.use(cors()); 

// Use Routes
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes); 
app.use("/api/appointments", appointmentRoutes); 
app.use("/api/patients", patientRoutes);
app.use("/api/treatments", treatmentRoutes);
app.use("/api/records", recordRoutes);
app.use("/api/billing", billingRoutes);
app.use("/api/messages", messageRoutes); // 5. Added Message Routes

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

  // 6. Use server.listen instead of app.listen
  server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
};

startServer();