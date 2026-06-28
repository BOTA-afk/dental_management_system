"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Search, Bell, FileText, Download, Eye, ChevronDown
} from "lucide-react";
import Sidebar from "@/app/components/Sidebar";

export default function MedicalRecordsPage() {
  const pathname = usePathname();
  const router = useRouter();
  const [records, setRecords] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { router.push("/login"); return; }
    
    const fetchRecords = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/records", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setRecords(data.records);
        }
      } catch (err) { console.error("Error fetching records:", err); }
    };
    fetchRecords();
  }, [router]);

  return (
    <div className="min-h-screen flex w-full font-sans bg-[#f4f7f6]">
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 ml-[260px] flex flex-col h-screen overflow-hidden">
        <header className="h-20 flex items-center justify-between px-8 bg-white border-b border-gray-100">
          <h1 className="text-2xl font-bold text-gray-900">Medical Records</h1>
          <div className="flex items-center gap-4">
            <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} /><input className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-64 bg-gray-50 focus:bg-white outline-none" placeholder="Search..." /></div>
            <Bell className="text-gray-500" size={20} />
            <div className="w-10 h-10 bg-[#00a7c4] text-white rounded-full flex items-center justify-center font-bold">DS</div>
          </div>
        </header>

        <div className="p-8">
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1 max-w-lg">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl outline-none" placeholder="Search records by Patient name, procedure or type..." />
            </div>
            <button className="px-6 py-2.5 bg-white border border-gray-200 rounded-xl flex items-center gap-2 font-medium">All Types <ChevronDown size={16}/></button>
            <button className="px-6 py-2.5 bg-white border border-gray-200 rounded-xl flex items-center gap-2 font-medium">All Status <ChevronDown size={16}/></button>
          </div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            {records.length > 0 ? records.map((r: any) => (
              <div key={r._id} className="bg-white p-6 rounded-2xl border border-gray-200 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0"><FileText size={24} /></div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">{r.type}</h3>
                    <div className="flex gap-6 text-sm text-gray-500 mt-1">
                      <span>👤 {r.patientName}</span>
                      <span>📅 {r.date}</span>
                      <span>🦷 {r.procedure}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">File size: {r.fileSize}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-4 py-1.5 rounded-full text-xs font-semibold ${r.status === 'Completed' ? 'bg-blue-50 text-blue-600' : r.status === 'In Progress' ? 'bg-sky-50 text-sky-600' : 'bg-orange-50 text-orange-600'}`}>
                    {r.status}
                  </span>
                  <button className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-semibold hover:bg-blue-100"><Eye size={16} /> View</button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-200"><Download size={16} /> Download</button>
                </div>
              </div>
            )) : <p className="text-center text-gray-500 mt-10">No medical records found.</p>}
          </motion.div>
        </div>
      </main>
    </div>
  );
}