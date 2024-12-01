"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useTheme } from "../app/contexts/ThemeContext";
import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { isDarkMode } = useTheme();
  const { isSignedIn, user } = useUser();
  const isPWA =
    typeof window !== "undefined" &&
    window.matchMedia("(display-mode: standalone)").matches;

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`text-black fixed top-0 left-0 w-full z-50 transition-[background-color,border-color,shadow] duration-300 font-space-mono ${
        isDarkMode
          ? isScrolled
            ? "bg-background-dark/90 shadow-lg backdrop-blur-sm"
            : "bg-background-dark"
          : isScrolled
          ? "bg-background-light/90 shadow-lg backdrop-blur-sm"
          : "bg-background-light"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          <div className="flex-shrink-0">
            <Link
              href="/"
              className={`text-center group flex items-center ${
                isPWA ? "p-2" : ""
              }`}
            >
              <span
                className={`text-sm md:text-lg ${
                  isDarkMode ? "text-secondary-dark" : "text-secondary-light"
                } hover:text-primary-light dark:hover:text-primary-dark transition-colors`}
              >
                Mihir-Research.AI
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-3 md:gap-4">
            {isSignedIn ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-secondary-light dark:text-secondary-dark">
                  {user.firstName || user.username}
                </span>
                <SignOutButton>
                  <button className="px-4 py-2 text-sm font-medium text-white bg-primary-light dark:bg-primary-dark rounded-lg hover:opacity-90">
                    Sign Out
                  </button>
                </SignOutButton>
              </div>
            ) : (
              <SignInButton mode="modal">
                <button className="px-4 py-2 text-sm font-medium text-white bg-primary-light dark:bg-primary-dark rounded-lg hover:opacity-90">
                  Sign In
                </button>
              </SignInButton>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
