import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const sampleQuestions = [
  {
    id: 1,
    question: "What is the primary goal of artificial intelligence?",
    options: [
      "To replace human workers",
      "To demonstrate intelligence similar to humans",
      "To maximize computational power",
      "To store large amounts of data",
    ],
    correctAnswer: "To demonstrate intelligence similar to humans",
    hint: "Think about the fundamental purpose of AI research and development 💡",
  },
  // Add more sample questions as needed
];

async function main() {
  // Create a sample quiz
  await prisma.quiz.create({
    data: {
      name: "Introduction to AI",
      text: "Artificial intelligence (AI) is intelligence demonstrated by machines...",
      questions: JSON.stringify(sampleQuestions),
      totalQuestions: sampleQuestions.length,
      correctAnswers: 0,
      skippedQuestions: 0,
      timeSpent: 0,
      timesCompleted: 0,
      totalScore: 0,
    },
  });

  console.log("Database seeded with sample quiz!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
