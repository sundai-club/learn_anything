"use client";
import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useTheme } from "@/app/contexts/ThemeContext";

export default function Navbar() {
  const { isSignedIn, user } = useUser();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-surface-light dark:bg-surface-dark border-b border-border-light dark:border-border-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left side - Logo/Home */}
          <div className="flex items-center">
            <Link
              href="/"
              className="text-xl font-bold text-primary-light dark:text-primary-dark"
            >
              Learn Anything
            </Link>
          </div>

          {/* Right side - Theme toggle and Auth */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Toggle theme"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            </button>

            {/* Auth Buttons */}
            {isSignedIn ? (
              <div className="flex items-center space-x-4">
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
}
