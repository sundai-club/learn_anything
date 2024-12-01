"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";

interface NodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string[];
  isDarkMode: boolean;
}

export function NodeModal({
  isOpen,
  onClose,
  title,
  content,
  isDarkMode,
}: NodeModalProps) {
  // Handle ESC key press
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscapeKey);
    return () => document.removeEventListener("keydown", handleEscapeKey);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="min-h-screen px-4 flex items-center justify-center">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-lg mx-auto"
            >
              <div className="relative bg-surface-light dark:bg-surface-dark rounded-xl shadow-xl">
                {/* Header */}
                <div className="px-6 pt-6 pb-4 border-b border-border-light dark:border-border-dark">
                  <div className="flex items-center justify-between">
                    <motion.h3
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-xl font-bold text-secondary-light dark:text-secondary-dark"
                    >
                      {title}
                    </motion.h3>
                    <button
                      onClick={onClose}
                      className="text-secondary-light dark:text-secondary-dark hover:text-primary-light dark:hover:text-primary-dark transition-colors p-1 rounded-lg hover:bg-background-light dark:hover:bg-background-dark"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="px-6 py-4">
                  <div className="space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar pr-2">
                    {content.map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 bg-background-light dark:bg-background-dark rounded-lg text-secondary-light dark:text-secondary-dark hover:bg-opacity-80 transition-colors"
                      >
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0 w-1.5 h-1.5 mt-2 rounded-full bg-primary-light dark:bg-primary-dark" />
                          <p className="flex-1">{item}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-border-light dark:border-border-dark">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex justify-end"
                  >
                    <button
                      onClick={onClose}
                      className="px-4 py-2 text-sm font-medium text-white bg-primary-light dark:bg-primary-dark rounded-lg hover:opacity-90 transition-opacity"
                    >
                      Close
                    </button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}

// Add custom scrollbar styles to your global CSS
const scrollbarStyles = `
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: rgba(100, 116, 139, 0.5) transparent;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(100, 116, 139, 0.5);
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: rgba(100, 116, 139, 0.7);
}
`;

// Add this style to your globals.css
export { scrollbarStyles };
