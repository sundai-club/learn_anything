import { ReactNode } from "react";

interface Progress {
  completed: boolean;
  timestamp?: number;
}

export interface ProgressMap {
  [nodeId: string]: Progress;
}

export interface Topic {
  id: string;
  name: string;
  description?: string;
  details?: string[];
  progress?: Progress;
}

export interface Domain {
  id: string;
  name: string;
  description?: string;
  topics?: Topic[];
}

export interface KnowledgeGraph {
  domains: Domain[];
}

export interface KnowledgeGraphProps {
  data: KnowledgeGraph | null;
  isDarkMode: boolean;
  onProgressUpdate: (nodeId: string, completed: boolean) => void;
  progress: ProgressMap;
}

export interface GraphNodeLabel {
  show: boolean;
  position: string;
  formatter: string | ((params: any) => ReactNode);
  rich?: {
    title: {
      fontSize: number;
      fontWeight: string;
      padding: number[];
      width: number;
      align: string;
    };
    link: {
      fontSize: number;
      color: string;
      lineHeight: number;
      width: number;
      align: string;
      padding: number[];
      textDecoration?: string;
    };
    progress: {
      fontSize: number;
      color: string;
      padding: number[];
      width: number;
      align: string;
      fontWeight?: string;
    };
    status: {
      fontSize: number;
      color: string;
      padding: number[];
      width: number;
      align: string;
    };
  };
}

export interface GraphNodeItemStyle {
  color: string;
  borderColor: string;
  borderRadius?: number;
  borderWidth?: number;
  shadowBlur?: number;
  shadowColor?: string;
}

export interface GraphNode {
  id: string;
  name: string;
  fixed?: boolean;
  x?: number;
  y?: number;
  symbolSize: number | [number, number];
  symbol?: string;
  itemStyle?: GraphNodeItemStyle;
  label?: GraphNodeLabel;
  category?: string;
  details?: string[];
}

export interface GraphEdge {
  id?: string;
  source: string;
  target: string;
  lineStyle?: {
    curveness?: number;
    color?: string;
    width?: number;
    opacity?: number;
    type?: string | number[];
  };
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}
