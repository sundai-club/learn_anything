import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "./fonts.css";
import Navbar from "../components/navbar";
import { Space_Mono, Fira_Code } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-space-mono",
});

const firaCode = Fira_Code({
  subsets: ["latin"],
  variable: "--font-fira-code",
});

export const metadata: Metadata = {
  title: "DisasterResponse.AI",
  description: "Changing the world, one signal at a time",
};

export const viewport: Viewport = {
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`text-black dark:text-white ${inter.className} h-screen ${spaceMono.variable} ${firaCode.variable}`}
        style={{
          WebkitOverflowScrolling: "touch",
          overscrollBehavior: "none",
        }}
      >
        <Navbar />
        <div className="origin-top-left min-h-screen pt-16">{children}</div>
      </body>
    </html>
  );
}
