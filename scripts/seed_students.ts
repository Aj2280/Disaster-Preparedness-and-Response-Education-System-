import { prisma } from "../lib/prisma";
import * as fs from "fs";
import * as path from "path";

async function main() {
  console.log("Starting to seed students from student_dataset_1000.csv...");

  const csvPath = path.resolve(__dirname, "../student_dataset_1000.csv");
  const csvContent = fs.readFileSync(csvPath, "utf-8");

  const lines = csvContent.split("\n").filter((l) => l.trim().length > 0);
  const headers = lines[0].split(",");

  const students = lines.slice(1).map((line) => {
    const values = line.split(",");
    const student: any = {};
    headers.forEach((header, idx) => {
      student[header.trim()] = values[idx]?.trim();
    });
    return student;
  });

  // Extract unique schools
  const uniqueSchools: any = {};
  for (const student of students) {
    if (!uniqueSchools[student.school_id]) {
      uniqueSchools[student.school_id] = {
        id: student.school_id,
        state: student.state,
        city: student.district,
      };
    }
  }

  console.log(`Found ${Object.keys(uniqueSchools).length} unique schools.`);

  // Insert schools
  let schoolCount = 0;
  for (const schoolId in uniqueSchools) {
    const s = uniqueSchools[schoolId];
    await prisma.school.upsert({
      where: { id: s.id },
      update: {},
      create: {
        id: s.id,
        name: `School ${s.id}`,
        state: s.state,
        city: s.city,
      },
    });
    schoolCount++;
  }
  console.log(`Upserted ${schoolCount} schools.`);

  // Insert users and profiles
  console.log(`Inserting ${students.length} students...`);
  let studentCount = 0;
  for (const student of students) {
    if (!student.student_name || !student.student_id) continue;
    const email = `${student.student_name.toLowerCase().replace(/ /g, ".")}@example.com`;

    // Ensure email is unique by appending student_id if necessary, but we can just use the unique id
    const uniqueEmail = `${student.student_id.toLowerCase()}@example.com`;

    const user = await prisma.user.upsert({
      where: { email: uniqueEmail },
      update: {
        schoolId: student.school_id,
      },
      create: {
        name: student.student_name,
        email: uniqueEmail,
        role: "STUDENT",
        schoolId: student.school_id,
      },
    });

    await prisma.studentProfile.upsert({
      where: { userId: user.id },
      update: {
        grade: student.class,
        rollNumber: student.roll_no,
        avgScore: parseFloat(student.awareness_score) || 0,
      },
      create: {
        userId: user.id,
        grade: student.class,
        rollNumber: student.roll_no,
        avgScore: parseFloat(student.awareness_score) || 0,
      },
    });
    
    studentCount++;
    if (studentCount % 100 === 0) {
      console.log(`Inserted ${studentCount} students...`);
    }
  }
  
  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
