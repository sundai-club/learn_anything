"use client";
import { useRef, useEffect, useState } from "react";
import * as echarts from "echarts";
import {
  KnowledgeGraph as KnowledgeGraphType,
  GraphNode,
  GraphEdge,
  ProgressMap,
  Topic,
  EChartsOption,
} from "../types/knowledge";
import { knowledgeService } from "../services/api";

interface ExtendedGraphNode extends GraphNode {
  x?: number;
  y?: number;
}

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
  const chartInstance = useRef<echarts.ECharts | null>(null);
  const [loadingNodeId, setLoadingNodeId] = useState<string | null>(null);
  const [relatedLinks, setRelatedLinks] = useState<Topic[]>([]);

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

  const getNodeStyle = (
    node: { id: string; name: string },
    isCompleted?: boolean
  ) => {
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

  const updateRelatedLinks = (newTopics: Topic[]) => {
    setRelatedLinks((prevLinks) => {
      const existingIds = new Set(prevLinks.map((link) => link.id));
      const newLinks = newTopics.filter((topic) => !existingIds.has(topic.id));
      return [...prevLinks, ...newLinks];
    });
  };

  const findExistingNode = (
    nodes: GraphNode[],
    id: string
  ): GraphNode | undefined => {
    return nodes.find((node) => node.id === id);
  };

  useEffect(() => {
    if (!chartRef.current || !data || !data.domains?.[0]?.topics) return;

    const chart = echarts.init(chartRef.current);

    chartInstance.current = chart;

    const graphData: GraphNode[] = [];
    const edges: GraphEdge[] = [];

    // Create center node

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
        const node = params.data as ExtendedGraphNode;
        const nodeId = node.id;

        // Handle progress update without resetting graph
        if (!nodeId.startsWith("http")) {
          onProgressUpdate(nodeId, !progress[nodeId]?.completed);
          return;
        }

        // Prevent reloading the same node
        if (loadingNodeId === nodeId) {
          return;
        }

        try {
          setLoadingNodeId(nodeId);

          const newData = await knowledgeService.processWikiLink(nodeId);

          if (!chartInstance.current) {
            console.error("Chart instance not found");
            return;
          }

          if (newData?.domains?.[0]?.topics) {
            const currentOption =
              chartInstance.current.getOption() as EChartsOption;

            if (
              !currentOption?.series?.[0]?.data ||
              !currentOption?.series?.[0]?.edges
            ) {
              console.error("Invalid chart state");
              return;
            }

            const currentNodes = [
              ...currentOption.series[0].data,
            ] as ExtendedGraphNode[];
            const currentEdges = [
              ...currentOption.series[0].edges,
            ] as GraphEdge[];

            // Track existing edges to prevent duplicates
            const existingEdgeMap = new Set(
              currentEdges.map((e) => `${e.source}-${e.target}`)
            );

            const { nodes: newNodes, edges: newEdges } =
              newData.domains[0].topics.reduce(
                (
                  acc: { nodes: ExtendedGraphNode[]; edges: GraphEdge[] },
                  topic: Topic
                ) => {
                  const existingNode = currentNodes.find(
                    (n) => n.id === topic.id
                  );

                  if (existingNode) {
                    // Add edge if it doesn't already exist
                    const edgeKey = `${nodeId}-${topic.id}`;
                    if (!existingEdgeMap.has(edgeKey)) {
                      acc.edges.push({
                        source: nodeId,
                        target: topic.id,
                        lineStyle: { curveness: 0.2 },
                      });
                    }
                  } else {
                    // Calculate position for the new node
                    const angle = Math.random() * 2 * Math.PI;
                    const radius = 200;
                    const x = (node.x || 0) + radius * Math.cos(angle);
                    const y = (node.y || 0) + radius * Math.sin(angle);

                    // Create new node
                    const newNode: ExtendedGraphNode = {
                      id: topic.id,
                      name: topic.name,
                      symbolSize: [180, 80],
                      symbol: "roundRect",
                      x,
                      y,
                      fixed: false, // Allow the force layout to position nodes
                      itemStyle: getNodeStyle(topic, false),
                      label: getNodeLabel(topic, false),
                    };

                    acc.nodes.push(newNode);
                    acc.edges.push({
                      source: nodeId,
                      target: topic.id,
                      lineStyle: { curveness: 0.2 },
                    });
                  }

                  return acc;
                },
                { nodes: [], edges: [] }
              );

            // Append new nodes and edges to the graph
            chartInstance.current.setOption(
              {
                series: [
                  {
                    type: "graph",
                    data: [...currentNodes, ...newNodes],
                    edges: [...currentEdges, ...newEdges],
                  },
                ],
              },
              { notMerge: true }
            );

            // Update related links
            updateRelatedLinks(newData.domains[0].topics);
            onNodeClick(nodeId, newData);
          }
        } catch (error) {
          console.error("Error in click handler:", error);
        } finally {
          setLoadingNodeId(null);
        }
      }
    });

    const handleResize = () => {
      chart.resize();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (chartInstance.current) {
        chartInstance.current.dispose();
      }
      chartInstance.current = null;
    };
  }, [data, isDarkMode, progress, loadingNodeId]);

  return (
    <div className="flex flex-col gap-8">
      <div
        ref={chartRef}
        className="w-full h-[800px] bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg"
      />

      {relatedLinks.length > 0 && (
        <div className="w-full p-4 bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-secondary-light dark:text-secondary-dark">
              Related Topics ({relatedLinks.length})
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => setRelatedLinks([])}
                className="px-3 py-1 text-sm rounded-md bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100 hover:opacity-80"
              >
                Clear All
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {relatedLinks.map((topic) => (
              <div
                key={topic.id}
                className={`group relative p-4 bg-background-light dark:bg-background-dark rounded-lg shadow hover:shadow-md transition-all ${
                  progress[topic.id]?.completed
                    ? "border-2 border-green-500"
                    : "hover:border-2 hover:border-primary-light dark:hover:border-primary-dark"
                }`}
              >
                <div className="flex flex-col h-full">
                  <div className="flex-grow">
                    <h3 className="font-semibold text-secondary-light dark:text-secondary-dark mb-2 group-hover:text-primary-light dark:group-hover:text-primary-dark transition-colors">
                      {topic.name}
                    </h3>
                    {topic.description && (
                      <p className="text-sm text-secondary-light dark:text-secondary-dark opacity-75 mb-3">
                        {topic.description}
                      </p>
                    )}
                  </div>
                  <div className="flex justify-between items-center mt-4 pt-3 border-t border-border-light dark:border-border-dark">
                    <div className="flex gap-2">
                      <a
                        href={topic.id}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-1 text-sm rounded-md bg-primary-light dark:bg-primary-dark text-white hover:opacity-80"
                      >
                        <span>Learn</span>
                        <svg
                          className="w-4 h-4 ml-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                      </a>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onProgressUpdate(
                          topic.id,
                          !progress[topic.id]?.completed
                        );
                      }}
                      className={`inline-flex items-center px-3 py-1 rounded-md text-sm transition-colors ${
                        progress[topic.id]?.completed
                          ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700"
                      }`}
                    >
                      {progress[topic.id]?.completed ? (
                        <>
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          <span>Completed</span>
                        </>
                      ) : (
                        "Mark Complete"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
