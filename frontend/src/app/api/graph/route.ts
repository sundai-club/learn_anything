import { NextResponse } from "next/server";

export async function GET() {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const domains = {
    "Computer Science": {
      topics: ["Algorithms", "Data Structures", "AI", "Networks"],
      details: {
        Algorithms: [
          "Sorting",
          "Searching",
          "Dynamic Programming",
          "Graph Algorithms",
        ],
        "Data Structures": [
          "Arrays",
          "Linked Lists",
          "Trees",
          "Graphs",
          "Hash Tables",
        ],
        AI: ["Machine Learning", "Neural Networks", "Computer Vision", "NLP"],
        Networks: ["TCP/IP", "HTTP", "DNS", "Network Security"],
      },
    },
    Mathematics: {
      topics: ["Algebra", "Calculus", "Statistics", "Geometry"],
      details: {
        Algebra: ["Linear Algebra", "Abstract Algebra", "Number Theory"],
        Calculus: ["Limits", "Derivatives", "Integrals", "Multivariable"],
        Statistics: ["Probability", "Hypothesis Testing", "Regression"],
        Geometry: ["Euclidean", "Non-Euclidean", "Topology"],
      },
    },
  };

  return NextResponse.json({ domains });
}
