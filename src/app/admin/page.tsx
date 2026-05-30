"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, deleteDoc, doc, updateDoc, query, orderBy, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, ShieldCheck, MapPin, Clock, CheckCircle, XCircle, AlertTriangle, Image as ImageIcon, Upload } from "lucide-react";
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
  
  const [activeTab, setActiveTab] = useState<"Dansals" | "Templates">("Dansals");
  const [templates, setTemplates] = useState<{ id: string, url: string }[]>([]);
  const [uploadingTemplate, setUploadingTemplate] = useState(false);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.push("/");
    }
  }, [user, isAdmin, loading, router]);

  useEffect(() => {
    if (!isAdmin) return;
    const q = query(collection(db, "dansal"), orderBy("createdAt", "desc"));
    const unsubDansals = onSnapshot(q, (snap) => {
      setDansals(snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Dansal[]);
    });

    const qTemplates = query(collection(db, "ecard_templates"), orderBy("createdAt", "desc"));
    const unsubTemplates = onSnapshot(qTemplates, (snap) => {
      setTemplates(snap.docs.map((d) => ({ id: d.id, url: d.data().url })));
    });

    return () => {
      unsubDansals();
      unsubTemplates();
    };
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

  const handleTemplateUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingTemplate(true);
    try {
      const storageRef = ref(storage, `ecard_templates/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);

      await addDoc(collection(db, "ecard_templates"), {
        url,
        createdAt: Date.now()
      });
    } catch (error) {
      console.error("Upload error:", error);
      alert("Error uploading template");
    } finally {
      setUploadingTemplate(false);
    }
  };

  const handleDeleteTemplate = async (id: string, url: string) => {
    if (!confirm("මෙම Template එක මකා දමන්නද?")) return;
    try {
      await deleteDoc(doc(db, "ecard_templates", id));
      // Optionally delete from storage using URL, but leaving it is safer if used by existing downloaded cards
    } catch (error) {
      console.error("Delete error:", error);
      alert("Error deleting template");
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
          <p className="text-secondary/50 text-sm">කළමනාකරණය · {user?.email}</p>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setActiveTab("Dansals")}
          className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${
            activeTab === "Dansals" ? "bg-primary text-secondary shadow-lg" : "bg-primary/10 text-secondary/60 hover:bg-primary/20"
          }`}
        >
          <MapPin size={20} /> දන්සල් කළමනාකරණය
        </button>
        <button
          onClick={() => setActiveTab("Templates")}
          className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${
            activeTab === "Templates" ? "bg-primary text-secondary shadow-lg" : "bg-primary/10 text-secondary/60 hover:bg-primary/20"
          }`}
        >
          <ImageIcon size={20} /> E-Card Templates
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "Dansals" ? (
          <motion.div
            key="dansals"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
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
          </motion.div>
        ) : (
          <motion.div
            key="templates"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="glass p-6 rounded-3xl border border-primary/20 flex flex-col items-center justify-center gap-4">
              <h2 className="text-xl font-bold text-secondary">Upload New Template</h2>
              <label className="cursor-pointer bg-primary/10 hover:bg-primary/20 border-2 border-dashed border-primary/30 rounded-2xl p-8 flex flex-col items-center gap-3 transition-all w-full max-w-md">
                {uploadingTemplate ? (
                  <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
                ) : (
                  <>
                    <Upload size={32} className="text-primary" />
                    <span className="font-bold text-secondary">Click to Select Image</span>
                    <span className="text-xs text-secondary/50">Recommended ratio: 4:5</span>
                  </>
                )}
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleTemplateUpload} 
                  disabled={uploadingTemplate}
                />
              </label>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {templates.map((t) => (
                <div key={t.id} className="relative group aspect-[4/5] rounded-2xl overflow-hidden shadow-lg border border-secondary/10">
                  <img src={t.url} alt="Template" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      onClick={() => handleDeleteTemplate(t.id, t.url)}
                      className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-full shadow-xl transform hover:scale-110 transition-all"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
              {templates.length === 0 && (
                <div className="col-span-full py-12 text-center text-secondary/40 font-bold">
                  No templates uploaded yet.
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
