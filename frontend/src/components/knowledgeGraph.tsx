"use client";
import { useRef, useEffect, useState } from "react";
import * as echarts from "echarts";
import {
  KnowledgeGraph as KnowledgeGraphType,
  GraphNode,
  GraphEdge,
  ProgressMap,
} from "../types/knowledge";
import { knowledgeService } from "../services/api";

interface KnowledgeGraphProps {
  data: KnowledgeGraphType | null;
  isDarkMode: boolean;
  onProgressUpdate: (nodeId: string, completed: boolean) => void;
  progress: ProgressMap;
  onNodeClick: (nodeId: string, newData: KnowledgeGraphType) => void;
}

export function KnowledgeGraph({
  data,
  isDarkMode,
  onProgressUpdate,
  progress,
  onNodeClick,
}: KnowledgeGraphProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const [loadingNodeId, setLoadingNodeId] = useState<string | null>(null);

  const calculateProgress = (nodeId: string): number => {
    const domain = data?.domains.find((d) => d.id === nodeId);
    if (!domain) {
      for (const d of data?.domains || []) {
        const topic = d.topics?.find((t) => t.id === nodeId);
        if (topic && topic.topics) {
          const totalSubtopics = topic.topics.length;
          const completedSubtopics = topic.topics.filter(
            (st) => progress[st.id]?.completed
          ).length;
          return (completedSubtopics / totalSubtopics) * 100;
        }
      }
      return 0;
    }

    const totalTopics = domain.topics?.length || 0;
    const completedTopics =
      domain.topics?.filter((t) => progress[t.id]?.completed).length || 0;
    return (completedTopics / totalTopics) * 100;
  };

  const getNodeStyle = (node: GraphNode, isCompleted?: boolean) => {
    const isLoading = loadingNodeId === node.id;
    return {
      color: "#FFFFFF",
      borderColor: isLoading
        ? "#3B82F6"
        : isCompleted
        ? "#10B981"
        : isDarkMode
        ? "#64748B"
        : "#4B5563",
      borderRadius: 6,
      borderWidth: isLoading ? 4 : isCompleted ? 3 : 2,
      shadowColor: isLoading
        ? "rgba(59, 130, 246, 0.4)"
        : isCompleted
        ? "rgba(16, 185, 129, 0.2)"
        : "rgba(0, 0, 0, 0.2)",
      shadowBlur: isLoading ? 12 : isCompleted ? 8 : 5,
    };
  };

  const getModalContent = (node: any): string[] => {
    if (node.id === "-1") {
      return [
        "Welcome to your interactive learning journey!",
        "How to use this map:",
        "• Click on nodes to visit Wikipedia articles",
        "• Click on domain nodes to see their topics",
        "• Drag nodes to rearrange the map",
        "• Use mouse wheel to zoom in/out",
      ];
    }

    const domain = data?.domains.find((d) => d.id === node.id);
    if (domain) {
      return [
        `Domain: ${domain.name}`,
        `Progress: ${Math.round(calculateProgress(domain.id))}% Complete`,
        `Number of topics: ${domain.topics?.length || 0}`,
        "Topics in this domain:",
        ...(domain.topics?.map((t) => `• ${t.name}`) || []),
      ];
    }

    for (const d of data?.domains || []) {
      const topic = d.topics?.find((t) => t.id === node.id);
      if (topic) {
        const subtopics = topic.topics || [];
        const progress = calculateProgress(node.id);
        return [
          `Topic: ${topic.name}`,
          `Part of: ${d.name}`,
          progress > 0 ? `Progress: ${Math.round(progress)}% Complete` : "",
          subtopics.length > 0 ? "Subtopics:" : "",
          ...subtopics.map((st) => `• ${st.name}`),
        ].filter(Boolean);
      }
    }

    return ["No additional details available"];
  };

  const getNodeLabel = (node: any, isCompleted: boolean) => {
    const isLoading = loadingNodeId === node.id;
    return {
      show: true,
      position: "inside",
      formatter: [
        `{title|${node.name}}`,
        // `{link|${node.id}}`,
        isLoading
          ? "{status|Loading...}"
          : isCompleted
          ? "{status|✓ Completed}"
          : "{status|Click to complete}",
      ].join("\n"),
      rich: {
        title: {
          fontSize: 12,
          fontWeight: "bold",
          padding: [0, 0, 4, 0],
          width: 160,
          align: "center",
        },
        link: {
          fontSize: 9,
          color: "#3B82F6",
          lineHeight: 12,
          width: 150,
          align: "center",
          padding: [0, 4],
          textDecoration: "underline",
        },
        status: {
          fontSize: 10,
          color: isLoading ? "#3B82F6" : isCompleted ? "#10B981" : "#6B7280",
          padding: [4, 0],
          width: 160,
          align: "center",
        },
      },
    };
  };

  useEffect(() => {
    if (!chartRef.current || !data) return;

    const chart = echarts.init(chartRef.current);
    const graphData: GraphNode[] = [];
    const edges: GraphEdge[] = [];

    // Create center node
    graphData.push({
      id: "-1",
      name: "Learn Anything",
      symbolSize: [220, 100],
      symbol: "roundRect",
      fixed: true,
      x: chart.getWidth() / 2,
      y: chart.getHeight() / 2,
      itemStyle: {
        color: "#FFFFFF",
        borderColor: isDarkMode ? "#64748B" : "#4B5563",
        borderRadius: 6,
      },
      label: {
        show: true,
        position: "inside",
        formatter: "{title|Learn Anything}",
        rich: {
          title: {
            fontSize: 14,
            fontWeight: "bold",
            width: 200,
            align: "center",
          },
        },
      },
    });

    // Process domain (there's only one in this case)
    const domain = data.domains[0];
    const domainId = domain.id;
    const domainProgress = calculateProgress(domainId);
    const domainCompleted = domainProgress === 100;

    // Add domain node
    graphData.push({
      id: domainId,
      name: domain.name,
      symbolSize: [220, 100],
      symbol: "roundRect",
      itemStyle: getNodeStyle(domain, domainCompleted),
      label: {
        show: true,
        position: "inside",
        formatter: [
          `{title|${domain.name}}`,
          // `{link|${domain.id}}`,
          domainProgress > 0
            ? `{progress|${Math.round(domainProgress)}% Complete}`
            : "",
          domainCompleted ? "{status|✓}" : "",
        ]
          .filter(Boolean)
          .join("\n"),
        rich: {
          title: {
            fontSize: 14,
            fontWeight: "bold",
            padding: [0, 0, 4, 0],
            width: 200,
            align: "center",
          },
          link: {
            fontSize: 10,
            color: "#3B82F6",
            lineHeight: 14,
            width: 190,
            align: "center",
            padding: [0, 4],
            textDecoration: "underline",
          },
          progress: {
            fontSize: 11,
            color: "#10B981",
            padding: [4, 0],
            width: 200,
            align: "center",
            fontWeight: "bold",
          },
          status: {
            fontSize: 16,
            color: "#10B981",
            padding: [2, 0],
            width: 200,
            align: "center",
          },
        },
      },
    });

    // Connect domain to center
    edges.push({
      source: "-1",
      target: domainId,
      lineStyle: { curveness: 0.2 },
    });

    // Process topics
    domain.topics.forEach((topic) => {
      const topicId = topic.id;
      const isCompleted = progress[topicId]?.completed;

      graphData.push({
        id: topicId,
        name: topic.name,
        symbolSize: [180, 80],
        symbol: "roundRect",
        itemStyle: getNodeStyle(topic, isCompleted),
        label: getNodeLabel(topic, isCompleted),
      });

      edges.push({
        source: domainId,
        target: topicId,
        lineStyle: { curveness: 0.2 },
      });
    });

    const option = {
      tooltip: {
        trigger: "item",
        formatter: (params: any) => {
          const node = params.data;
          if (node.id?.startsWith("http")) {
            return `<div class="font-bold">${node.name}</div>
                   <div class="text-sm text-blue-500">${node.id}</div>`;
          }
          return `<div class="font-bold">${node.name}</div>`;
        },
      },
      series: [
        {
          type: "graph",
          layout: "force",
          animation: true,
          data: graphData,
          force: {
            repulsion: 10000,
            edgeLength: 750,
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

    const containerWidth = chart.getWidth();
    const containerHeight = chart.getHeight();
    const scale = Math.min(containerWidth, containerHeight) / 2500;

    chart.setOption({
      ...option,
      animation: false,
      series: [
        {
          ...option.series[0],
          zoom: scale,
          center: [containerWidth / 2, containerHeight / 2],
        },
      ],
    });

    chart.on("click", async function (params) {
      if (params.dataType === "node") {
        const node = params.data;
        const nodeId = node.id as string;

        // Navigate to Wikipedia link if it exists
        if (nodeId.startsWith("http")) {
          window.open(nodeId, "_blank", "noopener,noreferrer");
        }

        // Toggle completion if not center node
        if (nodeId !== "-1") {
          try {
            setLoadingNodeId(nodeId);
            onProgressUpdate(nodeId, !progress[nodeId]?.completed);
          } catch (error) {
            console.error("Error:", error);
          } finally {
            setLoadingNodeId(null);
          }
        }
      }
    });

    const handleResize = () => {
      chart.resize();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.dispose();
    };
  }, [data, isDarkMode, progress, loadingNodeId]);

  return (
    <div
      ref={chartRef}
      className="w-full h-[800px] bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg"
    />
  );
}
