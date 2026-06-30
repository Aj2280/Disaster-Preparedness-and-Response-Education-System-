import { prisma } from "../lib/prisma";
import { DisasterType } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

async function main() {
  console.log("Starting to seed historical disasters from natural_disasters_2024.csv...");

  const csvPath = path.resolve(__dirname, "../natural_disasters_2024.csv");
  const csvContent = fs.readFileSync(csvPath, "utf-8");

  const lines = csvContent.split("\n").filter((l) => l.trim().length > 0);
  const headers = lines[0].split(",");

  const disasters = lines.slice(1).map((line) => {
    const values = line.split(",");
    const disaster: any = {};
    headers.forEach((header, idx) => {
      disaster[header.trim()] = values[idx]?.trim();
    });
    return disaster;
  });

  const mapDisasterType = (typeStr: string): DisasterType => {
    const t = typeStr?.toUpperCase();
    if (t === "WILDFIRE") return DisasterType.FIRE;
    if (t === "HURRICANE" || t === "TORNADO") return DisasterType.CYCLONE;
    if (t === "FLOOD") return DisasterType.FLOOD;
    if (t === "EARTHQUAKE") return DisasterType.EARTHQUAKE;
    return DisasterType.EARTHQUAKE; // fallback
  };

  console.log(`Parsed ${disasters.length} disasters. Inserting in batches...`);

  // We can use createMany for performance
  const batchSize = 1000;
  for (let i = 0; i < disasters.length; i += batchSize) {
    const batch = disasters.slice(i, i + batchSize).map((d) => ({
      originalId: parseInt(d["Disaster_ID"]) || null,
      disasterType: mapDisasterType(d["Disaster_Type"]),
      location: d["Location"] || "Unknown",
      magnitude: parseFloat(d["Magnitude"]) || 0,
      date: new Date(d["Date"] || Date.now()),
      fatalities: parseInt(d["Fatalities"]) || 0,
      economicLoss: parseFloat(d["Economic_Loss($)"]) || 0,
    }));

    await prisma.historicalDisaster.createMany({
      data: batch,
      skipDuplicates: true,
    });
    console.log(`Inserted batch ${i / batchSize + 1} (${i + batch.length} / ${disasters.length})`);
  }

  console.log("Seeding historical disasters complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
