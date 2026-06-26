"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home, Calendar, Users, ClipboardList, File, DollarSign, MessageSquare,
  LogOut, Search, Bell, Send
} from "lucide-react";

const messagesList = [
  { id: 1, name: "Lakshani Wasana (Patient)", snippet: "Thank you doctor, see you next week...", time: "2h ago", initials: "LW" },
  { id: 2, name: "Assistant", snippet: "Room 101 is prepared", time: "3h ago", initials: "AS" },
  { id: 3, name: "Ayodh Shakhya (Patient)", snippet: "Is the prescription ready, doctor?", time: "3h ago", initials: "AS" },
  { id: 4, name: "Yugan Perera (Patient)", snippet: "Thank you doctor.", time: "2d ago", initials: "YP" },
];

export default function MessagesPage() {
  const pathname = usePathname();
  const router = useRouter();

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
            <div className="flex items-center gap-2 font-bold text-xl">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">D</div> Dentplus
            </div>
          </div>
          <nav className="p-4 space-y-1">
            {sidebarLinks.map((link) => (
              <Link key={link.name} href={link.href} className={`flex items-center gap-3 px-4 py-3 rounded-xl ${pathname === link.href ? "bg-gray-100 font-bold" : "text-gray-600"}`}>
                <link.icon size={20} /> {link.name}
              </Link>
            ))}
          </nav>
        </div>
        <div className="p-6 border-t"><button onClick={() => { localStorage.removeItem("token"); router.push("/login"); }} className="flex items-center gap-3 text-red-500 font-bold"><LogOut size={20} /> Logout</button></div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-20 flex items-center justify-between px-8 bg-white border-b border-gray-200">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">Messages</h1>
            <p className="text-gray-500">Communicate with patients and staff</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative"><Search className="absolute left-3 top-3 text-gray-400" size={18} /><input className="pl-10 pr-4 py-2 border rounded-xl w-64 outline-none" placeholder="Search..." /></div>
            <Bell size={20} className="text-gray-600" />
            <div className="w-10 h-10 bg-teal-500 text-white rounded-full flex items-center justify-center font-bold">EC</div>
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
          {/* Message Sidebar */}
          <div className="w-80 border-r bg-white p-4">
            <div className="relative mb-4"><Search className="absolute left-3 top-3.5 text-gray-400" size={16} /><input className="w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-xl outline-none" placeholder="Search..." /></div>
            <div className="space-y-2">
              {messagesList.map((m) => (
                <div key={m.id} className="p-3 hover:bg-gray-50 rounded-xl cursor-pointer flex gap-3">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">{m.initials}</div>
                  <div className="flex-1 overflow-hidden">
                    <div className="flex justify-between text-sm font-bold">{m.name} <span className="text-gray-400 font-normal">{m.time}</span></div>
                    <p className="text-xs text-gray-500 truncate">{m.snippet}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Window */}
          <div className="flex-1 flex flex-col bg-white">
            <div className="p-4 border-b flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">LW</div>
              <h2 className="font-bold text-lg">Lakshani Wasana <span className="block text-sm font-normal text-gray-500">Patient</span></h2>
            </div>
            <div className="flex-1 p-6 space-y-4 overflow-y-auto">
              <div className="bg-gray-100 p-4 rounded-2xl rounded-bl-none max-w-sm">Hi Dr. Erandi, I wanted to check about my next appointment.<span className="block text-[10px] text-gray-400 mt-1">2.30 PM</span></div>
              <div className="bg-blue-600 text-white p-4 rounded-2xl rounded-br-none max-w-sm ml-auto">Hello Lakshani! Your next checkup is scheduled for next Monday at 10 AM.<span className="block text-[10px] text-blue-200 mt-1">2.32 PM</span></div>
              <div className="bg-gray-100 p-4 rounded-2xl rounded-bl-none max-w-sm">Perfect! Do I need to prepare anything?<span className="block text-[10px] text-gray-400 mt-1">2.33 PM</span></div>
              <div className="bg-blue-600 text-white p-4 rounded-2xl rounded-br-none max-w-sm ml-auto">No special preparation needed. Just make sure to brush well before coming in.<span className="block text-[10px] text-blue-200 mt-1">2.35 PM</span></div>
            </div>
            <div className="p-4 border-t flex gap-2">
              <input className="flex-1 p-3 border rounded-xl outline-none" placeholder="Type your message..." />
              <button className="bg-blue-600 text-white p-3 rounded-xl"><Send size={20} /></button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}