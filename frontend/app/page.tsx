"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function DentistLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });
    setIsLoading(true);

    try {
      // 1. Send login request to your Express backend
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      // 2. Handle errors (e.g., wrong password or user doesn't exist)
      if (!response.ok) {
        throw new Error(data.message || "Login failed. Please check your credentials.");
      }

      // 3. Success! Save the token and user data
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setMessage({ type: "success", text: "Login successful! Redirecting..." });

      // 4. Role-Based Dynamic Routing
      // We look at the role returned from your MongoDB database and route accordingly.
      setTimeout(() => {
        const userRole = data.user.role;
        
        if (userRole === "Dentist") {
          router.push("/dentistdashboard");
        } else if (userRole === "Assistant") {
          router.push("/assistantdashboard"); // You will need to create this folder/page next
        } else if (userRole === "Patient") {
          router.push("/patientdashboard");   // You will need to create this folder/page next
        } else {
          // Fallback if role is missing or unrecognized
          setMessage({ type: "error", text: "Error determining user role." });
          setIsLoading(false);
        }
      }, 1000);

    } catch (error: any) {
      console.error("Error signing in:", error);
      setMessage({ type: "error", text: error.message });
      setIsLoading(false); // Make sure to stop loading if there's an error before the timeout
    }
  };

  return (
    <div className="min-h-screen flex w-full font-sans bg-[#c8d6db]">
      {/* Left Panel - Branding (Hidden on mobile) */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="hidden lg:flex lg:w-[45%] bg-[#1c2b65] relative flex-col justify-center px-16 overflow-hidden"
      >
        <div className="absolute top-[-5%] right-[-10%] w-[400px] h-[400px] bg-[#3a6fa8] rounded-full blur-[120px] opacity-40 mix-blend-screen pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#1a57a1] rounded-full blur-[150px] opacity-40 mix-blend-screen pointer-events-none" />

        <div className="relative z-10 space-y-12">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="bg-white p-2 rounded-2xl w-[100px] h-[100px] flex items-center justify-center shadow-lg"
          >
            <div>
             <Image src="/logo.png" alt="Dentplus Logo" width={80} height={80} />
            </div>
          </motion.div>

          <h1 className="text-white text-5xl font-extrabold leading-tight tracking-wide">
            Welcome to <br />
            Dental Management <br />
            System
          </h1>
        </div>
      </motion.div>

      {/* Right Panel - Form Container */}
      <div className="w-full lg:w-[55%] flex items-center justify-center p-4 sm:p-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="bg-white rounded-[2rem] w-full max-w-[540px] p-10 sm:p-12 shadow-2xl border border-white/60"
        >
          <p className="text-center text-gray-400 font-medium mb-10 text-base">
            Sign in to your Dentplus account
          </p>

          {/* Status Message Display */}
          {message.text && (
            <div className={`p-4 mb-6 rounded-lg text-sm font-medium ${message.type === 'error' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-green-50 text-green-600 border border-green-200'}`}>
              {message.text}
            </div>
          )}

          {/* Divider */}
          <div className="flex items-center justify-center mb-10">
            <div className="h-[1px] bg-gray-300 w-full" />
            <span className="px-4 text-[11px] font-bold text-gray-400 tracking-widest whitespace-nowrap">
              ENTER CREDENTIALS
            </span>
            <div className="h-[1px] bg-gray-300 w-full" />
          </div>

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="block text-[15px] font-bold text-gray-900">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full bg-[#424242] text-white placeholder-gray-400 rounded-lg px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#186ade] transition-all"
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[15px] font-bold text-gray-900">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full bg-[#424242] text-white placeholder-gray-400 rounded-lg px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#186ade] transition-all"
                required
                disabled={isLoading}
              />
            </div>

            <div className="flex justify-end pt-1">
              <a
                href="/forgotpassword"
                className="text-sm font-bold text-[#186ade] hover:text-blue-800 transition-colors"
              >
                Forgot Password?
              </a>
            </div>

            <motion.button
              whileHover={!isLoading ? { scale: 1.015 } : {}}
              whileTap={!isLoading ? { scale: 0.985 } : {}}
              type="submit"
              disabled={isLoading}
              className={`w-full font-bold py-4 rounded-lg transition-colors mt-2 text-[15px] flex justify-center items-center ${isLoading ? 'bg-gray-400 cursor-not-allowed text-gray-200' : 'bg-[#186ade] hover:bg-[#145bbf] text-white'}`}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Signing in...
                </span>
              ) : (
                "Sign in"
              )}
            </motion.button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-8 font-medium">
            Don't have an account?{" "}
            <a
              href="/createaccount"
              className="text-[#186ade] font-bold hover:text-blue-800 transition-colors"
            >
              Register here
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
}