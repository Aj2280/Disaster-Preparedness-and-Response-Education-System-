import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const user = await prisma.user.findFirst({ where: { role: 'ADMIN' } })
  console.log("User:", user)

  if (!user) return console.log("No user found")

  try {
    const schedule = await prisma.eventSchedule.create({
      data: {
        schoolId: user.schoolId,
        title: "Test Drill",
        description: null,
        eventType: "DRILL",
        disasterType: null,
        date: new Date("2026-06-29T10:35"),
        location: null,
        createdBy: user.id
      }
    })
    console.log("Success:", schedule)
  } catch (e) {
    console.error("Error creating schedule:", e)
  }
}

main().finally(() => prisma.$disconnect())
