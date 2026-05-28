"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Flower2, Image as ImageIcon, Music, ArrowRight } from "lucide-react";

export default function Home() {
  const features = [
    {
      title: "ඩිජිටල් දන්සල් සිතියම",
      description: "ඔබේ ප්‍රදේශයේ ඇති දන්සල් පහසුවෙන් සොයාගන්න. අලුත් දන්සල් සිතියමට එක් කරන්න.",
      icon: <MapPin className="w-8 h-8 text-primary" />,
      link: "/map",
      btnText: "සිතියම බලන්න",
    },
    {
      title: "වෙසක් සුබපැතුම් පත්",
      description: "ඔබේ නම ඇතුළත් කර අලංකාර වෙසක් සුබපැතුම් පතක් සාදා මිතුරන් සමඟ බෙදාගන්න.",
      icon: <Flower2 className="w-8 h-8 text-primary" />,
      link: "/e-card",
      btnText: "සාදන්න",
    },
    {
      title: "ත්‍රිමාණ වෙසක් කලාපය (3D Walk)",
      description: "ත්‍රිමාණ වෙසක් කලාපයක් ඔස්සේ ඇවිද යමින් සම්ප්‍රදායික නිවසක් පහන් හා කූඩුවලින් සරසන්න.",
      icon: <Flower2 className="w-8 h-8 text-primary animate-pulse" />,
      link: "/virtual-zone",
      btnText: "පිවිසෙන්න",
    },
    {
      title: "වර්චුවල් තොරණ ගැලරිය",
      description: "ප්‍රසිද්ධ තොරණවල අසිරිය සහ ජාතක කථා ඩිජිටල් ලෙස අත්විඳින්න.",
      icon: <ImageIcon className="w-8 h-8 text-primary" />,
      link: "/exhibition",
      btnText: "නරඹන්න",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <Image
          src="/hero-bg.png"
          alt="Vesak Serenity"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-vesak-white" />
        
        <div className="relative z-10 text-center px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 font-outfit drop-shadow-2xl">
              වෙසක් <span className="text-primary italic">ඩිජිටල්</span> අත්දැකීම
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-10 font-light leading-relaxed">
              ඩිජිටල් තාක්ෂණය ඔස්සේ වෙසක් අසිරිය විඳීමට සහ දන්සල් තොරතුරු ලබා ගැනීමට එක්වන්න.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/map"
                className="px-8 py-4 bg-primary text-secondary font-bold rounded-full hover:bg-accent transition-all duration-300 shadow-xl flex items-center gap-2 group"
              >
                දන්සල් සිතියම <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/virtual-zone"
                className="px-8 py-4 bg-white/20 backdrop-blur-md text-white border border-white/30 font-bold rounded-full hover:bg-white/30 hover:scale-105 transition-all duration-300 shadow-glow"
              >
                ත්‍රිමාණ වෙසක් කලාපය (3D Walk)
              </Link>
              <Link
                href="/exhibition"
                className="px-8 py-4 bg-white/5 backdrop-blur-sm text-white/80 border border-white/10 font-bold rounded-full hover:bg-white/10 transition-all duration-300"
              >
                Virtual තොරණ
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Floating Lamps Animation */}
        <div className="absolute bottom-20 left-10 animate-lamp-flicker">
          <div className="w-4 h-4 bg-primary rounded-full blur-sm" />
        </div>
        <div className="absolute top-40 right-20 animate-lamp-flicker delay-700">
          <div className="w-6 h-6 bg-accent rounded-full blur-md opacity-60" />
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-4 bg-vesak-white relative z-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-secondary mb-4">සුවිශේෂී අංගයන්</h2>
            <div className="w-24 h-1 bg-primary mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="glass p-8 rounded-3xl border border-primary/10 hover:border-primary/40 transition-all duration-300 group"
              >
                <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-secondary mb-3">{feature.title}</h3>
                <p className="text-secondary/70 mb-6 leading-relaxed">
                  {feature.description}
                </p>
                <Link
                  href={feature.link}
                  className="text-accent font-bold flex items-center gap-1 hover:gap-2 transition-all"
                >
                  {feature.btnText} <ArrowRight size={18} />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-24 bg-secondary text-white text-center px-4">
        <div className="max-w-3xl mx-auto italic text-2xl md:text-3xl font-light leading-relaxed">
          "සබ්බේ සත්තා භවන්තු සුඛිතත්තා"
          <div className="mt-4 text-primary font-normal not-italic text-lg">
            - සියලු සත්වයෝ සුවපත් වෙත්වා -
          </div>
        </div>
      </section>
    </div>
  );
}
