import type { Metadata } from "next";
import { Inter, Inter_Tight } from "next/font/google";
import "./globals.css";
import UserProvider from "@/components/user-provider";
import Navbar from "@/components/navbar";

const inter = Inter({
    variable: "--font-inter",
    subsets: ["latin"],
});

const geistMono = Inter_Tight({
    variable: "--font-inter-tight",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "drawcat",
    description: "collection of poorly drawn cats",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${inter.className} ${geistMono.variable} antialiased`}
            >
                <UserProvider>
                    <div className="absolute inset-0 -z-10 h-full w-full bg-white [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,rgb(255,140,55,0.5)_100%)]"></div>
                    {children}
                </UserProvider>
            </body>
        </html>
    );
}
