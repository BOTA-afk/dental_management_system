"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Search, Bell, CheckCircle, Clock, XCircle
} from "lucide-react";
import { motion } from "framer-motion";
import Sidebar from "@/app/components/Sidebar";

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
} as const;

export default function BillingPage() {
  const pathname = usePathname();
  const router = useRouter();

  // State for dynamic data
  const [payments, setPayments] = useState<any[]>([]);
  const [stats, setStats] = useState([
    { title: "Total Revenue", value: "$ 0", bg: "bg-blue-600" },
    { title: "Monthly Average", value: "0", bg: "bg-sky-500" },
    { title: "Pending Payments", value: "$ 0", bg: "bg-teal-600" },
    { title: "Overdue", value: "$ 0", bg: "bg-indigo-600" },
  ]);

  // Fetch data on load
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { router.push("/login"); return; }

    const fetchBilling = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/billing", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setPayments(data.payments);
          setStats(data.stats);
        }
      } catch (err) { console.error("Error fetching billing data:", err); }
    };
    fetchBilling();
  }, [router]);

  return (
    <div className="min-h-screen flex w-full font-sans bg-[#f4f7f6]">
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 ml-[260px] flex flex-col h-screen overflow-hidden">
        <header className="h-20 flex items-center justify-between px-8 bg-white border-b border-gray-200">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">Billing & Payment</h1>
            <p className="text-gray-500">Process payments and manage billing</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative"><Search className="absolute left-3 top-3 text-gray-400" size={18} /><input className="pl-10 pr-4 py-2 border rounded-xl w-64 outline-none" placeholder="Search..." /></div>
            <Bell size={20} className="text-gray-600" />
            <div className="w-10 h-10 bg-teal-500 text-white rounded-full flex items-center justify-center font-bold">DS</div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 bg-[#f4f7f6]">
          <motion.div 
            variants={containerVariants} 
            initial="hidden" 
            animate="show" 
            className="max-w-6xl mx-auto space-y-8"
          >
            {/* Revenue Cards */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((s) => (
                <div key={s.title} className={`${s.bg} rounded-2xl p-6 text-white h-32 flex flex-col justify-between shadow-sm`}>
                  <div className="text-4xl font-bold">{s.value}</div>
                  <div className="text-sm font-medium opacity-90">{s.title}</div>
                </div>
              ))}
            </motion.div>

            <motion.div variants={itemVariants} className="flex gap-4">
              <div className="relative flex-1 max-w-lg">
                <Search className="absolute left-3 top-3.5 text-gray-400" size={18} />
                <input className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl outline-none" placeholder="Search Patient....." />
              </div>
              <button className="px-6 py-3 bg-white border border-gray-200 rounded-xl font-medium">All Status</button>
              <button className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium">Export</button>
            </motion.div>

            {/* Payment List */}
            <motion.div variants={itemVariants} className="space-y-4">
              {payments.length > 0 ? payments.map((p: any) => (
                <div key={p._id} className="bg-white p-6 rounded-2xl border border-gray-200 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${p.status === 'Paid' ? 'bg-green-100 text-green-600' : p.status === 'Pending' ? 'bg-orange-100 text-orange-600' : 'bg-red-100 text-red-600'}`}>
                      {p.status === 'Paid' ? <CheckCircle size={24} /> : p.status === 'Pending' ? <Clock size={24} /> : <XCircle size={24} />}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{p.patientName}</h3>
                      <div className="flex gap-6 text-sm text-gray-500 mt-1">
                        <span>{p.method}</span><span>{p.date}</span><span>{p.referenceNumber}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-2xl font-bold">${p.amount}</div>
                </div>
              )) : <p className="text-center text-gray-500 mt-10">No payments found.</p>}
            </motion.div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}