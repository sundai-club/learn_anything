"use client";
import { useRef, useEffect, useState } from "react";
import * as echarts from "echarts";
import {
  KnowledgeGraph as KnowledgeGraphType,
  GraphNode,
  GraphEdge,
} from "../types/knowledge";
import { NodeModal } from "./NodeModal";

interface KnowledgeGraphProps {
  data: KnowledgeGraphType | null;
  isDarkMode: boolean;
}

interface NodeDetails {
  title: string;
  content: string[];
}

export function KnowledgeGraph({ data, isDarkMode }: KnowledgeGraphProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const [selectedNode, setSelectedNode] = useState<NodeDetails | null>(null);

  useEffect(() => {
    if (!chartRef.current || !data) return;

    const chart = echarts.init(chartRef.current);

    const graphData: GraphNode[] = [
      {
        fixed: true,
        x: chart.getWidth() / 2,
        y: chart.getHeight() / 2,
        symbolSize: [250, 100],
        symbol: "roundRect",
        id: "-1",
        name: "Learn Anything",
        itemStyle: {
          color: "#FFFFFF",
          borderColor: isDarkMode ? "#64748B" : "#4B5563",
          borderRadius: 8,
        },
        label: {
          show: true,
          position: "inside",
          formatter: [
            "{title|Learn Anything}",
            "{desc|Interactive knowledge map to explore\nand connect different concepts}",
          ].join("\n"),
          rich: {
            title: {
              fontSize: 16,
              fontWeight: "bold",
              padding: [0, 0, 8, 0],
            },
            desc: {
              fontSize: 12,
              color: isDarkMode ? "#64748B" : "#4B5563",
              lineHeight: 16,
              width: 220,
              align: "center",
            },
          },
        },
      },
    ];

    const edges: GraphEdge[] = [];

    data.domains.forEach((domain) => {
      const domainId = domain.id;
      graphData.push({
        id: domainId,
        name: domain.name,
        symbolSize: [220, 90],
        symbol: "roundRect",
        itemStyle: {
          color: "#FFFFFF",
          borderColor: isDarkMode ? "#64748B" : "#4B5563",
          borderRadius: 6,
        },
        label: {
          show: true,
          position: "inside",
          formatter: [
            `{title|${domain.name}}`,
            `{desc|${domain.description}}`,
          ].join("\n"),
          rich: {
            title: {
              fontSize: 14,
              fontWeight: "bold",
              padding: [0, 0, 6, 0],
              align: "center",
            },
            desc: {
              fontSize: 11,
              color: isDarkMode ? "#64748B" : "#4B5563",
              lineHeight: 14,
              width: 200,
              align: "center",
            },
          },
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
          symbolSize: [180, 80],
          symbol: "roundRect",
          itemStyle: {
            color: "#FFFFFF",
            borderColor: isDarkMode ? "#64748B" : "#4B5563",
            borderRadius: 6,
          },
          label: {
            show: true,
            position: "inside",
            formatter: [
              `{title|${topic.name}}`,
              `{desc|${topic.description}}`,
            ].join("\n"),
            rich: {
              title: {
                fontSize: 12,
                fontWeight: "bold",
                padding: [0, 0, 4, 0],
                align: "center",
              },
              desc: {
                fontSize: 10,
                color: isDarkMode ? "#64748B" : "#4B5563",
                lineHeight: 12,
                width: 160,
                align: "center",
              },
            },
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

    chart.on("click", function (params) {
      if (params.dataType === "node") {
        const node = params.data;

        let modalContent: string[] = [];

        if (node.id === "-1") {
          modalContent = [
            "Welcome to your interactive learning journey! This knowledge map helps you explore and connect different concepts.",
            "How to use this map:",
            "• Click on domain nodes (outer circles) to see their topics",
            "• Click on topic nodes to explore detailed concepts",
            "• Drag nodes to rearrange the map",
            "• Use mouse wheel to zoom in/out",
          ];
        } else if (data.domains.some((d) => d.id === node.id)) {
          const domain = data.domains.find((d) => d.id === node.id);
          if (domain) {
            modalContent = [
              `Domain: ${domain.name}`,
              `Number of topics: ${domain.topics.length}`,
              "Click on connected topics to explore more details.",
              ...domain.topics.map((t) => `• ${t.name}`),
            ];
          }
        } else {
          const domainId = node.id.split("_")[0];
          const domain = data.domains.find((d) => d.id === domainId);
          const topic = domain?.topics.find((t) => t.id === node.id);

          if (topic) {
            modalContent = [
              `Part of domain: ${domain?.name}`,
              `Topic: ${topic.name}`,
              "Related concepts:",
              ...(topic.details || ["No additional details available"]),
            ];
          }
        }

        setSelectedNode({
          title:
            node.id === "-1" ? "Learn Anything - Getting Started" : node.name,
          content: modalContent,
        });
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
  }, [data, isDarkMode]);

  return (
    <>
      <div
        ref={chartRef}
        className="w-full h-[800px] bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg"
      />
      <NodeModal
        isOpen={!!selectedNode}
        onClose={() => setSelectedNode(null)}
        title={selectedNode?.title || ""}
        content={selectedNode?.content || []}
        isDarkMode={isDarkMode}
      />
    </>
  );
}
