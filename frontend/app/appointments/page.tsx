"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Home, Calendar as CalendarIcon, Users, ClipboardList, FileImage, 
  DollarSign, MessageSquare, LogOut, Search, Bell, Plus,
  CalendarDays, Clock, Phone, Mail, CheckCircle2, Clock4, AlertCircle, XCircle,
  User, LayoutGrid, ChevronDown
} from "lucide-react";

// --- Types ---
type AppointmentStatus = 'Confirmed' | 'In Progress' | 'Pending' | 'Cancelled';

interface Appointment {
  id: string;
  name: string;
  initials: string;
  treatment: string;
  date: string;
  time: string;
  phone: string;
  email: string;
  status: AppointmentStatus;
  avatarColor: string;
}

// --- Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function DentistAppointments() {
  const router = useRouter();
  const [user, setUser] = useState<{ fullName: string; role: string } | null>(null);

  
  
  // --- Data States ---
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<{ _id: string; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingData, setIsFetchingData] = useState(false);
  
  // --- Filter & Search States ---
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  // --- Modal States ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form Data
  const [formData, setFormData] = useState({
    doctor: "",
    treatment: "",
    date: "",
    time: "",
    note: "",
    patientId: ""
  });

  const timeSlots = [
    "10:00AM", "11:00AM", "12:00PM", "02:30PM", 
    "04:00PM", "05:00PM", "06:00PM"
  ];

  // --- API Fetch Function ---
  const fetchAppointments = useCallback(async (token: string, search: string, status: string) => {
    setIsFetchingData(true);
    try {
      const url = new URL("http://localhost:5000/api/appointments");
      if (search) url.searchParams.append("search", search);
      if (status !== "All") url.searchParams.append("status", status);

      const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        
        const formattedData: Appointment[] = data.map((apt: any, index: number) => {
          const dateObj = new Date(apt.date);
          const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

          return {
            id: apt._id,
            name: apt.patient?.name || "Unknown Patient",
            initials: getInitials(apt.patient?.name || "U P"),
            treatment: apt.type,
            date: formattedDate,
            time: apt.time,
            phone: apt.patient?.phone || "No phone",
            email: apt.patient?.email || "No email",
            status: apt.status as AppointmentStatus,
            avatarColor: getColorByIndex(index)
          };
        });

        setAppointments(formattedData);
      } else if (response.status === 401 || response.status === 403) {
        handleLogout();
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setIsFetchingData(false);
    }
  }, []);

  const fetchPatients = useCallback(async (token: string) => {
    try {
      const response = await fetch("http://localhost:5000/api/appointments/patients", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setPatients(data);
      }
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  }, []);

  // --- Role-Based Authentication & Initial Load ---
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    
    if (!storedUser || !token) {
      router.push("/login"); 
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    
    if (parsedUser.role !== "Dentist") {
      router.push("/login"); 
      return;
    }

    setUser(parsedUser);
    setIsLoading(false);
    
    fetchAppointments(token, searchQuery, activeFilter);
    fetchPatients(token);
  }, [router, fetchAppointments, fetchPatients, activeFilter]);

  const handleSearchSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const token = localStorage.getItem("token");
      if (token) fetchAppointments(token, searchQuery, activeFilter);
    }
  };

  // --- Action Handlers ---
  const handleCancelAppointment = async (appointmentId: string) => {
    const confirmCancel = window.confirm("Are you sure you want to cancel this appointment?");
    if (!confirmCancel) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch(`http://localhost:5000/api/appointments/${appointmentId}/cancel`, {
        method: "PUT",
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (response.ok) {
        setAppointments(prev => prev.map(apt => 
          apt.id === appointmentId ? { ...apt, status: "Cancelled" } : apt
        ));
      } else {
        alert("Failed to cancel appointment.");
      }
    } catch (error) {
      console.error("Error cancelling:", error);
    }
  };

  const submitNewAppointment = async () => {
    if (!formData.patientId || !formData.treatment || !formData.date || !formData.time) {
      alert("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://localhost:5000/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          patientId: formData.patientId, 
          date: formData.date,
          time: formData.time,
          type: formData.treatment,
          note: formData.note
        })
      });

      if (response.ok) {
        setIsModalOpen(false);
        setFormData({ doctor: "", treatment: "", date: "", time: "", note: "", patientId: "" });
        // Refresh the list
        if (token) fetchAppointments(token, searchQuery, activeFilter);
      } else {
        const errorData = await response.json();
        alert(`Failed to create: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error creating appointment:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  // --- UI Helpers ---
  const getInitials = (fullName: string) => {
    const names = fullName.split(" ");
    if (names.length >= 2) return `${names[0][0]}${names[1][0]}`.toUpperCase();
    return names[0].substring(0, 2).toUpperCase();
  };

  const getColorByIndex = (index: number) => {
    const colors = ["bg-blue-600", "bg-indigo-600", "bg-sky-600", "bg-[#00a8cc]"];
    return colors[index % colors.length];
  };

  const getStatusBadge = (status: AppointmentStatus) => {
    switch (status) {
      case 'Confirmed': return <span className="flex items-center gap-1.5 px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-bold"><CheckCircle2 className="w-3.5 h-3.5" /> Confirmed</span>;
      case 'In Progress': return <span className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-500 rounded-full text-xs font-bold border border-blue-100"><Clock4 className="w-3.5 h-3.5" /> In Progress</span>;
      case 'Pending': return <span className="flex items-center gap-1.5 px-3 py-1 bg-orange-50 text-orange-500 rounded-full text-xs font-bold border border-orange-100"><AlertCircle className="w-3.5 h-3.5" /> Pending</span>;
      case 'Cancelled': return <span className="flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-500 rounded-full text-xs font-bold border border-red-100"><XCircle className="w-3.5 h-3.5" /> Cancelled</span>;
      default: return null;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#e8ebed]">
        <p className="text-gray-600 font-medium">Verifying authorization...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex w-full font-sans bg-[#e8ebed]">
      
      {/* --- Sidebar --- */}
      <aside className="w-[260px] bg-white border-r border-gray-200 flex flex-col fixed h-full z-10">
        <div className="h-20 flex items-center px-8 border-b border-gray-100">
          <div className="flex items-center gap-2">
  <img 
    src="/logo.png" 
    alt="Dentplus Logo" 
    className="w-10 h-10 object-contain" 
  />
  <span className="text-xl font-bold text-gray-900">Dentplus</span>
</div>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
          {[
            { name: "Dashboard", icon: Home, active: false, path: "/dentistdashboard" },
            { name: "Appointments", icon: CalendarIcon, active: true, path: "/appointments" },
            { name: "Patients", icon: Users, active: false, path: "/patients" },
            { name: "Treatments", icon: ClipboardList, active: false, path: "#" },
            { name: "X-rays & docs", icon: FileImage, active: false, path: "#" },
            { name: "Billing", icon: DollarSign, active: false, path: "#" },
            { name: "Messages", icon: MessageSquare, active: false, path: "#" },
          ].map((item) => (
            <button
              key={item.name}
              onClick={() => { if (item.path !== "#") router.push(item.path); }}
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl font-medium transition-colors ${item.active ? "bg-gray-100 text-black font-bold" : "text-gray-600 hover:bg-gray-50 hover:text-black"}`}
            >
              <item.icon className={`w-5 h-5 ${item.active ? "text-black" : "text-gray-500"}`} />
              <span className="text-[15px]">{item.name}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 mb-4">
          <button onClick={handleLogout} className="w-full flex items-center gap-4 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl font-bold transition-colors">
            <LogOut className="w-5 h-5" />
            <span className="text-[15px]">Logout</span>
          </button>
        </div>
      </aside>

      {/* --- Main Content --- */}
      <main className="flex-1 ml-[260px] flex flex-col h-screen overflow-hidden">
        
        {/* Header */}
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-10 flex-shrink-0">
          <div>
             <h1 className="text-3xl font-extrabold text-black">Appointments</h1>
             <p className="text-gray-500 font-medium text-sm mt-0.5">Manage your appointment schedule</p>
          </div>
          <div className="flex items-center gap-6">
            <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
              <Bell className="w-6 h-6" />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="w-11 h-11 rounded-full bg-[#00a8cc] text-white flex items-center justify-center font-bold text-sm shadow-sm">
              {user ? getInitials(user.fullName) : "DR"}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-10">
          <div className="max-w-6xl mx-auto">
            
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div className="flex gap-2">
                {["All", "Pending", "Confirmed", "Cancelled"].map(filter => (
                  <button 
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`px-6 py-2.5 rounded-xl font-bold shadow-sm transition-colors ${activeFilter === filter ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                  >
                    {filter}
                  </button>
                ))}
              </div>

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-sm transition-colors"
              >
                <Plus className="w-5 h-5" />
                New Appointment
              </motion.button>
            </div>

            {/* Search Bar */}
            <div className="relative mb-8 max-w-2xl">
              <Search className="w-6 h-6 absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchSubmit}
                placeholder="Search by patient name or treatment (Press Enter)..." 
                className="w-full pl-14 pr-6 py-4 rounded-2xl border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-lg font-semibold text-black placeholder-gray-400"
              />
            </div>

            {/* Content Loading State */}
            {isFetchingData ? (
              <div className="flex justify-center py-20">
                <svg className="animate-spin h-10 w-10 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              </div>
            ) : appointments.length === 0 ? (
               <div className="text-center py-20 bg-white rounded-3xl border border-gray-100">
                 <p className="text-gray-500 text-lg font-medium">No appointments found matching your criteria.</p>
               </div>
            ) : (
              /* Appointments Grid */
              <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {appointments.map((apt) => (
                  <motion.div key={apt.id} variants={itemVariants} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full ${apt.avatarColor} text-white flex items-center justify-center font-bold text-sm shadow-sm`}>{apt.initials}</div>
                        <div>
                          <h3 className="font-extrabold text-black text-lg">{apt.name}</h3>
                          <p className="text-gray-800 font-medium text-sm">{apt.treatment}</p>
                        </div>
                      </div>
                      {getStatusBadge(apt.status)}
                    </div>

                    <div className="grid grid-cols-2 gap-y-4 gap-x-2 my-4">
                      <div className="flex items-center gap-2 text-black text-xs font-semibold"><CalendarDays className="w-4 h-4 text-black" />{apt.date}</div>
                      <div className="flex items-center gap-2 text-black text-xs font-semibold"><Clock className="w-4 h-4 text-black" />{apt.time}</div>
                      <div className="flex items-center gap-2 text-black text-xs font-semibold"><Phone className="w-4 h-4 text-black" />{apt.phone}</div>
                      <div className="flex items-center gap-2 text-black text-xs font-semibold truncate"><Mail className="w-4 h-4 text-black flex-shrink-0" /><span className="truncate underline">{apt.email}</span></div>
                    </div>

                    <div className="mt-auto pt-4 flex gap-3">
                      <button className="flex-1 py-2 px-4 rounded-xl border border-blue-200 text-blue-600 font-bold text-xs hover:bg-blue-50 transition-colors">View Details</button>
                      <button 
                        onClick={() => alert('Reschedule modal coming soon!')}
                        disabled={apt.status === 'Cancelled'}
                        className="flex-1 py-2 px-4 rounded-xl bg-gray-200 text-black font-bold text-xs hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Reschedule
                      </button>
                      <button 
                        onClick={() => handleCancelAppointment(apt.id)}
                        disabled={apt.status === 'Cancelled'}
                        className="flex-1 py-2 px-4 rounded-xl bg-red-100 text-red-500 font-bold text-xs hover:bg-red-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Cancel
                      </button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </main>

      {/* --- NEW APPOINTMENT MODAL --- */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl p-8 w-full max-w-[500px] shadow-2xl relative"
            >
              <h2 className="text-3xl font-bold text-black mb-1">New appointment</h2>
              <p className="text-gray-500 text-sm mb-6">Fill in the details below to schedule your appointment</p>

              <div className="space-y-5">
                
                {/* Select Patient */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-bold text-black">Select Patient</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select 
                      value={formData.patientId}
                      onChange={(e) => setFormData({...formData, patientId: e.target.value})}
                      className="w-full pl-12 pr-10 py-3.5 bg-white border border-gray-300 rounded-xl text-gray-700 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                    >
                      <option value="" disabled>Select a patient</option>
                      {patients.map((pat) => (
                        <option key={pat._id} value={pat._id}>
                          {pat.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Select Doctor */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-bold text-black">Select Doctor</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select 
                      value={formData.doctor}
                      onChange={(e) => setFormData({...formData, doctor: e.target.value})}
                      className="w-full pl-12 pr-10 py-3.5 bg-white border border-gray-300 rounded-xl text-gray-700 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                    >
                      <option value="" disabled>Select a doctor</option>
                      <option value="Dr. Erandi">Dr. Erandi</option>
                      <option value="Dr. Perera">Dr. Perera</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Select Treatment */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-bold text-black">Select Treatment</label>
                  <div className="relative">
                    <LayoutGrid className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select 
                      value={formData.treatment}
                      onChange={(e) => setFormData({...formData, treatment: e.target.value})}
                      className="w-full pl-12 pr-10 py-3.5 bg-white border border-gray-300 rounded-xl text-gray-700 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                    >
                      <option value="" disabled>Select treatment type</option>
                      <option value="Regular Checkup">Regular Checkup</option>
                      <option value="Root Canal">Root Canal</option>
                      <option value="Teeth Cleaning">Teeth Cleaning</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Select Date */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-bold text-black">Select Date</label>
                  <div className="relative">
                    <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input 
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                      className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-300 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                    />
                  </div>
                </div>

                {/* Select Time Slot */}
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-black">Select time slot</label>
                  <div className="flex flex-wrap gap-3">
                    {timeSlots.map((time) => {
                      const isAvailable = time === "12:00PM";
                      return (
                        <button
                          key={time}
                          type="button"
                          onClick={() => setFormData({...formData, time: isAvailable ? "12:00PM" : time})}
                          className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors ${
                            formData.time === (isAvailable ? "12:00PM" : time)
                              ? "bg-blue-600 border-blue-600 text-white"
                              : "bg-white border-gray-300 text-gray-700 hover:border-blue-500"
                          }`}
                        >
                          {time}
                          {isAvailable && <span className="block text-[10px] leading-tight">Available</span>}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Note (Optional) */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-bold text-black">Note(Optional)</label>
                  <textarea 
                    rows={3}
                    value={formData.note}
                    onChange={(e) => setFormData({...formData, note: e.target.value})}
                    className="w-full p-4 bg-white border border-gray-300 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-medium"
                  />
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-4">
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-2.5 rounded-full border border-gray-300 text-gray-700 font-bold hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={submitNewAppointment}
                    disabled={isSubmitting}
                    className="px-6 py-2.5 rounded-full bg-[#0066ff] text-white font-bold hover:bg-blue-700 transition-colors disabled:opacity-70 flex items-center gap-2"
                  >
                    {isSubmitting ? "Booking..." : "Confirm booking"}
                  </button>
                </div>

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}