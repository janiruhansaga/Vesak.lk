"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, Flower2 as LotusIcon, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

const navLinks = [
  { name: "මුල් පිටුව", href: "/" },
  { name: "දන්සල් සිතියම", href: "/map" },
  { name: "සුබපැතුම් පත්", href: "/e-card" },
  { name: "වෙසක් කලාපය", href: "/virtual-zone" },
  { name: "Virtual තොරණ", href: "/exhibition" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, isAdmin, loginWithGoogle, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled 
          ? "-translate-y-full opacity-0 pointer-events-none" 
          : "bg-transparent py-4 translate-y-0 opacity-100"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="bg-primary/20 p-1.5 rounded-full shadow-glow animate-lamp-flicker">
              <img src="/logo.png" alt="Vesak Logo" className="w-8 h-8 object-contain drop-shadow-md" />
            </div>
            <span className="text-2xl font-bold text-secondary font-outfit tracking-wider">
              වෙසක් <span className="text-primary text-glow">අසිරිය</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-secondary hover:text-accent font-medium transition-colors duration-200"
              >
                {link.name}
              </Link>
            ))}

            {/* Admin link */}
            {isAdmin && (
              <Link
                href="/admin"
                className="flex items-center gap-1 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm font-bold hover:bg-primary/20 transition-colors"
              >
                <ShieldCheck size={15} /> Admin
              </Link>
            )}

            {/* Auth button */}
            {user ? (
              <button
                onClick={logout}
                className="flex items-center gap-2 text-sm text-secondary/60 hover:text-red-500 transition-colors font-medium"
              >
                <img src={user.photoURL || ""} alt="" className="w-7 h-7 rounded-full" />
                Logout
              </button>
            ) : (
              <button
                onClick={loginWithGoogle}
                className="text-sm bg-secondary text-white px-4 py-2 rounded-full font-bold hover:bg-secondary/80 transition-colors"
              >
                Login
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-secondary p-2 focus:outline-none"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden glass absolute top-full left-0 w-full shadow-2xl"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-4 text-lg font-medium text-secondary border-b border-secondary/10 last:border-0"
                >
                  {link.name}
                </Link>
              ))}
              {isAdmin && (
                <Link
                  href="/admin"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 px-3 py-4 text-lg font-bold text-primary border-b border-secondary/10"
                >
                  <ShieldCheck size={18} /> Admin Panel
                </Link>
              )}
              {user ? (
                <button
                  onClick={() => { logout(); setIsOpen(false); }}
                  className="block w-full text-left px-3 py-4 text-lg font-medium text-red-500"
                >
                  Logout
                </button>
              ) : (
                <button
                  onClick={() => { loginWithGoogle(); setIsOpen(false); }}
                  className="block w-full text-left px-3 py-4 text-lg font-bold text-primary"
                >
                  Login with Google
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
