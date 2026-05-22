import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kulay ng Isip",
  description: "A 3D adventure-based educational PC game by TechTytes Studios that teaches children about Color Theory in Arts.",

  // Open Graph (Facebook, Discord, LinkedIn)
  openGraph: {
    title: "Kulay ng Isip | Play, Learn, and Create!",
    description: "Explore a magical world that has lost its colors. Mix hues, solve puzzles, and restore creativity in this 3D educational adventure.",
    url: "https://kulayngisip.arterionph.com",
    siteName: "Kulay ng Isip",
    images: [
      {
        url: "https://kulayngisip.arterionph.com/social-preview.jpg", // Must be an absolute URL!
        width: 1200,
        height: 630,
        alt: "Kulay ng Isip Game Banner",
      },
    ],
    locale: "en_PH",
    type: "website",
  },

  // Twitter / X
  twitter: {
    card: "summary_large_image",
    title: "Kulay ng Isip | Bring Color Back",
    description: "Explore a magical world that has lost its colors in this 3D educational adventure game.",
    images: ["https://kulayngisip.arterionph.com/social-preview.jpg"], // Must be an absolute URL!
  },
};



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
