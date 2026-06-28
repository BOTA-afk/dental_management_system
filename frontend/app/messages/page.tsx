"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Search, Bell, Send
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

export default function MessagesPage() {
  const pathname = usePathname();
  const router = useRouter();
  
  const [messages, setMessages] = useState<any[]>([]);
  const [chats, setChats] = useState<any[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");

  // Fetch chats list
 // In app/messages/page.tsx, ensure your useEffect looks like this:
useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token) { router.push("/login"); return; }
  
  fetch("http://localhost:5000/api/messages/chats", {
    headers: { 
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json" 
    }
  })
    .then(res => res.json())
    .then(data => {
      console.log("Chats received from server:", data);
      if (Array.isArray(data)) {
        setChats(data);
      }
    })
    .catch(err => console.error("Error fetching chats:", err));
}, []);

  // Fetch messages for active chat
  useEffect(() => {
    if (!activeChatId) return;
    const token = localStorage.getItem("token");
    
    fetch(`http://localhost:5000/api/messages/${activeChatId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setMessages(data))
      .catch(err => console.error("Error fetching messages:", err));
  }, [activeChatId]);

  // Handle Sending Message
  const handleSendMessage = async () => {
  console.log("Button clicked!");
  console.log("Current activeChatId:", activeChatId);
  console.log("Message text:", newMessage);

  if (!activeChatId) {
    alert("Stop! No chat is selected. Please click a patient on the left first.");
    return;
  }
  
  if (!newMessage.trim()) {
    alert("Stop! The message box is empty.");
    return;
  }

  // If you see the alerts above, the code below is what executes the request
  const messageData = {
    chatId: activeChatId,
    text: newMessage,
    isDoctor: true,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };

  try {
    const response = await fetch("http://localhost:5000/api/messages", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}` 
      },
      body: JSON.stringify(messageData),
    });

    if (response.ok) {
      const savedMsg = await response.json();
      setMessages((prev) => [...prev, savedMsg]);
      setNewMessage("");
    } else {
      alert("Server error. Check backend logs.");
    }
  } catch (err: any) {
    alert("Fetch error: " + err.message);
  }
};
  return (
    <div className="min-h-screen flex w-full font-sans bg-[#f4f7f6]">
      <Sidebar />

      <main className="flex-1 ml-[260px] flex flex-col h-screen overflow-hidden">
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

        <motion.div 
          variants={containerVariants} 
          initial="hidden" 
          animate="show"
          className="flex flex-1 overflow-hidden"
        >
          <motion.div variants={itemVariants} className="w-80 border-r bg-white p-4">
            <div className="relative mb-4"><Search className="absolute left-3 top-3.5 text-gray-400" size={16} /><input className="w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-xl outline-none" placeholder="Search..." /></div>
            <div className="space-y-2">
              {chats.map((chat: any) => (
                <div key={chat._id} onClick={() => setActiveChatId(chat._id)} className={`p-3 rounded-xl cursor-pointer flex gap-3 ${activeChatId === chat._id ? 'bg-blue-50' : 'hover:bg-gray-50'}`}>
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">{chat.name.substring(0,2).toUpperCase()}</div>
                  <div className="flex-1 overflow-hidden">
                    <div className="flex justify-between text-sm font-bold">{chat.name} <span className="text-gray-400 font-normal">{chat.lastTime}</span></div>
                    <p className="text-xs text-gray-500 truncate">{chat.lastMessage}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="flex-1 flex flex-col bg-white">
            <div className="flex-1 p-6 space-y-4 overflow-y-auto">
              {messages.map((m: any) => (
                <div key={m._id} className={`p-4 rounded-2xl max-w-sm ${m.isDoctor ? 'bg-blue-600 text-white ml-auto rounded-br-none' : 'bg-gray-100 rounded-bl-none'}`}>
                  {m.text}
                  <span className={`block text-[10px] mt-1 ${m.isDoctor ? 'text-blue-200' : 'text-gray-400'}`}>{m.time}</span>
                </div>
              ))}
            </div>
            <div className="p-4 border-t flex gap-2">
              <input 
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1 p-3 border rounded-xl outline-none" 
                placeholder="Type your message..." 
              />
              <button 
                onClick={() => {
                  console.log("Button Clicked!");
                  handleSendMessage();
                }} 
                className="bg-blue-600 text-white p-3 rounded-xl cursor-pointer"
              >
                <Send size={20} />
              </button>
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}