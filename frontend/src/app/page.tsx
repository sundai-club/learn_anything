// src/app/page.tsx
"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import { useTheme } from "./contexts/ThemeContext";
import {
  Domain,
  KnowledgeGraph as KnowledgeGraphType,
} from "../types/knowledge";
import { KnowledgeGraph } from "../components/knowledgeGraph";
import { WikiUrlForm } from "../components/wikiUrlForm";
import { ProgressMap } from "@/types/knowledge";

export default function Home() {
  const { isDarkMode } = useTheme();
  const [knowledgeData, setKnowledgeData] = useState<KnowledgeGraphType | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState<ProgressMap>({});

  const handleProgressUpdate = (nodeId: string, completed: boolean) => {
    setProgress((prev) => ({
      ...prev,
      [nodeId]: { completed, timestamp: Date.now() },
    }));
  };

  const handleNodeClick = async (
    nodeId: string,
    newData: KnowledgeGraphType
  ) => {
    setKnowledgeData((prevData) => {
      if (!prevData) return newData;

      // Deep clone the previous data
      const updatedData = JSON.parse(JSON.stringify(prevData));

      // Find the clicked node and extend its children
      const extendNode = (domains: Domain[]) => {
        for (const domain of domains) {
          if (domain.id === nodeId) {
            // Extend domain with new topics
            domain.topics = [
              ...(domain.topics || []),
              ...(newData?.domains?.[0]?.topics || []),
            ];
            return true;
          }
          // Check topics
          if (domain.topics) {
            for (const topic of domain.topics) {
              if (topic.id === nodeId) {
                // Extend topic with new subtopics
                topic.topics = [
                  ...(topic.topics || []),
                  ...(newData?.domains?.[0]?.topics || []),
                ];
                return true;
              }
              // Check subtopics recursively
              if (topic.topics && extendNode(topic.topics)) {
                return true;
              }
            }
          }
        }
        return false;
      };

      extendNode(updatedData.domains);
      return updatedData;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background-light to-surface-light dark:from-background-dark dark:to-surface-dark">
      <section className="relative py-16 md:py-24 lg:py-26 px-4 md:px-8">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center mb-12"
          >
            <h1 className="text-2xl md:text-4xl font-bold text-secondary-light dark:text-secondary-dark mb-4">
              Learn Anything
            </h1>
            <p className="text-base md:text-lg text-secondary-light dark:text-secondary-dark mb-8">
              Enter a Wikipedia URL to generate an interactive knowledge map
            </p>

            <WikiUrlForm
              onSubmit={setKnowledgeData}
              onError={setError}
              processing={processing}
              setProcessing={setProcessing}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-16"
          >
            {processing && (
              <div className="flex justify-center items-center h-[800px] bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg">
                <div className="text-secondary-light dark:text-secondary-dark">
                  Processing Wikipedia content...
                </div>
              </div>
            )}
            {error && (
              <div className="flex justify-center items-center h-[800px] bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg">
                <div className="text-red-500">{error}</div>
              </div>
            )}
            {!processing && !error && knowledgeData && (
              <KnowledgeGraph
                data={knowledgeData}
                isDarkMode={isDarkMode}
                onProgressUpdate={handleProgressUpdate}
                progress={progress}
                onNodeClick={handleNodeClick}
              />
            )}
            {!processing && !error && !knowledgeData && (
              <div className="flex justify-center items-center h-[800px] bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg">
                <div className="text-secondary-light dark:text-secondary-dark">
                  Enter a Wikipedia URL above to get started
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
