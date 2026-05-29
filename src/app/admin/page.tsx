"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, deleteDoc, doc, updateDoc, query, orderBy } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, ShieldCheck, MapPin, Clock, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";

interface Dansal {
  id: string;
  name: string;
  type: string;
  lat: number;
  lng: number;
  status: string;
  addedBy?: string;
  createdAt?: { seconds: number };
  reports?: number;
}

export default function AdminPage() {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();
  const [dansals, setDansals] = useState<Dansal[]>([]);
  const [filter, setFilter] = useState<"All" | "Active" | "Pending" | "Removed">("All");
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.push("/");
    }
  }, [user, isAdmin, loading, router]);

  useEffect(() => {
    if (!isAdmin) return;
    const q = query(collection(db, "dansal"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setDansals(snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Dansal[]);
    });
    return () => unsub();
  }, [isAdmin]);

  const handleDelete = async (id: string) => {
    if (!confirm("මෙම දන්සල ස්ථිරවම මකා දමන්නද?")) return;
    setDeleting(id);
    try {
      await deleteDoc(doc(db, "dansal", id));
    } catch (e) {
      alert("Error deleting dansal");
    } finally {
      setDeleting(null);
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await updateDoc(doc(db, "dansal", id), { status });
    } catch (e) {
      alert("Error updating status");
    }
  };

  const filtered = filter === "All" ? dansals : dansals.filter((d) => d.status === filter);
  const counts = {
    All: dansals.length,
    Active: dansals.filter((d) => d.status === "Active").length,
    Pending: dansals.filter((d) => d.status === "Pending").length,
    Removed: dansals.filter((d) => d.status === "Removed").length,
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full" />
    </div>
  );

  if (!isAdmin) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4 mb-10"
      >
        <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center">
          <ShieldCheck className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-secondary font-outfit">Admin Dashboard</h1>
          <p className="text-secondary/50 text-sm">දන්සල් කළමනාකරණය · {user?.email}</p>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {(["All", "Active", "Pending", "Removed"] as const).map((s) => (
          <motion.button
            key={s}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setFilter(s)}
            className={`glass p-5 rounded-2xl border-2 text-left transition-all ${
              filter === s ? "border-primary bg-primary/5" : "border-transparent"
            }`}
          >
            <div className="text-3xl font-bold text-secondary">{counts[s]}</div>
            <div className="text-sm text-secondary/60 flex items-center gap-1 mt-1">
              {s === "Active" && <CheckCircle size={14} className="text-green-500" />}
              {s === "Pending" && <Clock size={14} className="text-orange-400" />}
              {s === "Removed" && <XCircle size={14} className="text-red-400" />}
              {s === "All" && <MapPin size={14} className="text-primary" />}
              {s === "All" ? "සමස්ත දන්සල්" : s === "Active" ? "සක්‍රිය" : s === "Pending" ? "අනුමත බලා" : "ඉවත් කළ"}
            </div>
          </motion.button>
        ))}
      </div>

      {/* Table */}
      <div className="glass rounded-3xl border border-primary/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-secondary/5 border-b border-secondary/10">
                <th className="text-left px-6 py-4 text-sm font-bold text-secondary/60">දන්සල</th>
                <th className="text-left px-6 py-4 text-sm font-bold text-secondary/60">වර්ගය</th>
                <th className="text-left px-6 py-4 text-sm font-bold text-secondary/60">පිහිටීම</th>
                <th className="text-left px-6 py-4 text-sm font-bold text-secondary/60">තත්වය</th>
                <th className="text-left px-6 py-4 text-sm font-bold text-secondary/60">Reports</th>
                <th className="text-right px-6 py-4 text-sm font-bold text-secondary/60">Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-16 text-secondary/30">
                      <MapPin className="w-10 h-10 mx-auto mb-2 opacity-30" />
                      <p>දන්සල් නොමැත</p>
                    </td>
                  </tr>
                ) : (
                  filtered.map((dansal) => (
                    <motion.tr
                      key={dansal.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="border-b border-secondary/5 hover:bg-primary/5 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="font-bold text-secondary">{dansal.name}</div>
                        <div className="text-xs text-secondary/40 font-mono">{dansal.addedBy?.slice(0, 8)}...</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-primary/10 text-secondary px-3 py-1 rounded-full text-xs font-bold">
                          {dansal.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-secondary/60">
                        {dansal.lat.toFixed(4)}, {dansal.lng.toFixed(4)}
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={dansal.status}
                          onChange={(e) => handleStatusChange(dansal.id, e.target.value)}
                          className={`text-xs font-bold px-3 py-1.5 rounded-full border-0 outline-none cursor-pointer ${
                            dansal.status === "Active"
                              ? "bg-green-100 text-green-700"
                              : dansal.status === "Pending"
                              ? "bg-orange-100 text-orange-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          <option value="Active">✅ Active</option>
                          <option value="Pending">⏳ Pending</option>
                          <option value="Removed">❌ Removed</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        {(dansal.reports || 0) > 0 ? (
                          <span className="flex items-center gap-1 text-orange-500 font-bold text-sm">
                            <AlertTriangle size={14} /> {dansal.reports}
                          </span>
                        ) : (
                          <span className="text-secondary/30 text-sm">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleDelete(dansal.id)}
                          disabled={deleting === dansal.id}
                          className="bg-red-100 text-red-600 hover:bg-red-200 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 ml-auto disabled:opacity-50 transition-colors"
                        >
                          <Trash2 size={13} />
                          {deleting === dansal.id ? "..." : "Delete"}
                        </motion.button>
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
