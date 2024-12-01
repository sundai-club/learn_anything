// src/components/KnowledgeGraph.tsx
"use client";
import { useRef, useEffect } from "react";
import * as echarts from "echarts";
import { KnowledgeGraph, GraphNode, GraphEdge } from '../types/knowledge';

interface KnowledgeGraphProps {
  data: KnowledgeGraph | null;
  isDarkMode: boolean;
}

export function KnowledgeGraph({ data, isDarkMode }: KnowledgeGraphProps) {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current || !data) return;

    const chart = echarts.init(chartRef.current);

    const graphData: GraphNode[] = [
      {
        fixed: true,
        x: chart.getWidth() / 2,
        y: chart.getHeight() / 2,
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

    const edges: GraphEdge[] = [];

    data.domains.forEach((domain) => {
      const domainId = domain.id;
      graphData.push({
        id: domainId,
        name: domain.name,
        symbolSize: 35,
        label: {
          show: true,
          formatter: domain.name,
          fontSize: 12,
        },
      });

      edges.push({
        source: "-1",
        target: domainId,
        lineStyle: { curveness: 0.2 },
      });

      domain.topics.forEach((topic) => {
        const topicId = topic.id;
        graphData.push({
          id: topicId,
          name: topic.name,
          symbolSize: 30,
          label: {
            show: true,
            formatter: topic.name,
            fontSize: 10,
          },
        });

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
          data: graphData,
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

    chart.setOption(option);

    const handleResize = () => {
      chart.resize();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.dispose();
    };
  }, [data, isDarkMode]);

  return (
    <div
      ref={chartRef}
      className="w-full h-[800px] bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg"
    />
  );
}