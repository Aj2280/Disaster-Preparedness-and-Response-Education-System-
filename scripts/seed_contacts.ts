import { prisma } from "../lib/prisma";
import * as fs from "fs";
import * as path from "path";

async function main() {
  console.log("Starting to seed emergency contacts from emergency_contacts_dataset.csv...");

  const csvPath = path.resolve(__dirname, "../emergency_contacts_dataset.csv");
  const csvContent = fs.readFileSync(csvPath, "utf-8");

  const lines = csvContent.split("\n").filter((l) => l.trim().length > 0);
  const headers = lines[0].split(",");

  const rawContacts = lines.slice(1).map((line) => {
    // Basic CSV parse (handles quoted fields like address)
    const values = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || line.split(",");
    
    // Naive fallback
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

  console.log(`Parsed ${rawContacts.length} contacts. Processing...`);

  // We can fetch all schools to match cities
  const schools = await prisma.school.findMany({
    select: { id: true, city: true }
  });

  let createdCount = 0;

  for (const contact of rawContacts) {
    if (!contact.department || !contact.contact_number) continue;

    // Check if the city exists in our schools
    const matchedSchools = schools.filter(s => 
      s.city.toLowerCase() === (contact.city || "").toLowerCase()
    );

    if (matchedSchools.length > 0) {
      // Assign to all matched schools
      for (const school of matchedSchools) {
        await prisma.emergencyContact.create({
          data: {
            schoolId: school.id,
            name: contact.department,
            role: contact.service,
            phone: contact.contact_number,
            altPhone: contact.alternate_number || null,
            email: contact.email || null,
            isNational: false,
            priority: 1
          }
        });
        createdCount++;
      }
    } else {
      // If no school matched, assign as national
      await prisma.emergencyContact.create({
        data: {
          name: contact.department + ` (${contact.city || 'Generic'})`,
          role: contact.service,
          phone: contact.contact_number,
          altPhone: contact.alternate_number || null,
          email: contact.email || null,
          isNational: true,
          priority: 2
        }
      });
      createdCount++;
    }
  }

  console.log(`Successfully seeded ${createdCount} emergency contact records!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
