import { NextResponse } from "next/server";

const dummyData = {
  domains: [
    {
      id: "https://en.wikipedia.org/wiki/Computer_science",
      name: "Computer Science",
      description: "Study of computation and information processing",
      topics: [
        {
          id: "https://en.wikipedia.org/wiki/Algorithm",
          name: "Algorithms",
          description: "Step-by-step procedures for calculations",
          details: [
            "Sorting algorithms",
            "Search algorithms",
            "Graph algorithms",
            "Dynamic programming",
            "Optimization methods",
          ],
          subtopics: [
            {
              id: "https://en.wikipedia.org/wiki/Sorting_algorithm",
              name: "Sorting Algorithms",
              description: "Methods for ordering data elements",
              children: [
                {
                  id: "https://en.wikipedia.org/wiki/Quicksort",
                  name: "QuickSort",
                  description: "Fast divide-and-conquer sorting",
                },
                {
                  id: "https://en.wikipedia.org/wiki/Merge_sort",
                  name: "MergeSort",
                  description: "Stable divide-and-conquer sorting",
                },
              ],
            },
          ],
        },
        {
          id: "https://en.wikipedia.org/wiki/Data_structure",
          name: "Data Structures",
          description: "Ways to organize data efficiently",
          details: [
            "Arrays and Lists",
            "Trees and Graphs",
            "Hash Tables",
            "Heaps",
            "Advanced structures",
          ],
        },
        {
          id: "https://en.wikipedia.org/wiki/Artificial_intelligence",
          name: "Artificial Intelligence",
          description: "Systems that simulate intelligence",
          details: [
            "Machine Learning",
            "Neural Networks",
            "Natural Language Processing",
            "Computer Vision",
            "Robotics",
          ],
        },
      ],
    },
    {
      id: "https://en.wikipedia.org/wiki/Mathematics",
      name: "Mathematics",
      description: "Study of numbers, quantities, and shapes",
      topics: [
        {
          id: "https://en.wikipedia.org/wiki/Calculus",
          name: "Calculus",
          description: "Study of continuous change",
          details: [
            "Limits",
            "Derivatives",
            "Integrals",
            "Series",
            "Vector Calculus",
          ],
        },
        {
          id: "https://en.wikipedia.org/wiki/Algebra",
          name: "Algebra",
          description: "Study of mathematical structures",
          details: [
            "Linear Algebra",
            "Abstract Algebra",
            "Number Theory",
            "Group Theory",
            "Ring Theory",
          ],
        },
        {
          id: "https://en.wikipedia.org/wiki/Statistics",
          name: "Statistics",
          description: "Analysis of data and probability",
          details: [
            "Probability Theory",
            "Statistical Inference",
            "Regression Analysis",
            "Hypothesis Testing",
            "Bayesian Statistics",
          ],
        },
      ],
    },
  ],
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get("url");

    if (!url) {
      return NextResponse.json(
        { error: "URL parameter is required" },
        { status: 400 }
      );
    }

    return NextResponse.json(dummyData);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
