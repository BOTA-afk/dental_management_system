import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// --- REGISTER USER ---
export const registerUser = async (req, res) => {
  try {
    const { fullName, email, phone, password, role } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ fullName, email, phone, password: hashedPassword, role });
    await newUser.save();

    const token = jwt.sign(
      { userId: newUser._id, role: newUser.role }, 
      process.env.JWT_SECRET || "fallback_secret_key", 
      { expiresIn: "7d" }
    );

    res.status(201).json({ 
      message: "Account created", 
      token, 
      user: { id: newUser._id, fullName: newUser.fullName, email: newUser.email, role: newUser.role } 
    });
  } catch (error) {
    res.status(500).json({ message: "Server error during registration" });
  }
};

// --- LOGIN USER (With Diagnostics) ---
export const loginUser = async (req, res) => {
  console.log("\n--- 🔐 LOGIN ATTEMPT ---");
  console.log("1. Data received from Frontend:", req.body);

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      console.log("❌ Missing email or password in request!");
      return res.status(400).json({ message: "Please provide email and password" });
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: cleanEmail });
    
    if (!user) {
      console.log(`❌ Fail: Email '${cleanEmail}' does not exist in the database.`);
      return res.status(400).json({ message: "Invalid email or password" });
    }
    
    console.log(`✅ User found in DB: ${user.email}`);

    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      console.log("❌ Fail: Passwords do not match!");
      return res.status(400).json({ message: "Invalid email or password" });
    }

    console.log("✅ Success! Generating token...");

    const token = jwt.sign(
      { userId: user._id, role: user.role }, 
      process.env.JWT_SECRET || "fallback_secret_key", 
      { expiresIn: "7d" }
    );

    res.status(200).json({ 
      message: "Login successful", 
      token, 
      user: { id: user._id, fullName: user.fullName, email: user.email, role: user.role } 
    });

  } catch (error) {
    console.error("❌ CRASH IN LOGIN:", error.message);
    res.status(500).json({ message: "Server error during login" });
  }
};