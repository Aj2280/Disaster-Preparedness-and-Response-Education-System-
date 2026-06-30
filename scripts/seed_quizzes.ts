import { prisma } from "../lib/prisma";
import { DisasterType } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

function mapCategoryToDisasterType(category: string): DisasterType {
  const cat = category.toUpperCase().trim();
  switch (cat) {
    case "EARTHQUAKE": return DisasterType.EARTHQUAKE;
    case "FLOOD": return DisasterType.FLOOD;
    case "FIRE SAFETY": return DisasterType.FIRE;
    case "CYCLONE": return DisasterType.CYCLONE;
    case "TSUNAMI": return DisasterType.TSUNAMI;
    case "FIRST AID": return DisasterType.GENERAL;
    case "EMERGENCY RESPONSE": return DisasterType.GENERAL;
    case "DISASTER MANAGEMENT": return DisasterType.GENERAL;
    case "GEOGRAPHY": return DisasterType.GENERAL;
    case "SCHOOL SAFETY": return DisasterType.GENERAL;
    default: return DisasterType.GENERAL;
  }
}

async function main() {
  console.log("Starting to seed quizzes from disaster_quiz_dataset_1000.csv...");

  const csvPath = path.resolve(__dirname, "../disaster_quiz_dataset_1000.csv");
  const csvContent = fs.readFileSync(csvPath, "utf-8");

  // Read lines, avoiding empty lines
  // Splitting by \n alone is risky if questions or explanations have commas, but we will assume no quoted newlines for now.
  // Actually, split by newline and parse carefully.
  // Because it's a simple CSV, a regex split by comma honoring quotes is better, but since explanations don't seem to have quotes based on the sample, we can use a naive split.
  
  const lines = csvContent.split("\n").filter((l) => l.trim().length > 0);
  const headers = lines[0].split(",");

  const rawQuestions = lines.slice(1).map((line) => {
    // Simple split by comma. Since questions might have commas, a better regex is needed:
    // This matches commas outside quotes
    const values = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || line.split(",");
    
    // Fallback if regex doesn't match perfectly with the 10 columns
    const cleanValues = values.length >= 10 ? values : line.split(",");
    
    const obj: any = {};
    headers.forEach((header, idx) => {
      let val = cleanValues[idx] || "";
      if (val.startsWith('"') && val.endsWith('"')) {
        val = val.substring(1, val.length - 1);
      }
      obj[header.trim()] = val.trim();
    });
    return obj;
  });

  // Group by category and difficulty
  const grouped: Record<string, Record<string, any[]>> = {};

  for (const q of rawQuestions) {
    const cat = q.category;
    const diff = q.difficulty;
    if (!cat || !diff) continue;
    
    if (!grouped[cat]) grouped[cat] = {};
    if (!grouped[cat][diff]) grouped[cat][diff] = [];
    grouped[cat][diff].push(q);
  }

  // Iterate categories
  for (const [category, diffGroup] of Object.entries(grouped)) {
    // Create or find Module
    const disasterType = mapCategoryToDisasterType(category);
    
    // We search by title first.
    let module = await prisma.module.findFirst({
      where: { title: category }
    });

    if (!module) {
      module = await prisma.module.create({
        data: {
          title: category,
          description: `Educational module covering ${category} safety and procedures.`,
          overview: `Overview of ${category}`,
          causes: `Causes of ${category}`,
          warningSigns: `Warning signs for ${category}`,
          beforeDisaster: `What to do before a ${category}`,
          duringDisaster: `What to do during a ${category}`,
          afterDisaster: `What to do after a ${category}`,
          emergencyChecklist: `Emergency checklist for ${category}`,
          safetyTips: `Safety tips for ${category}`,
          disasterType: disasterType,
        }
      });
      console.log(`Created new module: ${category}`);
    } else {
      console.log(`Found existing module: ${category}`);
    }

    for (const [difficulty, questions] of Object.entries(diffGroup)) {
      // Chunk into quizzes of 10 questions each
      const chunkSize = 10;
      for (let i = 0; i < questions.length; i += chunkSize) {
        const chunk = questions.slice(i, i + chunkSize);
        const quizIndex = (i / chunkSize) + 1;
        const quizTitle = `${category} - ${difficulty} Quiz ${quizIndex}`;
        
        // Create Quiz
        const quiz = await prisma.quiz.create({
          data: {
            title: quizTitle,
            description: `A ${difficulty.toLowerCase()} level quiz on ${category} containing ${chunk.length} questions.`,
            moduleId: module.id,
            passingScore: 70,
            timeLimit: 15,
          }
        });

        // Insert questions
        const questionsData = chunk.map((q, idx) => ({
          quizId: quiz.id,
          text: q.question,
          optionA: q.option_a,
          optionB: q.option_b,
          optionC: q.option_c,
          optionD: q.option_d,
          correctOption: q.correct_answer,
          explanation: q.explanation || "No explanation provided.",
          order: idx + 1,
        }));

        await prisma.question.createMany({
          data: questionsData
        });
      }
      
      console.log(`Created quizzes for ${category} - ${difficulty} (${questions.length} total questions)`);
    }
  }

  console.log("Quiz seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
