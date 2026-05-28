"use client";

import { useAudio } from "@/context/AudioContext";
import { Volume2, VolumeX, Music } from "lucide-react";
import { motion } from "framer-motion";

export default function AudioController() {
  const { isPlaying, togglePlay } = useAudio();

  return (
    <motion.button
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={togglePlay}
      className="fixed bottom-6 right-6 z-50 p-4 rounded-full glass border-primary/30 shadow-2xl flex items-center justify-center text-secondary hover:text-primary transition-colors group"
      title={isPlaying ? "Mute Background Music" : "Play Background Music"}
    >
      <div className="relative">
        {isPlaying ? (
          <>
            <Volume2 size={24} />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
            </span>
          </>
        ) : (
          <VolumeX size={24} className="text-secondary/50" />
        )}
      </div>
      <motion.div
        animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 border-2 border-dashed border-primary/20 rounded-full"
      />
    </motion.button>
  );
}
