"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { 
  Home, Calendar, Users, ClipboardList, FileImage, 
  DollarSign, MessageSquare, LogOut 
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/");
  };

  const navItems = [
    { name: "Dashboard", icon: Home, path: "/dentistdashboard" },
    { name: "Appointments", icon: Calendar, path: "/appointments" },
    { name: "Patients", icon: Users, path: "/patients" },
    { name: "Treatments", icon: ClipboardList, path: "/treatments" },
    { name: "X-rays & docs", icon: FileImage, path: "/xrays" },
    { name: "Billing", icon: DollarSign, path: "/billing" },
    { name: "Messages", icon: MessageSquare, path: "/messages" },
  ];

  return (
    <aside className="w-[260px] bg-white border-r border-gray-200 flex flex-col fixed h-full z-10">
      {/* Brand Logo */}
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

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <button
              key={item.name}
              onClick={() => router.push(item.path)}
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl font-medium transition-colors cursor-pointer ${
                isActive 
                  ? "bg-gray-100 text-black font-bold" 
                  : "text-gray-600 hover:bg-gray-50 hover:text-black"
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? "text-black" : "text-gray-500"}`} />
              <span className="text-[15px]">{item.name}</span>
            </button>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 mb-4">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl font-bold transition-colors cursor-pointer"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-[15px]">Logout</span>
        </button>
      </div>
    </aside>
  );
}
