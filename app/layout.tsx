import type { Metadata } from "next";
import "./globals.css";
import { Cormorant_Garamond, Jost } from "next/font/google";
import { Toaster } from "sonner";

const display = Cormorant_Garamond({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-display" });
const body = Jost({ subsets: ["latin"], weight: ["300", "400", "500", "600"], variable: "--font-body" });

export const metadata: Metadata = {
  title: "FLAMORA — Maison de Joaillerie",
  description: "A century of quiet obsession. Luxury jewellery and fashion, handcrafted in Paris.",
  openGraph: { title: "FLAMORA", description: "Maison de Joaillerie — Paris" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="min-h-screen bg-ivory text-onyx antialiased">
        {children}
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}
