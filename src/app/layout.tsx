import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/shared/Navbar";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "වෙසක් අසිරිය - Vesak Digital Experience 2026",
  description: "ඩිජිටල් තාක්ෂණය ඔස්සේ වෙසක් අසිරිය විඳීමට සහ දන්සල් තොරතුරු ලබා ගැනීමට එක්වන්න.",
  keywords: ["Vesak", "Dansal Map", "Sri Lanka", "Buddhist Festival", "E-Cards", "Virtual Exhibition"],
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="si" className={`${outfit.variable} scroll-smooth`}>
      <body className="antialiased min-h-screen bg-vesak-white text-vesak-dark">
        <AuthProvider>
            <Navbar />
            <main className="pt-16 min-h-screen">
              {children}
            </main>
            <footer className="py-8 text-center text-sm text-secondary/60 bg-secondary/5 border-t border-secondary/10">
              <p>© 2026 Vesak Digital Experience. All Rights Reserved.</p>
              <p className="mt-2">May all beings be happy and peaceful.</p>
            </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
