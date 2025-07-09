import type { Metadata } from "next";
import { Inter, Inter_Tight } from "next/font/google";
import "./globals.css";
import UserProvider from "@/components/user-provider";

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
                <UserProvider>{children}</UserProvider>
            </body>
        </html>
    );
}
