"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useRef } from "react";
import { 
  Play, 
  Volume2, 
  VolumeX, 
  ArrowRight, 
  Info, 
  Sparkles, 
  Layers, 
  HelpCircle,
  FileVideo,
  Download,
  BookOpen
} from "lucide-react";

export default function ExhibitionPage() {
  const [activeTab, setActiveTab] = useState("story");

  // Structured authentic data about the Virtual Pandal and cages
  const pandalDetails = {
    title: "ත්‍රිමාණ වර්චුවල් තොරණ සහ කූඩු ප්‍රදර්ශනය",
    subtitle: "The Virtual Pandal and the Cages",
    description: "ඩිජිටල් තාක්ෂණයෙන් ප්‍රතිනිර්මාණය කරන ලද ඓතිහාසික වෙසක් තොරණ සහ සාම්ප්‍රදායික වෙසක් කූඩු සැරසිලි රටා ඇතුළත් සජීවී සිනමාත්මක අත්දැකීම.",
    location: "ත්‍රිමාණ වෙසක් කලාපය (3D Virtual Zone)",
    jatakaStory: {
      title: "ගුත්තිල ජාතක කතා පුවත (The Guttila Jataka)",
      summary: "ගුත්තිල ජාතකය බෝධිසත්වයන් වහන්සේ ගුත්තිල නම් වීණා වාදන ශිල්පියා ලෙස උපත ලැබූ අයුරු විස්තර කෙරෙන ඉතා ජනප්‍රිය කතාවකි. එතුමාගේ දක්ෂතාව සහ ගුරු භක්තිය මෙම කතාව තුළින් මැනවින් පිළිබිඹු වේ. ගුත්තිල පඬිවරයා වීණා වාදනයෙහි අති දක්ෂයෙකි. මූසිල නම් තරුණයෙක් ගුත්තිල පඬිතුමා වෙත පැමිණ වීණා වාදනය ඉගෙන ගනී. ඉගෙනීම අවසානයේ මූසිල රජුගෙන් වරප්‍රසාද ඉල්ලන අතර, ගුත්තිල පඬිතුමා සහ මූසිල අතර වීණා වාදන තරඟයක් පැවැත්වීමට තීරණය වේ. මේ තරඟයේදී ගුත්තිල පඬිතුමා තම දිව්‍යමය බලය සහ දක්ෂතාවය මගින් මූසිල පරදවා විශිෂ්ට ජයග්‍රහණයක් ලබයි. මෙම කතාව තුළින් ගුරු භක්තියේ වැදගත්කම, ඊර්ෂ්‍යාවෙහි විපාක සහ දක්ෂතාවයේ අගය මැනවින් පෙන්වා දෙයි.",
      details: [
        "පළමු පුවරුව: මූසිල පැමිණ ගුත්තිල පඬිතුමාව හමු වී, තමාට වීණා වාදනය උගන්වන ලෙස ඉල්ලා සිටින ආකාරය නිරූපණය කරයි.",
        "දෙවන පුවරුව: මූසිල ගැන අනුකම්පා සිතී ගුත්තිල පඬිතුමා විසින් මූසිලට වීණා වාදනය උගන්වයි.",
        "තුන්වන පුවරුව: මූසිල රජුගෙන් ගුත්තිල පඬිතුමාට සමාන වරප්‍රසාද තමාටද ලබා දෙන මෙන් ඉල්ලා සිටින ආකාරය නිරූපණය කරයි.",
        "හතරවන පුවරුව: මූසිල විසින් තමාට අභියෝග කිරීම පිළිබඳව කණගාටු වීම නිසා ගුත්තිල පඬිතුමා වනගතව සිටින විට ශක්‍ර දේවේන්ද්‍රයා විසින් ගුත්තිල පඬිතුමාව හමු වීමට පැමිණීම නිරූපණය කිරීම.",
        "පස්වන පුවරුව: ගුත්තිල පඬිතුමාගේ වීණා වාදනයේ මිහිරි බව නිසාම දිව්‍ය ලෝකයෙන් දිව්‍යංගනාවන් ඇවිත් නර්තනයේ යෙදෙන ආකාරය සහ මිනිසුන් ඒ මිහිරි වීණා වාදනයට වශී වී සිටින ආකාරය නිරූපණය කරයි.",
        "හයවන පුවරුව: ගුරු ගෝල සටනින් පැරදී සිටින මූසිලව ජනයා විසින් පන්නා දමන ආකාරය නිරූපණය කරයි."
      ]
    },
    cagesInfo: {
      title: "ඩිජිටල් තොරණේ ව්‍යුහය (Digital Pandal Structure)",
      description: "මධ්‍යම කේන්ද්‍රය (Central Focus): තොරණේ මධ්‍යම කොටස බුදුරජාණන් වහන්සේගේ රූපය සඳහා වෙන් කර ඇත. මෙය තොරණේ සමස්ත කතා පුවත (Narrative) පාලනය කරන කේන්ද්‍රස්ථානය ලෙස ක්‍රියා කරයි.\n\nප්‍රධාන රූපරාමු (Panels): කතාවේ විවිධ සිදුවීම් නිරූපණය කිරීමට රවුම් හැඩැති රූපරාමු (Panels) හයක් වක්‍රාකාරව මධ්‍යම රූපය වටා සකසා ඇත. මෙම රූපරාමු මගින් කතාවේ අනුක්‍රමික බව (Story sequencing) සහ සන්නිවේදනය තහවුරු කරයි."
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-16">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-8 border-b border-secondary/5 pb-10">
        <div className="text-center md:text-left space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary-dark font-bold text-xs uppercase tracking-widest shadow-sm">
            <Sparkles size={12} />
            <span>Official Exhibition Zone</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-secondary tracking-tight font-outfit">
            ත්‍රිමාණ වර්චුවල් තොරණ (Virtual Pandal)
          </h1>
          <p className="text-secondary/60 max-w-2xl leading-relaxed text-sm md:text-base font-medium">
            ව්‍යාජ තොරතුරුවලින් තොරව, සත්‍ය ත්‍රිමාණ වර්චුවල් තොරණ සහ කූඩු (Cages) සැරසිලි රටා ඇතුළත් සජීවී සිනමාත්මක අත්දැකීමක් නරඹන්න.
          </p>
        </div>

        {/* Feature Highlight Direct Entry Button */}
        <Link
          href="/virtual-zone"
          className="bg-secondary text-primary hover:bg-secondary/90 transition-all px-8 py-4 rounded-2xl font-bold flex items-center gap-2 shadow-xl shrink-0 group text-sm"
        >
          ත්‍රිමාණ වෙසක් කලාපයට පිවිසෙන්න 
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* cinema theater video player */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left Column: Google Drive Embedded Cinema Player */}
        <div className="lg:col-span-8 space-y-6">
          <div className="relative aspect-video w-full bg-black rounded-[2.5rem] overflow-hidden border-4 border-white shadow-2xl transition-all">
            
            {/* Ambient Background Glow */}
            <div className="absolute inset-0 bg-primary/5 opacity-20 pointer-events-none" />

            {/* Invisible overlay to block clicks on the Google Drive popout button */}
            <div className="absolute top-0 right-0 w-24 h-16 z-20 bg-transparent cursor-default" />

            <iframe
              src="https://drive.google.com/file/d/1Vofx7ejwij6nmKPtC83fPjONDMfykfJk/preview"
              width="100%"
              height="100%"
              allow="autoplay; fullscreen"
              className="w-full h-full border-0 relative z-10"
              title="Virtual Pandal & Cages Cinema Preview"
            />
          </div>

          {/* Simple Streaming Info Card */}
          <div className="glass p-6 rounded-3xl border border-primary/20 bg-primary/5 flex items-center gap-4 shadow-lg">
            <div className="flex items-start gap-4">
              <div className="bg-primary/20 p-3 rounded-2xl text-secondary shrink-0">
                <Sparkles size={24} className="animate-spin-slow text-primary" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-secondary text-sm">සජීවී ඩිජிட்டල් විකාශනය (Live Digital Streaming)</h4>
                <p className="text-secondary/70 text-xs leading-relaxed max-w-xl">
                  මෙම සජීවීකරණ වීඩියෝව Google Drive මඟින් සෘජුවම අපගේ වෙබ් අඩවිය තුළට සම්බන්ධ කර ඇත. බාගත කිරීමකින් තොරව ඉහළ ගුණාත්මකභාවයෙන් (HD) වර්චුවල් තොරණ සහ කූඩු සැරසිලි අසිරිය සජීවීව නරඹන්න.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Right Column: Accurate Information & Metadata Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Main Description */}
          <div className="glass p-6 rounded-[2rem] border border-primary/20 space-y-4 shadow-lg">
            <h3 className="font-bold text-lg text-secondary flex items-center gap-2">
              <Layers size={18} className="text-primary" />
              ප්‍රදර්ශන තොරතුරු (About)
            </h3>
            
            <p className="text-secondary/80 text-sm leading-relaxed font-medium">
              {pandalDetails.description}
            </p>

            <div className="border-t border-primary/10 pt-4 space-y-3 text-xs">
              <div className="flex justify-between font-medium">
                <span className="text-secondary/40">ප්‍රදර්ශන නාමය:</span>
                <span className="text-secondary font-bold">Virtual Pandal & Cages</span>
              </div>
              <div className="flex justify-between font-medium">
                <span className="text-secondary/40">කාණ්ඩය (Category):</span>
                <span className="text-secondary font-bold">ත්‍රිමාණ වීඩියෝ (3D Video)</span>
              </div>
              <div className="flex justify-between font-medium">
                <span className="text-secondary/40">ස්ථානය:</span>
                <span className="text-secondary font-bold">{pandalDetails.location}</span>
              </div>
            </div>
          </div>

          {/* Jataka Story & Cages Tabbed Reader */}
          <div className="glass p-6 rounded-[2rem] border border-primary/20 space-y-5 shadow-lg">
            
            {/* Tabs */}
            <div className="flex gap-2 p-1 bg-secondary/5 rounded-xl border border-secondary/5">
              <button
                onClick={() => setActiveTab("story")}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${activeTab === 'story' ? 'bg-primary text-secondary' : 'text-secondary/60 hover:text-secondary'}`}
              >
                තොරණේ ජාතක කතාව
              </button>
              <button
                onClick={() => setActiveTab("cages")}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${activeTab === 'cages' ? 'bg-primary text-secondary' : 'text-secondary/60 hover:text-secondary'}`}
              >
                තොරණේ ව්‍යුහය (Pandal Structure)
              </button>
            </div>

            {/* Tab Contents */}
            <div>
              {activeTab === "story" ? (
                <div className="space-y-4">
                  <h4 className="font-bold text-secondary text-sm flex items-center gap-1.5">
                    <BookOpen size={16} className="text-primary" />
                    {pandalDetails.jatakaStory.title}
                  </h4>
                  <p className="text-secondary/70 text-xs leading-relaxed">
                    {pandalDetails.jatakaStory.summary}
                  </p>
                  
                  <div className="border-t border-primary/10 pt-3 space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-secondary/40">තොරණේ ප්‍රධාන පුවරු (Panels)</p>
                    <ul className="space-y-1.5 text-xs text-secondary/80 font-medium">
                      {pandalDetails.jatakaStory.details.map((panel, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 shrink-0" />
                          <span>{panel}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <h4 className="font-bold text-secondary text-sm flex items-center gap-1.5">
                    <Layers size={16} className="text-primary" />
                    {pandalDetails.cagesInfo.title}
                  </h4>
                  <p className="text-secondary/70 text-xs leading-relaxed" style={{ whiteSpace: "pre-line" }}>
                    {pandalDetails.cagesInfo.description}
                  </p>
                  <div className="bg-primary/5 p-3.5 rounded-2xl border border-primary/10 text-[11px] text-secondary/80 leading-normal">
                    <b>💡 සැකසුම් උපදෙස:</b> ත්‍රිමාණ වෙසක් කලාපය තුළදී ඔබට වෙසක් තොරණේ සහ කූඩුවල ආලෝක සැකසුම් (Bloom), විවිධ වර්ණ රටා සහ සම්පූර්ණ සැකැස්ම වෙනස් කිරීමට හැකියාව ඇත.
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>

      {/* Featured 3D Walkable Card Banner */}
      <div className="max-w-4xl mx-auto pt-8">
        <motion.div
          whileHover={{ y: -5 }}
          className="glass p-8 md:p-12 rounded-[2.5rem] border border-primary/20 bg-primary/5 flex flex-col md:flex-row gap-8 items-center justify-between shadow-xl"
        >
          <div className="space-y-4 flex-1">
            <span className="bg-primary/25 text-secondary font-bold text-xs px-3 py-1 rounded-full uppercase tracking-widest">
              Featured 3D Walkable Experience
            </span>
            <h3 className="text-3xl font-bold text-secondary font-outfit">ත්‍රිමාණ වෙසක් කලාපය (3D Walk)</h3>
            <p className="text-secondary/70 text-sm leading-relaxed max-w-xl">
              ත්‍රිමාණ වෙසක් පරිසරයක් තුළ (WASD/මුසිකය භාවිතයෙන්) නිදහසේ ඇවිද යමින්, සාම්ප්‍රදායික ශ්‍රී ලාංකේය නිවසක් පහන්, කූඩු සහ කොඩිවලින් අලංකාර කරන්න.
            </p>
          </div>
          <Link
            href="/virtual-zone"
            className="w-full md:w-auto px-8 py-4 bg-secondary text-primary hover:bg-secondary/90 transition-all font-bold text-sm rounded-2xl text-center shadow-md flex items-center justify-center gap-2 shrink-0"
          >
            වෙසක් කලාපයට පිවිසෙන්න <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>

    </div>
  );
}
