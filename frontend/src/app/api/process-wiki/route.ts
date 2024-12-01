import { NextResponse } from 'next/server';

// Dummy data for testing
const dummyData = {
  domains: [
    {
      id: "cs",
      name: "Computer Science",
      topics: [
        { id: "cs_algo", name: "Algorithms" },
        { id: "cs_ds", name: "Data Structures" },
        { id: "cs_ai", name: "Artificial Intelligence" }
      ]
    },
    {
      id: "math",
      name: "Mathematics",
      topics: [
        { id: "math_calc", name: "Calculus" },
        { id: "math_alg", name: "Algebra" },
        { id: "math_stats", name: "Statistics" }
      ]
    }
  ]
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');

    if (!url) {
      return NextResponse.json(
        { error: 'URL parameter is required' },
        { status: 400 }
      );
    }

    console.log('Processing URL:', url);  // Log the URL for debugging

    // For now, just return dummy data regardless of the URL
    return NextResponse.json(dummyData);
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}