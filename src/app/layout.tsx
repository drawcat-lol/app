import type { Metadata } from "next";
import { Architects_Daughter } from "next/font/google";
import "./globals.css";
import UserProvider from "@/components/user-provider";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";

const inter = Architects_Daughter({
    variable: "--font-idk-body",
    subsets: ["latin"],
    weight: "400",
});

const interTight = Architects_Daughter({
    variable: "--font-idk-display",
    subsets: ["latin"],
    weight: "400",
});

export const metadata: Metadata = {
    title: "drawcat",
    description: "a collection of poorly drawn cats.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <link
                    rel="icon"
                    href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🐱</text></svg>"
                />
            </head>
            <body
                className={`${inter.className} ${interTight.variable} antialiased`}
            >
                <ThemeProvider
                    defaultTheme="light"
                    attribute={"class"}
                    enableSystem
                    disableTransitionOnChange
                >
                    <UserProvider>
                        <main>{children}</main>
                        <Toaster
                            className="rounded-full"
                            position="top-center"
                            toastOptions={{ style: { borderRadius: 0 } }}
                        />
                    </UserProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
