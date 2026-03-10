import type { Metadata } from "next";
import { Inter, Amiri } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import SwRegister from "@/components/SwRegister";

const inter = Inter({
    variable: "--font-inter",
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700", "800"],
});

const amiri = Amiri({
    variable: "--font-amiri",
    subsets: ["arabic", "latin"],
    weight: ["400", "700"],
    style: ["normal", "italic"],
});

export const metadata: Metadata = {
    title: "Personalized Dua Finder for Ramadan's Last 10 Nights",
    description:
    "Find the perfect dua for any need. Search for authentic supplications with Arabic text, transliteration, translation, and audio - designed for the blessed last 10 nights of Ramadan.",
    keywords: ["dua", "supplication", "ramadan", "islamic", "prayer", "quran", "hadith"],
    manifest: "/manifest.json",
    appleWebApp: {
        capable: true,
        statusBarStyle: "black-translucent",
        title: "Dua Finder",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <head>
                <meta name="theme-color" content="#10b981" />
                <link rel="icon" type="image/png" sizes="192x192" href="/icons/icon-192.png" />
                <link rel="icon" type="image/svg+xml" href="/icons/icon-192.svg" />
                <link rel="apple-touch-icon" href="/icons/icon-192.png" />
            </head>
            <body className={`${inter.variable} ${amiri.variable} antialiased`}>
                <Providers>{children}</Providers>
                <SwRegister />
            </body>
        </html>
    );
}

