"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { X, MapPin, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

const schema = z.object({
  name: z.string().min(3, "දන්සලේ නම අවම වශයෙන් අකුරු 3ක් විය යුතුය"),
  type: z.string().min(1, "දන්සල් වර්ගය තෝරන්න"),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
});

type FormData = z.infer<typeof schema>;

export default function AddDansalForm({ onClose }: { onClose: () => void }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const { register, handleSubmit, formState: { errors }, setValue } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      lat: 6.9271, // Colombo default
      lng: 79.8612,
    }
  });

  const onSubmit = async (data: FormData) => {
    if (!user) return;
    setLoading(true);
    try {
      await addDoc(collection(db, "dansal"), {
        ...data,
        addedBy: user.uid,
        status: "Active", // In real app, might be 'Pending' for review
        reports: 0,
        createdAt: serverTimestamp(),
      });
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error("Error adding dansal:", error);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setValue("lat", position.coords.latitude);
        setValue("lng", position.coords.longitude);
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-vesak-white w-full max-w-lg rounded-[2.5rem] shadow-2xl p-8 relative overflow-hidden"
      >
        <button onClick={onClose} className="absolute top-6 right-6 text-secondary/40 hover:text-secondary p-2 group transition-colors">
          <X className="group-hover:rotate-90 transition-transform" />
        </button>

        {success ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <MapPin size={40} />
            </div>
            <h2 className="text-2xl font-bold text-secondary mb-2">සාර්ථකයි!</h2>
            <p className="text-secondary/60">ඔබේ දන්සල සිතියමට සාර්ථකව එක් කළා.</p>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-secondary mb-8 font-outfit">දන්සලක් එක් කරන්න</h2>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-secondary/60 mb-2">දන්සලේ නම</label>
                <input
                  {...register("name")}
                  className="w-full bg-white/50 border border-secondary/10 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="උදා: මල්බත් දන්සල"
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary/60 mb-2">දන්සල් වර්ගය</label>
                <select
                  {...register("type")}
                  className="w-full bg-white/50 border border-secondary/10 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
                >
                  <option value="">වර්ගය තෝරන්න</option>
                  <option value="බත්">බත්</option>
                  <option value="පාන්">පාන්</option>
                  <option value="අයිස්ක්‍රීම්">අයිස්ක්‍රීම්</option>
                  <option value="වෙනත්">වෙනත්</option>
                </select>
                {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary/60 mb-2">අක්ෂාංශ (Lat)</label>
                  <input
                    type="number"
                    step="any"
                    {...register("lat", { valueAsNumber: true })}
                    className="w-full bg-white/50 border border-secondary/10 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary/60 mb-2">දේශාංශ (Lng)</label>
                  <input
                    type="number"
                    step="any"
                    {...register("lng", { valueAsNumber: true })}
                    className="w-full bg-white/50 border border-secondary/10 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={getCurrentLocation}
                className="flex items-center justify-center gap-2 text-primary font-bold text-sm hover:underline"
              >
                <MapPin size={16} /> මගේ දැන් පිහිටීම ලබාගන්න
              </button>

              <button
                disabled={loading}
                className="w-full bg-secondary text-white font-bold py-4 rounded-2xl shadow-xl flex items-center justify-center gap-2 hover:bg-secondary/90 transition-all disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" /> : "සිතියමට එක් කරන්න"}
              </button>
            </form>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}
