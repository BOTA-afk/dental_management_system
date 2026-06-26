"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home, Calendar, Users, ClipboardList, File, DollarSign, MessageSquare,
  LogOut, Search, Bell, CheckCircle2, Clock, AlertCircle
} from "lucide-react";

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function TreatmentsPage() {
  const pathname = usePathname();
  const router = useRouter();
  
  // State for database data
  const [treatments, setTreatments] = useState<any[]>([]);
  const [stats, setStats] = useState([
    { title: "Completed", count: "0", bg: "bg-[#2577fa]" },
    { title: "In Progress", count: "0", bg: "bg-[#28b5ee]" },
    { title: "Scheduled", count: "0", bg: "bg-[#2a839a]" },
    { title: "Total Treatments", count: "0", bg: "bg-[#4a6cf7]" },
  ]);

  // Fetch data on load
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { router.push("/login"); return; }
    
    const fetchTreatments = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/treatments", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setTreatments(data.treatments);
          setStats(data.stats);
        }
      } catch (err) { console.error("Error fetching treatments:", err); }
    };
    fetchTreatments();
  }, [router]);

  const sidebarLinks = [
    { name: "Dashboard", icon: Home, href: "/dentistdashboard" },
    { name: "Appointments", icon: Calendar, href: "/appointments" },
    { name: "Patients", icon: Users, href: "/patients" },
    { name: "Treatments", icon: ClipboardList, href: "/treatments" },
    { name: "X-rays & docs", icon: File, href: "/xrays" },
    { name: "Billing", icon: DollarSign, href: "/billing" },
    { name: "Messages", icon: MessageSquare, href: "/messages" },
  ];

  return (
    <div className="flex h-screen bg-[#f4f7f6] font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col justify-between">
        <div>
          <div className="h-20 flex items-center px-6 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">D</div>
              <span className="text-xl font-bold text-gray-900">Dentplus</span>
            </div>
          </div>
          <nav className="p-4 space-y-1">
            {sidebarLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link key={link.name} href={link.href} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive ? "text-black font-semibold bg-gray-50" : "text-gray-600 hover:bg-gray-50 hover:text-black"}`}>
                  <link.icon size={20} className={isActive ? "text-black" : "text-gray-500"} />
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="p-4 border-t"><button onClick={() => { localStorage.removeItem("token"); router.push("/login"); }} className="flex items-center gap-3 px-4 py-3 text-red-500 font-bold hover:bg-red-50 rounded-xl w-full"><LogOut size={20} /> Logout</button></div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-20 flex items-center justify-between px-8 bg-[#f4f7f6]">
          <div><h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Treatments</h1></div>
          <div className="flex items-center gap-6">
            <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} /><input className="pl-10 pr-4 py-2 border rounded-lg w-64 bg-white focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Search..." /></div>
            <div className="w-10 h-10 bg-[#00a7c4] text-white rounded-full flex items-center justify-center font-bold">DS</div>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-8 pt-4">
          <div className="grid grid-cols-4 gap-6 mb-8">
            {stats.map((stat) => (
              <div key={stat.title} className={`${stat.bg} rounded-[20px] p-6 text-white h-32 flex flex-col justify-between shadow-sm`}>
                <div className="text-4xl font-bold">{stat.count}</div>
                <div className="text-sm font-medium opacity-90">{stat.title}</div>
              </div>
            ))}
          </div>

          <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-4">
            {treatments.map((t: any) => (
              <motion.div key={t._id} variants={itemVariants} className="bg-white p-6 rounded-[20px] border border-gray-200 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold shrink-0">{t.patientName.substring(0, 2).toUpperCase()}</div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">{t.patientName}</h3>
                    <p className="text-gray-600">{t.procedure}</p>
                    <div className="flex gap-4 text-sm text-gray-500 mt-1"><span>{t.date}</span><span>{t.doctor}</span></div>
                    <p className="text-sm italic text-gray-700 mt-2">{t.notes}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-3">
                  <span className={`px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-2 border ${t.status === 'Completed' ? 'bg-blue-50 text-blue-600 border-blue-200' : 'bg-orange-50 text-orange-600 border-orange-200'}`}>
                    {t.status === 'Completed' ? <CheckCircle2 size={16} /> : <Clock size={16} />}
                    {t.status}
                  </span>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 bg-blue-50 text-blue-600 border border-blue-200 rounded-lg text-sm font-semibold">View Details</button>
                    <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold">Edit Notes</button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </main>
    </div>
  );
}