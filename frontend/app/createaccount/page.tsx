"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function CreateAccount() {
  const [selectedRole, setSelectedRole] = useState<string>("Dentist");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const roles = ["Dentist", "Assistant", "Patient"];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ type: "", text: "" }); // Clear previous messages

    // 1. Basic Frontend Validation
    if (formData.password !== formData.confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match." });
      return;
    }

    setIsLoading(true);

    // 2. Prepare the payload matching the backend schema
    const payload = {
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      role: selectedRole,
    };

    try {
      // 3. Send data to the Express backend
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      // 4. Handle response from the server
      if (!response.ok) {
        throw new Error(data.message || "Registration failed. Please try again.");
      }

      // Success!
      setMessage({ type: "success", text: "Account created successfully!" });
      console.log("Server Response:", data);
      
      // Optional: Save the token to localStorage here if you want to keep them logged in
      // localStorage.setItem("token", data.token);

      // Optional: Clear form after success
      setFormData({ fullName: "", email: "", phone: "", password: "", confirmPassword: "" });

    } catch (error: any) {
      console.error("Error submitting form:", error);
      setMessage({ type: "error", text: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex w-full font-sans bg-white">
      {/* Left Panel - Branding */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="hidden lg:flex lg:w-[45%] bg-[#1c2b65] relative flex-col justify-center px-16 overflow-hidden fixed h-full"
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
            <Image src="/logo.png" alt="Dentplus Logo" width={80} height={80} />
          </motion.div>

          <h1 className="text-white text-5xl font-extrabold leading-tight tracking-wide">
            Join Our <br />
            Dental Care <br />
            Community
          </h1>
        </div>
      </motion.div>

      {/* Right Panel - Form Container */}
      <div className="w-full lg:w-[55%] lg:ml-[45%] flex items-center justify-center p-6 sm:p-12 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-[500px] pt-8 lg:pt-0"
        >
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-4xl font-extrabold text-black mb-2">Create Account</h2>
            <p className="text-gray-500 font-medium">Fill in your details to get started</p>
          </div>

          {/* Status Message Display */}
          {message.text && (
            <div className={`p-4 mb-6 rounded-lg text-sm font-medium ${message.type === 'error' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-green-50 text-green-600 border border-green-200'}`}>
              {message.text}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Role Selector */}
            <div className="space-y-3 mb-6">
              <label className="block text-[15px] font-bold text-black">Register as</label>
              <div className="flex flex-wrap gap-4">
                {roles.map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setSelectedRole(role)}
                    className={`flex-1 py-3 px-4 rounded-xl font-medium text-sm transition-all border ${
                      selectedRole === role
                        ? "bg-[#dbeafe] border-[#186ade] text-black shadow-sm"
                        : "bg-white border-gray-300 text-black hover:border-gray-400"
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            {/* Inputs... */}
            <div className="space-y-1.5">
              <label className="block text-[14px] font-medium text-black">Full Name</label>
              <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} className="w-full bg-white border border-gray-300 text-black rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#186ade] focus:border-transparent transition-all" required disabled={isLoading} />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[14px] font-medium text-black">Email Address</label>
              <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full bg-white border border-gray-300 text-black rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#186ade] focus:border-transparent transition-all" required disabled={isLoading} />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[14px] font-medium text-black">Phone Number</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full bg-white border border-gray-300 text-black rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#186ade] focus:border-transparent transition-all" required disabled={isLoading} />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[14px] font-medium text-black">Password</label>
              <input type="password" name="password" value={formData.password} onChange={handleInputChange} className="w-full bg-white border border-gray-300 text-black rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#186ade] focus:border-transparent transition-all" required disabled={isLoading} />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[14px] font-medium text-black">Confirm Password</label>
              <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} className="w-full bg-white border border-gray-300 text-black rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#186ade] focus:border-transparent transition-all" required disabled={isLoading} />
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={!isLoading ? { scale: 1.01 } : {}}
              whileTap={!isLoading ? { scale: 0.99 } : {}}
              type="submit"
              disabled={isLoading}
              className={`w-full font-bold py-3.5 rounded-xl transition-all mt-6 text-[15px] shadow-md flex justify-center items-center ${isLoading ? 'bg-gray-400 cursor-not-allowed text-gray-200' : 'bg-[#186ade] hover:bg-[#145bbf] text-white'}`}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Creating...
                </span>
              ) : (
                "Create Account"
              )}
            </motion.button>
          </form>

          {/* Sign In Link */}
          <p className="text-center text-[15px] text-gray-600 mt-8 font-medium pb-8 lg:pb-0">
            Already have an account?{" "}
            <a href="#" className="text-[#00b4d8] font-bold hover:text-blue-600 transition-colors">Sign in</a>
          </p>
        </motion.div>
      </div>
    </div>
  );
}