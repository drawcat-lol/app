import type { Metadata } from "next";
import { Inter, Inter_Tight } from "next/font/google";
import "./globals.css";
import UserProvider from "@/components/user-provider";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
    variable: "--font-inter",
    subsets: ["latin"],
});

const interTight = Inter_Tight({
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
            <head>
                <link
                    rel="icon"
                    href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🐱</text></svg>"
                />
            </head>
            <body
                className={`${inter.className} ${interTight.variable} antialiased`}
            >
                <UserProvider>
                    <main>{children}</main>
                    <Toaster position="top-center" theme="light" />
                </UserProvider>
            </body>
        </html>
    );
}
