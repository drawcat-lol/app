import type { Metadata } from "next";
import { Inter, Inter_Tight } from "next/font/google";
import "./globals.css";
import UserProvider from "@/components/user-provider";
import Navbar from "@/components/navbar";
import { Toaster } from "@/components/ui/sonner";

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
                    <main>{children}</main>
                    <Toaster position="top-center" />
                </UserProvider>
            </body>
        </html>
    );
}
