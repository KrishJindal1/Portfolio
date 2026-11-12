import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Space_Grotesk, Inter, IBM_Plex_Mono } from "next/font/google";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MotionProvider } from "@/components/ui/Reveal";
import { SimulationModeProvider } from "@/components/three/SimulationModeContext";
import { DroneOverlayWrapper } from "@/components/three/DroneOverlayWrapper";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-ibm-plex-mono",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Krish Jindal — Software, AI & Robotics Engineer",
    template: "%s — Krish Jindal",
  },
  description:
    "Engineering portfolio of Krish Jindal — B.Tech CSE student at Dronacharya College of Engineering exploring Robotics, Artificial Intelligence, Computer Vision, and Software Engineering.",
  keywords: [
    "Krish Jindal",
    "Software Engineering",
    "Robotics",
    "Artificial Intelligence",
    "Computer Vision",
    "Autonomous Systems",
    "Next.js",
    "Three.js",
  ],
  authors: [{ name: "Krish Jindal" }],
  creator: "Krish Jindal",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Krish Jindal",
    title: "Krish Jindal — Software, AI & Robotics Engineer",
    description:
      "Building intelligent systems that interact with the real world. Robotics, computer vision, artificial intelligence, and software engineering.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Krish Jindal — Software, AI & Robotics Engineer",
    description:
      "Building intelligent systems that interact with the real world. Robotics, computer vision, artificial intelligence, and software engineering.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${ibmPlexMono.variable}`}
    >
      <body className="flex min-h-screen flex-col bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]">
        <noscript>
          <style>{`.reveal-fallback { opacity: 1 !important; transform: none !important; }`}</style>
        </noscript>
        <MotionProvider>
          <SimulationModeProvider>
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:border focus:border-[var(--color-text-primary)] focus:bg-[var(--color-surface)] focus:px-4 focus:py-2 focus:text-sm"
            >
              Skip to main content
            </a>
            <Navbar />
            <main id="main-content" className="flex-1">
              {children}
            </main>
            <Footer />
            <DroneOverlayWrapper />
          </SimulationModeProvider>
        </MotionProvider>
      </body>
    </html>
  );
}
