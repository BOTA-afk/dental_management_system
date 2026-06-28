"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Search, Bell, Plus, X, Check
} from "lucide-react";
import Sidebar from "@/app/components/Sidebar";

export default function PatientsPage() {
  const pathname = usePathname();
  const router = useRouter();

  
  
  // --- STATE ---
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  
  // REAL DATA STATES (Replacing Mock Data)
  const [patients, setPatients] = useState<any[]>([]);
  const [stats, setStats] = useState([
    { title: "Total Patients", count: "0", bg: "bg-[#2577fa]" },
    { title: "Active Patients", count: "0", bg: "bg-[#28b5ee]" },
    { title: "New this month", count: "0", bg: "bg-[#2a839a]" },
    { title: "Inactive", count: "0", bg: "bg-[#f23b3b]" },
  ]);
  
  const [formData, setFormData] = useState({
    name: "", dob: "", gender: "", phone: "", email: "", address: ""
  });

  // --- FETCH REAL PATIENTS FROM DATABASE ---
  const fetchPatients = async (authToken: string) => {
    try {
      const response = await fetch("http://localhost:5000/api/patients", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (response.ok) {
        const data = await response.json();
        setPatients(data.patients); // Update table with real data
        setStats(data.stats);       // Update top cards with real stats
      }
    } catch (error) {
      console.error("Failed to fetch patients:", error);
    }
  };

  // --- SECURITY CHECK & INITIAL FETCH ---
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      router.push("/login");
    } else {
      setToken(storedToken);
      fetchPatients(storedToken); // Fetch data as soon as page loads
    }
  }, [router]);

  // --- HANDLERS ---
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSavePatient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.dob || !formData.gender || !formData.phone || !formData.address) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/patients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, 
        },
        body: JSON.stringify({
          ...formData,
          age: formData.dob ? `${new Date().getFullYear() - new Date(formData.dob).getFullYear()} years` : "N/A",
          status: "Active"
        }),
      });

      if (!response.ok) throw new Error("Failed to save patient");

      // Reset form, close modal, and INSTANTLY refresh the table!
      setFormData({ name: "", dob: "", gender: "", phone: "", email: "", address: "" });
      setIsModalOpen(false);
      
      if (token) fetchPatients(token); // <--- This is the magic line that updates the UI!
      
    } catch (error) {
      console.error("Error saving patient:", error);
      alert("Failed to save patient. Check your backend terminal for errors.");
    }
  };

  return (
    <div className="min-h-screen flex w-full font-sans bg-[#f4f7f6]">
      <Sidebar />

      {/* MAIN CONTENT */}
      <main className="flex-1 ml-[260px] flex flex-col h-screen overflow-hidden">
        <header className="h-20 flex items-center justify-between px-8 bg-[#f4f7f6]">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Patients</h1>
            <p className="text-gray-600 mt-1">Manage your patient records</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input type="text" placeholder="Search..." className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
            </div>
            <button className="text-gray-600 hover:text-black"><Bell size={24} /></button>
            <div className="w-10 h-10 bg-[#00a7c4] text-white rounded-full flex items-center justify-center font-bold">DS</div>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-8 pt-4">
          
          {/* REAL STATS CARDS */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className={`${stat.bg} rounded-[20px] p-6 text-white shadow-sm flex flex-col justify-between h-32`}>
                <div className="text-4xl font-bold">{stat.count}</div>
                <div className="text-sm font-medium opacity-90 leading-tight w-20">{stat.title}</div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-72 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
              />
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-[#1a73e8] hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm"
            >
              <Plus size={18} />
              Add New Patients
            </button>
          </div>

          {/* REAL DATABASE TABLE */}
          <div className="bg-white rounded-[20px] border border-gray-200 overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-gray-900">
                  <th className="py-4 px-6 font-bold">Patient</th>
                  <th className="py-4 px-6 font-bold">Contact</th>
                  <th className="py-4 px-6 font-bold">Last Visit</th>
                  <th className="py-4 px-6 font-bold">Next Appointment</th>
                  <th className="py-4 px-6 font-bold text-center">Visits</th>
                  <th className="py-4 px-6 font-bold">Status</th>
                  <th className="py-4 px-6 font-bold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {patients.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-gray-500 font-medium">
                      No patients found. Add a new patient to get started!
                    </td>
                  </tr>
                ) : (
                  patients.map((patient) => (
                    <tr key={patient._id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#1a73e8] text-white flex items-center justify-center font-bold text-sm shrink-0">
                            {/* Auto-generate initials from real name */}
                            {patient.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-gray-900">{patient.name}</div>
                            <div className="text-sm text-gray-500">{patient.age}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-gray-600">{patient.phone}</td>
                      <td className="py-4 px-6 text-gray-600">{patient.lastVisit}</td>
                      <td className="py-4 px-6 text-gray-600">{patient.nextAppointment}</td>
                      <td className="py-4 px-6 text-center text-gray-600">{patient.visits}</td>
                      <td className="py-4 px-6">
                        <span className={`px-4 py-1 rounded-full text-sm font-semibold border ${
                          patient.status === "Active" ? "bg-blue-50 text-blue-600 border-blue-200" : "bg-red-50 text-red-500 border-red-200"
                        }`}>
                          {patient.status}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex gap-2">
                          <button className="px-4 py-1.5 rounded-full text-sm font-semibold text-blue-600 border border-blue-300 bg-blue-50 hover:bg-blue-100 transition-colors">View</button>
                          <button className="px-4 py-1.5 rounded-full text-sm font-semibold text-gray-700 border border-gray-400 bg-gray-300 hover:bg-gray-400 transition-colors">Edit</button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* --- ADD NEW PATIENT MODAL OVERLAY --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-[420px] p-8 shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Add New Patient</h2>
              <p className="text-gray-500 text-sm mt-1">Create a new patient record</p>
            </div>

            <form onSubmit={handleSavePatient} className="space-y-4">
              <div className="mb-4">
                <h3 className="font-bold text-lg text-gray-900 mb-4 border-b pb-2">Patient Information</h3>
                
                <div className="space-y-1 mb-3">
                  <label className="text-sm font-semibold text-gray-700">Name <span className="text-red-500">*</span></label>
                  <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Enter Full Name" className="w-full px-4 py-2.5 bg-[#e8ebed] border-transparent rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none" required />
                </div>
                <div className="space-y-1 mb-3">
                  <label className="text-sm font-semibold text-gray-700">Date Of Birth <span className="text-red-500">*</span></label>
                  <input type="date" name="dob" value={formData.dob} onChange={handleInputChange} className="w-full px-4 py-2.5 bg-[#e8ebed] border-transparent rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-gray-600" required />
                </div>
                <div className="space-y-1 mb-3">
                  <label className="text-sm font-semibold text-gray-700">Gender <span className="text-red-500">*</span></label>
                  <select name="gender" value={formData.gender} onChange={handleInputChange} className="w-full px-4 py-2.5 bg-[#e8ebed] border-transparent rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-gray-600 appearance-none" required>
                    <option value="" disabled>Select Male or Female</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="space-y-1 mb-3">
                  <label className="text-sm font-semibold text-gray-700">Phone Number <span className="text-red-500">*</span></label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Enter Phone Number" className="w-full px-4 py-2.5 bg-[#e8ebed] border-transparent rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none" required />
                </div>
                <div className="space-y-1 mb-3">
                  <label className="text-sm font-semibold text-gray-700">Email</label>
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Enter Email" className="w-full px-4 py-2.5 bg-[#e8ebed] border-transparent rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none" />
                </div>
                <div className="space-y-1 mb-5">
                  <label className="text-sm font-semibold text-gray-700">Address <span className="text-red-500">*</span></label>
                  <input type="text" name="address" value={formData.address} onChange={handleInputChange} placeholder="Enter Address" className="w-full px-4 py-2.5 bg-[#e8ebed] border-transparent rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none" required />
                </div>
              </div>

              <div className="flex gap-3 justify-center pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex items-center gap-2 px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors">
                  <X size={18} /> Cancel
                </button>
                <button type="submit" className="flex items-center gap-2 px-8 py-2.5 bg-[#0066ff] text-white rounded-lg hover:bg-blue-700 font-medium transition-colors">
                  <Check size={18} /> Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}