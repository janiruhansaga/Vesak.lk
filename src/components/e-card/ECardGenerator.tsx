"use client";

import { useState, useRef } from "react";
import html2canvas from "html2canvas";
import { Download, Share2, Image as ImageIcon, Type, Move, Trash2, Maximize, Layout } from "lucide-react";
import { motion } from "framer-motion";

// Using explicit HEX colors to avoid html2canvas oklab/oklch issues with Tailwind 4
const templates = [
  { id: 1, bg: "linear-gradient(to bottom right, #FFD700, #FF8C00, #5D001E)", textColor: "#FFFFFF" },
  { id: 2, bg: "#FFFEF7", border: "8px solid #FFD700", textColor: "#5D001E" },
  { id: 3, bg: "#5D001E", border: "4px double #FFD700", textColor: "#FFD700" },
];

export default function ECardGenerator() {
  const [name, setName] = useState("Your Name");
  const [heading, setHeading] = useState("Happy Vesak!");
  const [message, setMessage] = useState("May the teachings of Buddha fill your life with peace and joy.");
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0]);
  const [userImage, setUserImage] = useState<string | null>(null);
  const [imageSize, setImageSize] = useState(200); 
  const [isBackground, setIsBackground] = useState(false);
  
  const cardRef = useRef<HTMLDivElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUserImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const downloadCard = async () => {
    if (!cardRef.current) return;
    try {
      // Force light color scale and standard colors for cloning
      const canvas = await html2canvas(cardRef.current, {
        useCORS: true,
        scale: 2,
        backgroundColor: null,
        logging: false,
        onclone: (clonedDoc) => {
          // Additional safety: ensure any oklch colors are not present in cloned elements
          const elements = clonedDoc.getElementsByTagName('*');
          for (let i = 0; i < elements.length; i++) {
            const el = elements[i] as HTMLElement;
            // You can add more specific fixes here if needed
          }
        }
      });
      const link = document.createElement("a");
      link.download = `Vesak-Card-${name}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      console.error("Download error:", err);
      alert("පින්තූරය බාගත කිරීමේදී දෝෂයක් ඇති විය. කරුණාකර නැවත උත්සාහ කරන්න.");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-secondary">
      {/* Editor Controls */}
      <div className="lg:col-span-4 space-y-6 max-h-[85vh] overflow-y-auto pr-2 custom-scrollbar">
        <div className="glass p-6 rounded-3xl border border-primary/20 space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Type size={20} /> අන්තර්ගතය සංස්කරණය
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold opacity-40 uppercase mb-2">ප්‍රධාන වැකිය</label>
              <input
                type="text"
                value={heading}
                onChange={(e) => setHeading(e.target.value)}
                className="w-full bg-white/50 border border-secondary/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-bold opacity-40 uppercase mb-2">පණිවිඩය</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={2}
                className="w-full bg-white/50 border border-secondary/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold opacity-40 uppercase mb-2">ඔබේ නම</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white/50 border border-secondary/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary font-bold"
              />
            </div>
          </div>
        </div>

        <div className="glass p-6 rounded-3xl border border-primary/20 space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <ImageIcon size={20} /> පින්තූර සැකසුම්
          </h2>
          
          <div className="space-y-6">
            <label className="w-full cursor-pointer bg-primary/10 hover:bg-primary/20 border-2 border-dashed border-primary/30 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 transition-all">
              <ImageIcon size={32} />
              <span className="text-sm font-bold">පින්තූරයක් ඇතුළත් කරන්න</span>
              <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
            </label>
            
            {userImage && (
              <div className="space-y-4">
                <div className="flex bg-white/30 p-2 rounded-2xl gap-2">
                  <button 
                    onClick={() => setIsBackground(!isBackground)}
                    className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${isBackground ? 'bg-secondary text-white' : 'bg-white/50 text-secondary'}`}
                  >
                    <Layout size={16} /> {isBackground ? "පසුබිම ලෙස" : "පසුබිමට දාන්න"}
                  </button>
                  <button 
                    onClick={() => setUserImage(null)}
                    className="p-3 bg-red-100 text-red-600 rounded-xl hover:bg-red-200"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>

                {!isBackground && (
                  <div className="space-y-3">
                    <div className="flex justify-between text-xs font-bold opacity-50 uppercase">
                      <span>ප්‍රමාණය (Size)</span>
                      <span>{imageSize}px</span>
                    </div>
                    <input 
                      type="range" 
                      min="50" 
                      max="500" 
                      value={imageSize} 
                      onChange={(e) => setImageSize(parseInt(e.target.value))}
                      className="w-full h-2 bg-secondary/10 rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="glass p-6 rounded-3xl border border-primary/20 space-y-4">
          <h2 className="text-sm font-bold opacity-40 uppercase">වර්ණ තෝරන්න (Templates)</h2>
          <div className="flex gap-3">
            {templates.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedTemplate(t)}
                className={`w-12 h-12 rounded-lg ${selectedTemplate.id === t.id ? "ring-4 ring-primary ring-offset-2" : "opacity-60 hover:opacity-100"} transition-all`}
                style={{ background: t.bg, border: t.border || 'none' }}
              />
            ))}
          </div>
        </div>

        <button
          onClick={downloadCard}
          className="w-full bg-secondary text-white font-bold py-5 rounded-3xl shadow-2xl flex items-center justify-center gap-3 hover:bg-black transition-all"
        >
          <Download size={24} /> Download E-Card
        </button>
      </div>

      {/* Preview Area */}
      <div className="lg:col-span-8 flex flex-col items-center bg-secondary/5 rounded-[3rem] p-8 min-h-[700px] border border-secondary/5 overflow-hidden">
        <p className="opacity-30 text-xs mb-6 flex items-center gap-2 text-center">
          <Move size={14} /> ඕනෑම දෙයක් ඇදගෙන ගොස් (Drag) ස්ථානය වෙනස් කළ හැක
        </p>

        <div className="relative w-full max-w-[500px] shadow-2xl rounded-3xl overflow-hidden group">
          <div
            ref={cardRef}
            style={{ 
              background: selectedTemplate.bg, 
              border: selectedTemplate.border || 'none',
              aspectRatio: '4/5',
              width: '100%',
              padding: '2rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Background Image Logic */}
            {userImage && isBackground && (
              <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
                <img src={userImage} alt="Background" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }} />
                <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.2)' }} />
              </div>
            )}

            {/* Draggable Heading */}
            <motion.div drag dragMomentum={false} style={{ cursor: 'move', zIndex: 20, position: 'relative' }}>
              <h1 style={{ 
                fontSize: '2.5rem', 
                fontWeight: 'bold', 
                color: selectedTemplate.textColor,
                marginBottom: '1rem',
                textShadow: '0 2px 4px rgba(0,0,0,0.5)'
              }}>
                {heading}
              </h1>
            </motion.div>

            {/* Draggable User Image (Floating mode) */}
            {userImage && !isBackground && (
              <motion.div 
                drag 
                dragMomentum={false} 
                className="cursor-move relative z-10 my-4"
              >
                <div 
                  style={{ 
                    width: `${imageSize}px`, 
                    height: 'auto', 
                    borderRadius: '1rem', 
                    overflow: 'hidden', 
                    border: '4px solid rgba(255,255,255,0.3)',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                    transform: 'rotate(2deg)'
                  }}
                >
                  <img src={userImage} alt="User" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              </motion.div>
            )}

            {/* Draggable Message */}
            <motion.div drag dragMomentum={false} style={{ cursor: 'move', zIndex: 20, position: 'relative', maxWidth: '85%', padding: '0 1rem' }}>
              <p style={{ 
                fontSize: '1.25rem', 
                fontWeight: '300', 
                color: selectedTemplate.textColor,
                opacity: 0.9,
                lineHeight: 1.6,
                fontStyle: 'italic',
                marginBottom: '2rem',
                textShadow: '0 1px 2px rgba(0,0,0,0.3)'
              }}>
                "{message}"
              </p>
            </motion.div>

            {/* Draggable Name */}
            <motion.div drag dragMomentum={false} style={{ 
              cursor: 'move', 
              zIndex: 30, 
              position: 'relative', 
              backgroundColor: 'rgba(0,0,0,0.1)', 
              backdropFilter: 'blur(4px)', 
              padding: '0.75rem 1.5rem', 
              borderRadius: '1rem' 
            }}>
              <div>
                <p style={{ 
                  fontSize: '10px', 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.3em', 
                  fontWeight: 'bold', 
                  color: selectedTemplate.textColor, 
                  opacity: 0.7, 
                  marginBottom: '0.25rem' 
                }}>
                  With Blessings from
                </p>
                <p style={{ 
                  fontSize: '1.875rem', 
                  fontWeight: 'bold', 
                  color: selectedTemplate.textColor,
                  textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                }}>
                  {name}
                </p>
              </div>
            </motion.div>

            <div style={{ position: 'absolute', bottom: '1rem', left: 0, right: 0, fontSize: '8px', opacity: 0.4, color: '#FFFFFF', zIndex: 40, letterSpacing: '-0.05em' }}>
              VESAK DIGITAL EXPERIENCE 2026
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
