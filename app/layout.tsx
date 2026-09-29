import { Jost, Playfair_Display } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "sonner";

import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
});

const jost = Jost({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata = {
  title: {
    default: "FLĀMORÁ — Fine Jewellery",
    template: "%s | FLĀMORÁ",
  },
  description:
    "FLĀMORÁ creates timeless fine jewellery using ethically sourced diamonds, precious stones and recycled gold.",
};

export default function RootLayout({
  children,
}) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${playfair.variable} ${jost.variable}`}
      suppressHydrationWarning
    >
      <body
        className="min-h-screen bg-background font-sans text-foreground antialiased"
        suppressHydrationWarning
      >
        {children}

        <Toaster
          position="bottom-right"
          closeButton
          richColors
          toastOptions={{
            duration: 4000,
            className: "font-sans",
          }}
        />

        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  );
}