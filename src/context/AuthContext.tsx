"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  User 
} from "firebase/auth";
import { app, auth } from "@/lib/firebase";
import { isAdminEmail } from "@/lib/admins";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Guard: only run if Firebase app is properly initialized
    if (!app) {
      setLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsAdmin(isAdminEmail(user?.email));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    if (!app) return;
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login Error:", error);
    }
  };

  const logout = async () => {
    if (!app) return;
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
