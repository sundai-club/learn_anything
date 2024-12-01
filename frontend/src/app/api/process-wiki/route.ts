import { NextResponse } from "next/server";

const dummyData = {
  domains: [
    {
      id: "cs",
      name: "Computer Science",
      description: "Study of computation, algorithms, and information systems",
      topics: [
        {
          id: "cs_algo",
          name: "Algorithms",
          description: "Methods for solving problems step by step",
          details: [
            "Sorting algorithms",
            "Search algorithms",
            "Dynamic programming",
            "Graph algorithms",
            "Optimization techniques",
          ],
        },
        {
          id: "cs_ds",
          name: "Data Structures",
          description: "Ways to organize and store data efficiently",
          details: [
            "Arrays and Lists",
            "Trees and Graphs",
            "Hash Tables",
            "Heaps",
            "Advanced data structures",
          ],
        },
        {
          id: "cs_ai",
          name: "AI & ML",
          description: "Systems that can learn and make decisions",
          details: [
            "Machine Learning basics",
            "Neural Networks",
            "Natural Language Processing",
            "Computer Vision",
            "Reinforcement Learning",
          ],
        },
      ],
    },
    {
      id: "math",
      name: "Mathematics",
      description: "Foundation of quantitative and logical reasoning",
      topics: [
        {
          id: "math_calc",
          name: "Calculus",
          description: "Study of continuous change and motion",
          details: [
            "Limits and Continuity",
            "Derivatives and Applications",
            "Integration Techniques",
            "Multivariable Calculus",
            "Differential Equations",
          ],
        },
        {
          id: "math_alg",
          name: "Linear Algebra",
          description: "Study of vectors, matrices, and linear systems",
          details: [
            "Vector Spaces",
            "Matrix Operations",
            "Eigenvalues & Eigenvectors",
            "Linear Transformations",
            "Applications in 3D Graphics",
          ],
        },
        {
          id: "math_prob",
          name: "Probability",
          description: "Analysis of random phenomena and uncertainty",
          details: [
            "Probability Theory",
            "Random Variables",
            "Distributions",
            "Statistical Inference",
            "Stochastic Processes",
          ],
        },
      ],
    },
    {
      id: "physics",
      name: "Physics",
      description: "Study of matter, energy, and fundamental forces",
      topics: [
        {
          id: "phys_mech",
          name: "Mechanics",
          description: "Motion and behavior of physical objects",
          details: [
            "Newton's Laws",
            "Conservation Laws",
            "Rotational Motion",
            "Gravitation",
            "Fluid Dynamics",
          ],
        },
        {
          id: "phys_em",
          name: "Electromagnetism",
          description: "Electric and magnetic phenomena",
          details: [
            "Electric Fields",
            "Magnetic Fields",
            "Maxwell's Equations",
            "Electromagnetic Waves",
            "Circuit Theory",
          ],
        },
        {
          id: "phys_quantum",
          name: "Quantum Physics",
          description: "Behavior of matter at atomic scales",
          details: [
            "Wave-Particle Duality",
            "Schrödinger Equation",
            "Quantum States",
            "Atomic Structure",
            "Quantum Computing",
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

    console.log("Processing URL:", url);

    // For now, return the dummy data
    return NextResponse.json(dummyData);
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
