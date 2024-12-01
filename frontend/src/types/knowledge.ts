export interface Topic {
  id: string;
  name: string;
}

export interface Domain {
  id: string;
  name: string;
  topics: Topic[];
}

export interface KnowledgeGraph {
  domains: Domain[];
}

export interface GraphNode {
  id: string;
  name: string;
  symbolSize: number;
  itemStyle?: {
    color?: string;
    borderColor?: string;
  };
  label?: {
    show: boolean;
    position?: string;
    formatter: string;
    color?: string;
    fontSize?: number;
  };
  x?: number;
  y?: number;
  fixed?: boolean;
}

export interface GraphEdge {
  source: string;
  target: string;
  lineStyle?: {
    curveness?: number;
  };
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}