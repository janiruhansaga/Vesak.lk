"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Home as HomeIcon } from "lucide-react";

// Dynamically import the Walkable 3D Digital Vesak Zone component to prevent Server-Side Rendering (SSR) hydration errors
const DigitalVesakZone = dynamic(() => import("@/components/3d/DigitalVesakZone"), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col items-center justify-center min-h-screen gap-5 w-full bg-[#05070a] text-white">
      {/* Premium glowing golden spinner */}
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 border-4 border-primary/20 rounded-full" />
        <div className="absolute inset-0 border-4 border-[#ffcc77] border-t-transparent rounded-full animate-spin" />
        <div className="absolute inset-3 bg-[#ffcc77]/10 rounded-full animate-pulse blur-sm" />
      </div>
      <div className="text-center space-y-2">
        <h2 className="text-xl font-light tracking-widest text-[#ffcc77] font-outfit uppercase animate-pulse">
          ත්‍රිමාණ වෙසක් කලාපය සූදානම් වෙමින් පවතී...
        </h2>
        <p className="text-gray-500 text-xs font-light">
          Loading 3D structures, shaders, procedural night audio, and lighting...
        </p>
      </div>
    </div>
  ),
});

export default function VirtualZonePage() {
  return (
    <main className="w-full min-h-screen bg-black overflow-hidden relative">
      <DigitalVesakZone />
    </main>
  );
}
