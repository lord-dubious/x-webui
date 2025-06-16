import type { Metadata } from "next";
import { Fira_Code, Geist } from "next/font/google";
import "./globals.css";


const firaCode = Fira_Code({
  variable: "--font-fira-code",
  subsets: ["latin"],
});
const geistCode = Geist({
  variable: "--font-geist-code",
  subsets: ["latin"],
});

// Metadata
export const metadata: Metadata = {
  title: "XTask - AI-Powered Twitter Growth for Developers",
  description:
    "XTask is the ultimate SaaS platform for developers to boost their Twitter/X presence. Schedule tweets, train AI to match your style, automate engagement, and grow your audience authentically and efficiently. Built by a developer for developers.",
  icons: {
    icon: "https://cytd5kmgz6.ufs.sh/f/aIroXtB9CoHUQjQF1sv1N097MgFkwydKY3rmbRif5EsltJ6Q"
  },
};

// RootLayout
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${firaCode.variable}  ${geistCode.variable} antialiased`}
      >
       
   {children}
       
      </body>
    </html>
  );
}
