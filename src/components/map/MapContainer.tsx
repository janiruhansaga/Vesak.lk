"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, where, deleteDoc, doc } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { Trash2 } from "lucide-react";

// Fix Leaflet marker icons
const icon = L.icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface Dansal {
  id: string;
  name: string;
  type: string;
  lat: number;
  lng: number;
  addedBy?: string;
}

export default function VesakMap() {
  const { user } = useAuth();
  const [dansals, setDansals] = useState<Dansal[]>([]);

  useEffect(() => {
    // Real-time listener for active dansals
    const q = query(collection(db, "dansal"), where("status", "==", "Active"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Dansal[];
      setDansals(data);
    }, (error) => {
      console.error("Firestore error:", error);
      // Fallback for demo if no config
      setDansals([
        { id: "1", name: "බත් දන්සල - කොළඹ", type: "Rice", lat: 6.9271, lng: 79.8612 },
        { id: "2", name: "අයිස්ක්‍රීම් දන්සල - මහනුවර", type: "Ice Cream", lat: 7.2906, lng: 80.6337 },
      ]);
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("මෙම දන්සල ඉවත් කිරීමට අවශ්‍ය බව විශ්වාසද?")) return;
    try {
      await deleteDoc(doc(db, "dansal", id));
    } catch (error) {
      console.error("Error deleting dansal:", error);
      alert("ඉවත් කිරීම අසාර්ථක විය. නැවත උත්සාහ කරන්න.");
    }
  };

  return (
    <div className="h-[70vh] w-full rounded-2xl overflow-hidden shadow-2xl border-4 border-white/50">
      <MapContainer
        center={[7.8731, 80.7718]}
        zoom={8}
        scrollWheelZoom={true}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {dansals.map((dansal) => (
          <Marker 
            key={dansal.id} 
            position={[dansal.lat, dansal.lng]} 
            icon={icon}
          >
            <Popup className="rounded-xl overflow-hidden">
              <div className="p-2 min-w-[150px]">
                <h3 className="font-bold text-secondary text-lg leading-tight mb-1">{dansal.name}</h3>
                <p className="text-accent font-medium mb-3">{dansal.type}</p>
                
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <button className="flex-1 text-[10px] bg-primary/20 text-secondary px-2 py-1.5 rounded font-bold">Report</button>
                    <button className="flex-1 text-[10px] bg-secondary text-white px-2 py-1.5 rounded font-bold">Directions</button>
                  </div>
                  
                  {user && dansal.addedBy === user.uid && (
                    <button 
                      onClick={() => handleDelete(dansal.id)}
                      className="w-full text-[10px] bg-red-100 text-red-600 px-2 py-1.5 rounded font-bold flex items-center justify-center gap-1 hover:bg-red-200 transition-colors"
                    >
                      <Trash2 size={12} /> මකන්න (Delete)
                    </button>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
