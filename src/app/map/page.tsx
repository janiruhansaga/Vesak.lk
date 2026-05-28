"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Plus, Search, Filter } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { AnimatePresence } from "framer-motion";
import AddDansalForm from "@/components/map/AddDansalForm";

// Dynamically import map to avoid SSR errors
const VesakMap = dynamic(() => import("@/components/map/MapContainer"), {
  ssr: false,
  loading: () => <div className="h-[70vh] w-full bg-secondary/5 animate-pulse rounded-2xl flex items-center justify-center text-secondary/40">සිතියම පූරණය වෙමින්...</div>
});

export default function MapPage() {
  const { user, loginWithGoogle } = useAuth();
  const [showAddForm, setShowAddForm] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <AnimatePresence>
        {showAddForm && <AddDansalForm onClose={() => setShowAddForm(false)} />}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-bold text-secondary mb-2 font-outfit">ඩිජිටල් දන්සල් සිතියම</h1>
          <p className="text-secondary/60">ඔබේ ප්‍රදේශයේ ඇති දන්සල් සොයාගන්න හෝ අලුත් දන්සලක් එක් කරන්න.</p>
        </div>
        
        <div className="flex gap-2">
          {user ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddForm(true)}
              className="px-6 py-3 bg-primary text-secondary font-bold rounded-xl shadow-lg flex items-center gap-2"
            >
              <Plus size={20} /> දන්සලක් එක් කරන්න
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={loginWithGoogle}
              className="px-6 py-3 bg-secondary text-white font-bold rounded-xl shadow-lg flex items-center gap-2"
            >
              එක් කිරීමට ලොගින් වන්න
            </motion.button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass p-6 rounded-2xl border border-primary/10">
            <div className="flex items-center gap-2 text-secondary font-bold mb-4">
              <Search size={18} /> සොයන්න
            </div>
            <input 
              type="text" 
              placeholder="නම හෝ ස්ථානය..." 
              className="w-full bg-white/50 border border-secondary/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary mb-4"
            />
            
            <div className="flex items-center gap-2 text-secondary font-bold mb-4">
              <Filter size={18} /> වර්ගය
            </div>
            <div className="space-y-2">
              {["බත්", "පාන්", "අයිස්ක්‍රීම්", "වෙනත්"].map((cat) => (
                <label key={cat} className="flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" className="w-5 h-5 accent-primary" />
                  <span className="text-secondary/80 group-hover:text-secondary">{cat}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="bg-accent/10 p-6 rounded-2xl border border-accent/20">
            <h4 className="font-bold text-accent mb-2">වැදගත්:</h4>
            <p className="text-sm text-secondary/70">
              වැරදි තොරතුරු ඇතුළත් කිරීමෙන් වළකින්න. පලකිරීම් සඳහා ඔබ වගකිව යුතුය.
            </p>
          </div>
        </div>

        {/* Map View */}
        <div className="lg:col-span-3">
          <VesakMap />
        </div>
      </div>
    </div>
  );
}
