"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { 
  Home, Calendar, Users, ClipboardList, FileImage, 
  DollarSign, MessageSquare, LogOut, Search, Bell, 
  CheckCircle2, AlertCircle 
} from "lucide-react";

// --- Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function DentistDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<{ fullName: string; role: string } | null>(null);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  // --- Authentication & Data Fetching ---
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    
    if (!storedUser || !token) {
      router.push("/login"); 
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    
    if (parsedUser.role !== "Dentist") {
      router.push("/login"); // Or unauthorized page
      return;
    }

    setUser(parsedUser);

    // Fetch the real data from your backend
    const fetchDashboardData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/dashboard/dentist", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` // Send token for security
          }
        });

        if (response.ok) {
          const data = await response.json();
          setDashboardData(data);
        } else {
          // If token is expired or invalid, log them out
          if (response.status === 401 || response.status === 403) {
            handleLogout();
          }
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [router]);

  // Helpers
  const getDoctorName = (fullName: string) => fullName.split(" ")[0];
  
  const getInitials = (fullName: string) => {
    const names = fullName.split(" ");
    if (names.length >= 2) return `${names[0][0]}${names[1][0]}`.toUpperCase();
    return names[0].substring(0, 2).toUpperCase();
  };

  // Color generator for dynamic avatars
  const getColorByIndex = (index: number) => {
    const colors = ["bg-blue-500", "bg-blue-600", "bg-[#00a8cc]", "bg-indigo-500"];
    return colors[index % colors.length];
  };

  if (isLoading || !dashboardData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#e8ebed]">
        <svg className="animate-spin h-8 w-8 text-blue-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
        <p className="text-gray-600 font-medium">Loading Dashboard...</p>
      </div>
    );
  }

  // Map the fetched data to your UI structure
  const displayStats = [
    { title: "Today's Appointment", value: dashboardData.stats.todaysAppointments, trend: "+8%", icon: Calendar, color: "bg-blue-500", text: "text-blue-500" },
    { title: "Total patients", value: dashboardData.stats.totalPatients, trend: "+12%", icon: Users, color: "bg-green-500", text: "text-green-500" },
    { title: "Pending Reviews", value: dashboardData.stats.pendingReviews, trend: "+3%", icon: ClipboardList, color: "bg-orange-500", text: "text-orange-500" },
    { title: "This Month Revenue", value: `$${dashboardData.stats.thisMonthRevenue.toLocaleString()}`, trend: "+18%", icon: DollarSign, color: "bg-purple-500", text: "text-purple-500" },
  ];

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

     {/* Navigation */}
        <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
          {[
            // 1. Added the 'path' property to each item
            { name: "Dashboard", icon: Home, active: true, path: "/dentistdashboard" },
            { name: "Appointments", icon: Calendar, active: false, path: "/appointments" },
            { name: "Patients", icon: Users, active: false, path: "/patients" },
            { name: "Treatments", icon: ClipboardList, active: false, path: "#" },
            { name: "X-rays & docs", icon: FileImage, active: false, path: "#" },
            { name: "Billing", icon: DollarSign, active: false, path: "#" },
            { name: "Messages", icon: MessageSquare, active: false, path: "#" },
          ].map((item) => (
            <button
              key={item.name}
              // 2. Added the onClick handler here!
              onClick={() => {
                if (item.path !== "#") {
                  router.push(item.path);
                }
              }}
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl font-medium transition-colors ${
                item.active 
                  ? "bg-gray-100 text-black font-bold" 
                  : "text-gray-600 hover:bg-gray-50 hover:text-black"
              }`}
            >
              <item.icon className={`w-5 h-5 ${item.active ? "text-black" : "text-gray-500"}`} />
              <span className="text-[15px]">{item.name}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 mb-4">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl font-bold transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-[15px]">Logout</span>
          </button>
        </div>
      </aside>

      {/* --- Main Content --- */}
      <main className="flex-1 ml-[260px] flex flex-col h-screen overflow-hidden">
        
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-10 flex-shrink-0">
          <h1 className="text-2xl font-extrabold text-black">
            Welcome back, Dr. {user ? getDoctorName(user.fullName) : "Doctor"}
          </h1>

          <div className="flex items-center gap-6">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="pl-10 pr-4 py-2.5 w-[280px] rounded-full border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm font-medium"
              />
            </div>
            
            <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
              <Bell className="w-6 h-6" />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>

            <div className="w-11 h-11 rounded-full bg-[#00a8cc] text-white flex items-center justify-center font-bold text-sm shadow-sm cursor-pointer hover:opacity-90 transition-opacity">
              {user ? getInitials(user.fullName) : "DR"}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-10">
          <motion.div 
            variants={containerVariants} 
            initial="hidden" 
            animate="show" 
            className="max-w-6xl mx-auto space-y-8"
          >
            
            {/* Top Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {displayStats.map((stat, index) => (
                <motion.div key={index} variants={itemVariants} className="bg-white p-6 rounded-[1.5rem] shadow-sm border border-gray-100 flex flex-col justify-between h-[160px]">
                  <div className="flex justify-between items-start">
                    <div className={`w-14 h-14 rounded-2xl ${stat.color} flex items-center justify-center shadow-sm`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <span className={`font-bold text-sm ${stat.text}`}>{stat.trend}</span>
                  </div>
                  <div>
                    <h3 className="text-3xl font-extrabold text-black mb-1">{stat.value}</h3>
                    <p className="text-gray-500 font-medium text-[13px]">{stat.title}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Today's Appointments */}
              <motion.div variants={itemVariants} className="lg:col-span-2 bg-white rounded-[1.5rem] shadow-sm border border-gray-100 p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-black">Today's Appointments</h2>
                  <button className="text-blue-600 font-bold text-sm hover:text-blue-800">View All</button>
                </div>
                
                <div className="space-y-4">
                  {dashboardData.appointments.length === 0 ? (
                     <p className="text-gray-500 font-medium text-center py-4">No appointments scheduled for today.</p>
                  ) : (
                    dashboardData.appointments.map((apt: any, index: number) => (
                      <div key={apt.id} className="flex items-center justify-between p-4 bg-[#f4f5f7] rounded-2xl hover:bg-gray-100 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-full ${getColorByIndex(index)} text-white flex items-center justify-center font-bold text-sm`}>
                            {getInitials(apt.name)}
                          </div>
                          <div>
                            <h4 className="font-bold text-black text-[15px]">{apt.name}</h4>
                            <p className="text-gray-600 text-sm font-medium">{apt.type}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-8">
                          <div className="flex items-center gap-2 text-gray-700 font-medium">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            <span className="text-sm">{apt.time}</span>
                          </div>
                          {apt.status === "success" ? (
                            <CheckCircle2 className="w-6 h-6 text-green-500" />
                          ) : (
                            <AlertCircle className="w-6 h-6 text-red-500" />
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>

              {/* Recent Patients */}
              <motion.div variants={itemVariants} className="bg-white rounded-[1.5rem] shadow-sm border border-gray-100 p-8">
                <h2 className="text-xl font-bold text-black mb-6">Recent Patients</h2>
                
                <div className="space-y-6">
                  {dashboardData.recentPatients.length === 0 ? (
                    <p className="text-gray-500 font-medium text-center py-4">No recent patients found.</p>
                  ) : (
                    dashboardData.recentPatients.map((patient: any) => (
                      <div key={patient.id} className="flex flex-col border-b border-gray-100 pb-5 last:border-0 last:pb-0">
                        <h4 className="font-bold text-black text-[15px] mb-1">{patient.name}</h4>
                        <p className="text-gray-600 text-sm font-medium mb-1">{patient.treatment}</p>
                        {/* You would typically format the ISO date here to "2 days ago" using a library like date-fns, keeping it simple for now */}
                        <p className="text-gray-400 text-xs font-semibold">Recent</p> 
                      </div>
                    ))
                  )}
                </div>
              </motion.div>

            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}