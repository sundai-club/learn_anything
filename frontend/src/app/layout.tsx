import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "./contexts/ThemeContext";
import Navbar from "@/components/navbar";
import "./globals.css";
import "./fonts.css";
import { Space_Mono, Fira_Code, Inter } from "next/font/google";

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

export const metadata = {
  title: "DisasterResponse.AI",
  description: "Changing the world, one signal at a time",
};

export const viewport = {
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <ClerkProvider>
        <body>
          <ThemeProvider>
            <Navbar />
            <main className="pt-16">{children}</main>
          </ThemeProvider>
        </body>
      </ClerkProvider>
    </html>
  );
}
