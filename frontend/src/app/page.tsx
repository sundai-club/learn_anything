"use client";
import { motion } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import * as echarts from "echarts";
import { useTheme } from "./contexts/ThemeContext";

export default function Home() {
  const chartRef = useRef<HTMLDivElement>(null);
  const { isDarkMode } = useTheme();
  const [chart, setChart] = useState<echarts.ECharts | null>(null);

  // Define knowledge domains
  const domains = {
    "Computer Science": ["Algorithms", "Data Structures", "AI", "Networks"],
    Mathematics: ["Algebra", "Calculus", "Statistics", "Geometry"],
    Physics: ["Mechanics", "Quantum", "Relativity", "Thermodynamics"],
    Biology: ["Genetics", "Ecology", "Evolution", "Cell Biology"],
    Chemistry: ["Organic", "Inorganic", "Physical", "Biochemistry"],
  };

  useEffect(() => {
    if (!chartRef.current) return;

    const newChart = echarts.init(chartRef.current);
    setChart(newChart);

    // Generate all nodes and edges at once
    const data = [
      {
        fixed: true,
        x: newChart.getWidth() / 2,
        y: newChart.getHeight() / 2,
        symbolSize: 40,
        id: "-1",
        name: "Learn Anything",
        itemStyle: {
          color: "#FFFFFF",
          borderColor: isDarkMode ? "#64748B" : "#4B5563",
        },
        label: {
          show: true,
          position: "inside",
          formatter: "Start",
          color: isDarkMode ? "#1F2937" : "#1F2937",
        },
      },
    ];

    const edges: any[] = [];

    // Generate all nodes
    Object.entries(domains).forEach(([domain, topics], domainIndex) => {
      // Add domain node
      const domainId = `d${domainIndex}`;
      data.push({
        id: domainId,
        name: domain,
        symbolSize: 35,
        label: {
          show: true,
          formatter: domain,
          fontSize: 12,
        },
      });

      // Connect to center
      edges.push({
        source: "-1",
        target: domainId,
        lineStyle: { curveness: 0.2 },
      });

      // Add topic nodes
      topics.forEach((topic, topicIndex) => {
        const topicId = `${domainId}_t${topicIndex}`;
        data.push({
          id: topicId,
          name: `${domain}: ${topic}`,
          symbolSize: 30,
          label: {
            show: true,
            formatter: topic,
            fontSize: 10,
          },
        });

        // Connect to domain
        edges.push({
          source: domainId,
          target: topicId,
          lineStyle: { curveness: 0.2 },
        });
      });
    });

    const option = {
      tooltip: {
        trigger: "item",
        formatter: (params: any) => {
          return `<div class="font-bold">${
            params.data.name || params.data.id
          }</div>`;
        },
      },
      series: [
        {
          type: "graph",
          layout: "force",
          animation: true,
          data: data,
          force: {
            repulsion: 400,
            edgeLength: 120,
            gravity: 0.1,
            layoutAnimation: true,
            friction: 0.6,
          },
          roam: true,
          draggable: true,
          label: {
            show: true,
            position: "inside",
            color: isDarkMode ? "#1F2937" : "#1F2937",
          },
          itemStyle: {
            color: "#FFFFFF",
            borderColor: isDarkMode ? "#64748B" : "#4B5563",
            borderWidth: 2,
            shadowBlur: 5,
            shadowColor: "rgba(0, 0, 0, 0.2)",
          },
          lineStyle: {
            color: isDarkMode ? "#64748B" : "#4B5563",
            width: 2,
            curveness: 0.3,
          },
          emphasis: {
            focus: "adjacency",
            itemStyle: {
              borderWidth: 3,
              shadowBlur: 10,
              shadowColor: "rgba(0, 0, 0, 0.3)",
            },
            lineStyle: {
              width: 4,
            },
          },
          edges: edges,
        },
      ],
    };

    newChart.setOption(option);

    const handleResize = () => {
      newChart.resize();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      newChart.dispose();
    };
  }, [isDarkMode]);

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
              Interactive knowledge map
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-16"
          >
            <div
              ref={chartRef}
              className="w-full h-[800px] bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg"
            />
          </motion.div>
        </div>
      </section>
    </div>
  );
}
