import { PrismaClient, Role, DisasterType, AlertPriority, AlertCategory } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // ─── School ───────────────────────────────────────────────────────────────
  const school = await prisma.school.upsert({
    where: { id: 'school-001' },
    update: {},
    create: {
      id: 'school-001',
      name: 'Delhi Public School',
      address: '123 Main Road',
      city: 'New Delhi',
      state: 'Delhi',
      country: 'India',
      phone: '+91-11-12345678',
      email: 'info@dps.edu.in',
    },
  })

  // ─── Users ────────────────────────────────────────────────────────────────
  const adminPassword = await bcrypt.hash('Admin@123', 12)
  const teacherPassword = await bcrypt.hash('Teacher@123', 12)
  const studentPassword = await bcrypt.hash('Student@123', 12)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@disasterprep.edu' },
    update: {},
    create: {
      name: 'Rajesh Kumar',
      email: 'admin@disasterprep.edu',
      hashedPassword: adminPassword,
      role: Role.ADMIN,
      emailVerified: new Date(),
      schoolId: school.id,
    },
  })

  const teacher = await prisma.user.upsert({
    where: { email: 'teacher@disasterprep.edu' },
    update: {},
    create: {
      name: 'Priya Sharma',
      email: 'teacher@disasterprep.edu',
      hashedPassword: teacherPassword,
      role: Role.TEACHER,
      emailVerified: new Date(),
      schoolId: school.id,
      teacherProfile: {
        create: { subject: 'Science', department: 'Natural Sciences', employeeId: 'TCH-001' },
      },
    },
  })

  const student = await prisma.user.upsert({
    where: { email: 'student@disasterprep.edu' },
    update: {},
    create: {
      name: 'Arjun Patel',
      email: 'student@disasterprep.edu',
      hashedPassword: studentPassword,
      role: Role.STUDENT,
      emailVerified: new Date(),
      schoolId: school.id,
      studentProfile: {
        create: { grade: '10', section: 'A', rollNumber: '2024010', xpPoints: 320, level: 3 },
      },
    },
  })

  // ─── Modules ──────────────────────────────────────────────────────────────
  const modules = [
    {
      title: 'Earthquake Preparedness',
      disasterType: DisasterType.EARTHQUAKE,
      iconEmoji: '🌍',
      color: '#EF4444',
      order: 1,
      description: 'Learn how to prepare for, survive, and recover from earthquakes.',
      overview: 'An earthquake is the shaking of the surface of the Earth resulting from a sudden release of energy in the lithosphere that creates seismic waves. Earthquakes can range in intensity from those too weak to be felt to those strong enough to propel people into the air and destroy entire cities.',
      causes: 'Earthquakes are caused by movement of tectonic plates. When two plates grind against each other (convergent boundaries), pull apart (divergent boundaries), or slide past one another (transform boundaries), enormous energy is released. Volcanic activity and human activities like mining can also trigger earthquakes.',
      warningSigns: '• Animals behaving unusually or fleeing\n• Small foreshocks preceding the main quake\n• Ground rumbling sounds\n• Water in wells turning cloudy\n• Strange lights in the sky (earthquake lights)\n• Sudden changes in groundwater levels',
      beforeDisaster: '• Secure heavy furniture and appliances to walls\n• Know the safe spots in each room (under sturdy tables, against interior walls)\n• Keep emergency supplies ready (water, food, first aid kit, flashlights)\n• Create a family communication plan\n• Practice Drop, Cover, and Hold On drills\n• Identify safe meeting spots outside your home\n• Check your home for structural hazards\n• Store at least 3 days of emergency supplies',
      duringDisaster: '• DROP to your hands and knees immediately\n• Take COVER under a sturdy desk or table, or against an interior wall\n• HOLD ON until the shaking stops\n• Stay away from windows, outside walls, and anything that could fall\n• If outdoors: move away from buildings, trees, and power lines\n• If in a vehicle: pull over safely, away from bridges and overpasses\n• NEVER use elevators\n• Expect aftershocks',
      afterDisaster: '• Check yourself and others for injuries\n• Be prepared for aftershocks\n• Check for gas leaks, fires, and structural damage\n• If you smell gas, leave immediately and call authorities\n• Listen to emergency broadcasts\n• Help neighbors, especially elderly and disabled\n• Document damage for insurance\n• Do not enter damaged buildings',
      emergencyChecklist: '✅ Emergency water (1 gallon per person per day for 3 days)\n✅ Non-perishable food (3-day supply)\n✅ First aid kit\n✅ Flashlights and extra batteries\n✅ Battery-powered or hand-crank radio\n✅ Whistle to signal for help\n✅ Dust masks\n✅ Plastic sheeting and duct tape\n✅ Moist towelettes and garbage bags\n✅ Wrench or pliers to turn off utilities\n✅ Manual can opener\n✅ Local maps\n✅ Cell phone with chargers and backup battery\n✅ Important documents in waterproof container',
      safetyTips: '💡 The Drop, Cover, and Hold On method saves lives\n💡 The doorway myth is false — doorframes are not safer than other spots\n💡 Triangle of Life is controversial — Drop, Cover, Hold On is recommended by experts\n💡 Practice earthquake drills at least twice a year\n💡 Know your building\'s evacuation routes\n💡 Store shoes under your bed in case of broken glass',
    },
    {
      title: 'Flood Safety & Preparedness',
      disasterType: DisasterType.FLOOD,
      iconEmoji: '🌊',
      color: '#3B82F6',
      order: 2,
      description: 'Comprehensive guide to flood preparedness and survival.',
      overview: 'Flooding is the most common and widespread natural disaster in India and globally. Floods occur when water overflows onto land that is normally dry. They can happen slowly or very quickly, affecting large regions or small areas.',
      causes: 'Heavy rainfall, rapid snowmelt, storm surge, dam or levee failure, and drainage system blockages. In India, monsoon rainfall is the primary cause. Deforestation and urbanization increase flood risk by reducing water absorption.',
      warningSigns: '• Heavy or continuous rainfall\n• Rivers rising rapidly\n• Flash flood watches or warnings issued\n• Dark, threatening skies\n• Unusual sounds of rushing water\n• Soil becoming saturated\n• Local authorities issuing evacuation orders',
      beforeDisaster: '• Know your area\'s flood risk\n• Prepare an emergency kit\n• Elevate electrical systems and appliances\n• Install check valves in plumbing\n• Waterproof your basement\n• Know your evacuation routes\n• Move valuables to higher floors\n• Keep important documents in waterproof containers\n• Have flood insurance',
      duringDisaster: '• Move immediately to higher ground\n• Do NOT walk through flowing water — 6 inches can knock you down\n• Do NOT drive through flooded roads\n• Avoid contact with floodwater (contamination risk)\n• Disconnect electrical appliances\n• Stay off bridges over fast-moving water\n• Listen to emergency broadcasts\n• Follow evacuation orders immediately',
      afterDisaster: '• Return home only when authorities say it\'s safe\n• Document flood damage before cleaning\n• Avoid floodwater — it may be contaminated\n• Pump out water gradually to avoid structural damage\n• Check for structural damage before entering\n• Clean and disinfect everything that got wet\n• Watch for mold growth\n• Boil water until supply is declared safe',
      emergencyChecklist: '✅ Life jackets / flotation devices\n✅ Waterproof bags for documents\n✅ Emergency water and food\n✅ First aid kit\n✅ Flashlights and batteries\n✅ Rope for rescue\n✅ Rubber boots and waterproof clothing\n✅ Emergency contact numbers\n✅ Battery-powered radio\n✅ Plastic sheeting for waterproofing\n✅ Sandbags (if time allows)\n✅ Cash (ATMs may not work)',
      safetyTips: '💡 Never attempt to walk through floodwaters — even 6 inches can cause you to fall\n💡 Turn around, don\'t drown — most flood deaths occur in vehicles\n💡 Floodwater can contain sewage, chemicals, and debris\n💡 Children and elderly are at highest risk\n💡 Sign up for local emergency alerts',
    },
    {
      title: 'Fire Safety & Prevention',
      disasterType: DisasterType.FIRE,
      iconEmoji: '🔥',
      color: '#F97316',
      order: 3,
      description: 'Fire prevention, escape planning, and survival techniques.',
      overview: 'Fire is one of the most destructive forces that can affect schools and homes. Understanding fire behavior and having a solid prevention and escape plan can be the difference between life and death. Every year, fire causes thousands of deaths and billions in property damage.',
      causes: 'Electrical faults (short circuits, overloaded wiring), cooking accidents, open flames (candles, fireworks), arson, lightning strikes, equipment malfunction, improper storage of flammable materials, and careless disposal of smoking materials.',
      warningSigns: '• Smell of smoke or burning\n• Visible flames or smoke\n• Fire alarms sounding\n• Flickering lights (electrical fire warning)\n• Unusual heat from walls or electrical outlets\n• Charring or discoloration on walls\n• Buzzing or crackling sounds from electrical systems',
      beforeDisaster: '• Install smoke alarms on every floor\n• Test smoke alarms monthly\n• Replace smoke alarm batteries annually\n• Create and practice a home escape plan\n• Have at least two exits from every room\n• Keep fire extinguishers accessible\n• Store flammable materials safely\n• Never leave cooking unattended\n• Keep electrical cords in good condition',
      duringDisaster: '• Activate the nearest fire alarm\n• Call emergency services (101)\n• Evacuate immediately — do NOT collect belongings\n• Feel doors before opening — if hot, use another exit\n• Crawl low under smoke\n• Close doors to slow fire spread\n• Never use elevators\n• Meet at designated assembly point\n• If trapped: seal door gaps with cloth, signal from window',
      afterDisaster: '• Do not re-enter until fire department clears the building\n• Account for all persons at assembly point\n• Seek medical attention for smoke inhalation\n• Contact insurance company\n• Document damage with photographs\n• Find temporary shelter if needed\n• Watch for hidden hot spots and embers',
      emergencyChecklist: '✅ Working smoke detectors on every floor\n✅ Carbon monoxide detectors\n✅ Fire extinguisher (check monthly)\n✅ Escape ladders for upper floors\n✅ Family escape plan with two exits per room\n✅ Designated meeting point outside\n✅ Emergency contact numbers memorized\n✅ Flashlights in accessible locations\n✅ Emergency bag near exit',
      safetyTips: '💡 Most fire deaths result from smoke inhalation, not flames\n💡 You have only 2-3 minutes to escape once a smoke alarm sounds\n💡 Practice your escape plan at least twice a year — including at night\n💡 Close doors between you and fire to buy time\n💡 Feel doors with back of hand before opening\n💡 Stop, Drop, and Roll if clothes catch fire',
    },
    {
      title: 'Cyclone Preparedness',
      disasterType: DisasterType.CYCLONE,
      iconEmoji: '🌀',
      color: '#8B5CF6',
      order: 4,
      description: 'Stay safe before, during, and after tropical cyclones.',
      overview: 'A cyclone is a large-scale air mass that rotates around a strong center of low atmospheric pressure. In India, cyclones primarily affect the eastern and western coastlines. Cyclones bring extremely strong winds, heavy rainfall, storm surges, and flooding.',
      causes: 'Cyclones form over warm tropical ocean waters (above 26°C). Warm, moist air rises, creating a low-pressure area. Surrounding air spirals inward due to Earth\'s rotation (Coriolis effect). The system strengthens as more warm, moist air feeds the system.',
      warningSigns: '• Cyclone watches and warnings from meteorological departments\n• Rapidly falling barometric pressure\n• Increasing wind speeds\n• Heavy, dark clouds and unusual wave patterns\n• Strange animal behavior\n• IMD alerts and color-coded warnings (Yellow, Orange, Red)',
      beforeDisaster: '• Monitor IMD weather updates\n• Reinforce your home (board windows, secure roof)\n• Store emergency supplies for at least 7 days\n• Fill bathtubs with water\n• Charge all devices and power banks\n• Know your evacuation route and shelter location\n• Move to a cyclone shelter if advised\n• Secure or bring indoors loose outdoor items\n• Park vehicles in safe locations',
      duringDisaster: '• Stay indoors away from windows\n• Move to the strongest part of the building\n• If in an evacuation zone, leave early\n• Do not venture outside during the eye of the storm\n• Keep emergency radio on for updates\n• Stay away from coastal areas and flood-prone zones\n• If caught in open: lie flat in a ditch or low area\n• Do not try to cross flooded roads',
      afterDisaster: '• Wait for all-clear signal before going outside\n• Avoid damaged buildings and downed power lines\n• Do not drink tap water until cleared\n• Report missing persons to authorities\n• Help neighbors in need\n• Document damage for insurance\n• Be aware of post-cyclone flooding\n• Watch for weakened trees and structures',
      emergencyChecklist: '✅ Emergency food and water (7-day supply)\n✅ Battery radio/TV for updates\n✅ Flashlights and extra batteries\n✅ First aid kit\n✅ Important documents in waterproof container\n✅ Cash\n✅ Medications (minimum 7-day supply)\n✅ Blankets and warm clothing\n✅ Rope and tools\n✅ Whistle\n✅ Plywood to board windows\n✅ Sandbags',
      safetyTips: '💡 Never ignore evacuation orders from authorities\n💡 The eye of the storm can be deceptively calm — stay indoors\n💡 Storm surges are the deadliest part of cyclones\n💡 A Category 1 cyclone can still be dangerous\n💡 Follow IMD (India Meteorological Department) alerts',
    },
    {
      title: 'Landslide Awareness',
      disasterType: DisasterType.LANDSLIDE,
      iconEmoji: '⛰️',
      color: '#92400E',
      order: 5,
      description: 'Understand and survive landslides and mudslides.',
      overview: 'Landslides are movements of rock, earth, or debris down a slope. They are among the most widespread and dangerous geological hazards in mountainous regions of India, particularly the Himalayas, Western Ghats, and Northeastern states.',
      causes: 'Heavy rainfall saturating slopes, earthquakes, volcanic activity, deforestation, improper construction on slopes, mining, and road cutting in hilly areas. Climate change is increasing landslide frequency.',
      warningSigns: '• Cracks appearing in the ground or pavement\n• Tilting trees, utility poles, or fences\n• Small debris flows or landslides\n• Sudden changes in stream water (color, level, flow)\n• Unusual sounds (rumbling, cracking)\n• Springs or seeps appearing in new locations\n• Doors or windows becoming hard to open',
      beforeDisaster: '• Know landslide-prone areas in your region\n• Plant trees and vegetation to stabilize slopes\n• Build proper drainage systems\n• Avoid building on steep slopes\n• Have an evacuation plan\n• Monitor weather forecasts in hilly areas\n• Know early warning signals from local authorities\n• Keep emergency supplies ready',
      duringDisaster: '• Move away from the path quickly — do not try to outrun a large landslide\n• Curl into a tight ball and protect your head if escape is impossible\n• If indoors, move to the upper floor\n• Stay away from river channels after heavy rain\n• Do not cross bridges or streams in flood conditions\n• Listen for unusual sounds\n• Call for help once safe',
      afterDisaster: '• Stay away from the slide area — more slides may follow\n• Check for injured and trapped persons\n• Report hazards to local authorities\n• Watch for broken utility lines\n• Listen for official all-clear\n• Document damage\n• Replant vegetation as soon as possible to prevent erosion',
      emergencyChecklist: '✅ Emergency food and water\n✅ Flashlight and batteries\n✅ First aid kit\n✅ Sturdy shoes\n✅ Emergency whistle\n✅ Rope for rescue\n✅ Important documents\n✅ Battery-powered radio\n✅ Warm clothing\n✅ Emergency contact numbers',
      safetyTips: '💡 Never build homes at the base of steep slopes or near drainage channels\n💡 Deforestation is a major cause of landslides — plant trees\n💡 Landslides can be triggered long after heavy rain stops\n💡 Know the difference between landslide warnings (watch vs. warning vs. emergency)\n💡 Report suspicious slope cracks to local authorities immediately',
    },
    {
      title: 'Heat Wave Survival',
      disasterType: DisasterType.HEAT_WAVE,
      iconEmoji: '☀️',
      color: '#F59E0B',
      order: 6,
      description: 'Protect yourself and others during extreme heat events.',
      overview: 'A heat wave is a period of excessively hot weather, often accompanied by high humidity. India experiences deadly heat waves regularly, particularly in northern and central India between March and June. Heat waves cause more deaths in India than any other natural disaster.',
      causes: 'Persistent high-pressure systems trap heat near the ground. Lack of rainfall and cloud cover, urban heat island effect, and climate change are making heat waves more frequent and severe. El Niño events can intensify heat waves.',
      warningSigns: '• Meteorological department heat wave alerts\n• Temperature forecasts exceeding 40°C (45°C+ in desert regions)\n• Consecutive days of high temperatures\n• High humidity combined with high temperature\n• Very hot nights with no cooling',
      beforeDisaster: '• Install fans or air conditioning\n• Insulate your home against heat\n• Stock up on water and electrolytes\n• Know cooling centers in your community\n• Check on elderly neighbors and relatives\n• Never leave children or pets in parked cars\n• Plan outdoor activities for early morning or evening',
      duringDisaster: '• Stay indoors during peak heat hours (11 AM - 4 PM)\n• Drink water regularly even if not thirsty (2-3 liters/day)\n• Wear light, loose, light-colored clothing\n• Use fans, cool showers, and wet towels\n• Close blinds and curtains during the day\n• Avoid alcohol, caffeine, and sugary drinks\n• Check on vulnerable people daily\n• Recognize heat-related illness symptoms',
      afterDisaster: '• Continue monitoring for heat-related illnesses\n• Stay hydrated for several days after heat wave\n• Check on neighbors who may have suffered in silence\n• Report heat-related deaths and illnesses to health authorities',
      emergencyChecklist: '✅ Adequate water supply (3+ liters per person per day)\n✅ Oral rehydration salts (ORS)\n✅ Fans or portable air coolers\n✅ Light, loose clothing\n✅ Sunscreen (SPF 30+)\n✅ Cooling towels\n✅ Emergency contact numbers for medical help\n✅ Battery-powered fan\n✅ First aid kit\n✅ Thermometer to monitor body temperature',
      safetyTips: '💡 Heat stroke is life-threatening — call emergency services immediately\n💡 Children, elderly, and outdoor workers are most at risk\n💡 Never leave anyone in a parked car — temperatures can reach 70°C+\n💡 Thirst is a late sign of dehydration — drink regularly\n💡 City residents face higher heat risk due to urban heat islands\n💡 Eat light meals and avoid hot foods during heat waves',
    },
    {
      title: 'Lightning Safety',
      disasterType: DisasterType.LIGHTNING,
      iconEmoji: '⚡',
      color: '#EAB308',
      order: 7,
      description: 'Understand lightning and keep yourself safe during thunderstorms.',
      overview: 'Lightning kills around 2,000 people in India every year, making it one of the deadliest weather phenomena in the country. Lightning is a massive electrostatic discharge between storm clouds and the ground. Understanding lightning safety can prevent needless deaths.',
      causes: 'Lightning forms during thunderstorms when ice particles collide inside clouds, creating electrical charges. The bottom of clouds becomes negatively charged while the ground below becomes positively charged. When the charge difference is large enough, electricity discharges as lightning.',
      warningSigns: '• Thunder (if you can hear it, lightning is nearby)\n• Dark, towering cumulonimbus clouds\n• Sudden wind change\n• Hair standing on end (danger sign — seek shelter immediately)\n• Tingling sensation or metallic taste\n• Skin prickling',
      beforeDisaster: '• Monitor weather forecasts\n• Install lightning rods on buildings\n• Unplug electrical appliances during storms\n• Stay informed about local thunderstorm patterns\n• Know safe locations in your home and school\n• Have a plan for outdoor activities during storms',
      duringDisaster: '• Seek shelter in a substantial building or hard-topped vehicle immediately\n• Avoid tall trees, hilltops, and open fields\n• Stay away from water (pools, rivers, ponds)\n• Stay away from metal objects\n• If caught outside: crouch low on the balls of your feet, minimize contact with ground\n• Stay at least 15 meters from others\n• Avoid caves and overhangs\n• Wait 30 minutes after last thunder before going outside (30-30 Rule)',
      afterDisaster: '• Call for medical help for lightning strike victims\n• It is safe to touch lightning strike victims — they are not electrically charged\n• Perform CPR if trained and victim is unresponsive\n• Report damaged power lines and structures\n• Check for fire caused by lightning',
      emergencyChecklist: '✅ Lightning-safe shelter identified in advance\n✅ Battery-powered radio for weather updates\n✅ Surge protectors for electronics\n✅ First aid knowledge (CPR)\n✅ Emergency contact numbers\n✅ Rubber-soled shoes\n✅ Avoid plumbing fixtures during storm',
      safetyTips: '💡 "When thunder roars, go indoors" — this simple rule saves lives\n💡 The 30-30 rule: if thunder follows lightning in 30 seconds, seek shelter; wait 30 min after last thunder\n💡 A car with a metal roof (not a convertible) is a safe shelter\n💡 Lightning can strike up to 16 km from a storm\n💡 In a group outdoors: spread out to reduce mass casualty risk\n💡 Never shelter under a tree — it\'s one of the most dangerous places',
    },
    {
      title: 'Pandemic Preparedness',
      disasterType: DisasterType.PANDEMIC,
      iconEmoji: '🦠',
      color: '#10B981',
      order: 8,
      description: 'Prepare for and respond to disease outbreaks and pandemics.',
      overview: 'A pandemic is the global spread of a new disease. COVID-19 demonstrated how pandemics can disrupt every aspect of life for years. School communities are particularly vulnerable to disease spread due to close contact. Preparedness saves lives and minimizes disruption.',
      causes: 'Pandemics arise from novel pathogens (viruses, bacteria) to which humans have little or no immunity. They can originate from animal reservoirs (zoonotic diseases), lab accidents, or mutations of existing pathogens. Globalization accelerates disease spread.',
      warningSigns: '• WHO and health ministry alerts about new disease outbreaks\n• Unusual clusters of severe illness in a community\n• Rapid increase in hospitalizations\n• Reports of new, unknown disease symptoms\n• Government health advisories',
      beforeDisaster: '• Stay updated with WHO and health ministry guidelines\n• Maintain vaccination records\n• Stock essential medicines and PPE\n• Learn proper handwashing and respiratory hygiene\n• Know your local health center contacts\n• Have a plan for remote learning\n• Maintain good general health to strengthen immunity',
      duringDisaster: '• Follow government and health authority guidelines\n• Isolate if you have symptoms\n• Wear masks as directed\n• Practice social distancing\n• Wash hands frequently (20 seconds with soap)\n• Avoid touching face\n• Disinfect frequently touched surfaces\n• Seek medical care if symptoms worsen\n• Avoid spreading misinformation',
      afterDisaster: '• Continue health monitoring even after outbreak subsides\n• Complete full vaccination courses\n• Follow step-down protocols issued by authorities\n• Support mental health recovery for affected individuals\n• Assess and restock emergency supplies\n• Review and update pandemic response plans',
      emergencyChecklist: '✅ Face masks (N95/surgical)\n✅ Hand sanitizer (60%+ alcohol)\n✅ Soap and water\n✅ Thermometer\n✅ Pulse oximeter\n✅ Essential medications (30-day supply)\n✅ Disinfectant supplies\n✅ Vaccination certificates\n✅ Emergency contacts (doctor, hospital)\n✅ Remote learning setup\n✅ Food and water supply (2-week supply)',
      safetyTips: '💡 Vaccination is the most effective pandemic prevention tool\n💡 Misinformation spreads faster than viruses — verify information from official sources\n💡 Good ventilation reduces indoor virus transmission significantly\n💡 Mental health impacts of pandemics are as serious as physical illness\n💡 Children can spread disease even without symptoms\n💡 Follow masking guidelines even when vaccinated during active outbreaks',
    },
  ]

  for (const mod of modules) {
    const created = await prisma.module.upsert({
      where: { id: `module-${mod.disasterType.toLowerCase()}` },
      update: {},
      create: {
        id: `module-${mod.disasterType.toLowerCase()}`,
        ...mod,
      },
    })

    // Create quiz for each module
    const quiz = await prisma.quiz.upsert({
      where: { id: `quiz-${mod.disasterType.toLowerCase()}` },
      update: {},
      create: {
        id: `quiz-${mod.disasterType.toLowerCase()}`,
        moduleId: created.id,
        title: `${mod.title} Quiz`,
        description: `Test your knowledge about ${mod.title.toLowerCase()}.`,
        timeLimit: 15,
        passingScore: 70,
      },
    })

    // Seed quiz questions per disaster type
    const questionSets: Record<string, Array<{ text: string; a: string; b: string; c: string; d: string; correct: string; explanation: string }>> = {
      EARTHQUAKE: [
        { text: 'What is the recommended action during an earthquake?', a: 'Run outside immediately', b: 'Drop, Cover, and Hold On', c: 'Stand in a doorway', d: 'Use the elevator to go down', correct: 'B', explanation: 'Drop, Cover, and Hold On is the recommended action. Running outside exposes you to falling debris, and doorframes are no safer than other spots.' },
        { text: 'What scale measures earthquake magnitude?', a: 'Beaufort Scale', b: 'Fujita Scale', c: 'Richter Scale', d: 'Saffir-Simpson Scale', correct: 'C', explanation: 'The Richter Scale (and the more modern Moment Magnitude Scale) measure the energy released by an earthquake.' },
        { text: 'What should you do if trapped under debris?', a: 'Light a match for light', b: 'Move around to find a way out', c: 'Cover mouth and tap on pipes to signal rescuers', d: 'Shout continuously', correct: 'C', explanation: 'Tapping on pipes conserves energy and helps rescuers locate you. Shouting uses energy and you may inhale dust.' },
        { text: 'What are aftershocks?', a: 'Smaller earthquakes after the main one', b: 'Tsunamis following an earthquake', c: 'Sound waves from an earthquake', d: 'Underground explosions', correct: 'A', explanation: 'Aftershocks are smaller earthquakes that follow the main earthquake and can continue for days or weeks.' },
        { text: 'Which area is safest during an earthquake indoors?', a: 'Near windows for escape', b: 'Under a sturdy table', c: 'In the kitchen near the stove', d: 'Near the elevator', correct: 'B', explanation: 'Under a sturdy table or desk protects you from falling objects, which cause most earthquake injuries.' },
      ],
      FLOOD: [
        { text: 'How much moving water can knock a person off their feet?', a: '12 inches', b: '18 inches', c: '6 inches', d: '24 inches', correct: 'C', explanation: 'Just 6 inches (15 cm) of moving floodwater is enough to knock a person off their feet.' },
        { text: 'What does "Turn Around, Don\'t Drown" mean?', a: 'Always swim against the current', b: 'Never drive through flooded roads', c: 'Turn off your car engine when flooding', d: 'Turn your boat around in floods', correct: 'B', explanation: 'More than half of all flood deaths occur in vehicles. Never drive through flooded roads — water depth is difficult to judge and currents are powerful.' },
        { text: 'Is floodwater safe to touch?', a: 'Yes, if it looks clean', b: 'Only if it is clear water', c: 'No — it may contain sewage and chemicals', d: 'Yes, if it has been standing for hours', correct: 'C', explanation: 'Floodwater is contaminated with sewage, chemicals, dead animals, and sharp debris. Avoid all contact.' },
        { text: 'What is a flash flood?', a: 'A slow-rising flood over several days', b: 'A flood that occurs within 6 hours of heavy rainfall', c: 'Flooding only in coastal areas', d: 'A flood caused by dam overflow', correct: 'B', explanation: 'Flash floods occur rapidly, usually within 6 hours of heavy rainfall, and are especially dangerous because they offer little warning.' },
        { text: 'What should you do if trapped in your car during a flood?', a: 'Stay in the car — it will float', b: 'Roll down the window and escape when water pressure equalizes', c: 'Call for help and wait', d: 'Drive faster to escape', correct: 'B', explanation: 'If your car is sinking, wait for water pressure to equalize (when water reaches your neck), then open the door or break the window to escape.' },
      ],
      FIRE: [
        { text: 'What is the first thing to do when you discover a fire?', a: 'Collect your valuables', b: 'Activate the fire alarm and call emergency services', c: 'Try to extinguish the fire yourself', d: 'Open windows to ventilate', correct: 'B', explanation: 'Activating the alarm warns others and calling 101 gets professional help. Your safety and the safety of others is the priority.' },
        { text: 'How should you check if a door is safe to open during a fire?', a: 'Open it quickly to check', b: 'Feel it with the back of your hand', c: 'Look through the keyhole', d: 'Bang on it with your fist', correct: 'B', explanation: 'Use the back of your hand to feel the door, door handle, and surrounding walls. If hot, use another exit.' },
        { text: 'How should you move through a smoke-filled room?', a: 'Run as fast as possible', b: 'Crawl low on your hands and knees', c: 'Stay upright to avoid floor debris', d: 'Hold your breath and walk slowly', correct: 'B', explanation: 'Smoke rises. Clean air is closer to the floor. Crawling keeps you below the smoke and toxic gases.' },
        { text: 'What should you do if your clothes catch fire?', a: 'Run to get help', b: 'Remove clothing immediately', c: 'Stop, Drop, and Roll', d: 'Jump into water immediately', correct: 'C', explanation: 'Stop, Drop, and Roll smothers the fire. Running fans the flames and makes them burn faster.' },
        { text: 'What is PASS when using a fire extinguisher?', a: 'Pull, Aim, Squeeze, Sweep', b: 'Point, Angle, Squeeze, Spray', c: 'Pin, Aim, Spread, Smother', d: 'Push, Activate, Spray, Step', correct: 'A', explanation: 'PASS: Pull the pin, Aim at the base of fire, Squeeze the handle, Sweep side to side at the base.' },
      ],
      CYCLONE: [
        { text: 'What is the most dangerous part of a cyclone?', a: 'The eye of the cyclone', b: 'The eyewall (area surrounding the eye)', c: 'The outer rainbands', d: 'The feeder bands', correct: 'B', explanation: 'The eyewall is the most dangerous part, with the strongest winds and heaviest rainfall. The eye itself appears calm but is surrounded by the eyewall.' },
        { text: 'What should you do during the eye of a cyclone?', a: 'Go outside to assess damage', b: 'Start cleaning up debris', c: 'Stay indoors — the storm is not over', d: 'Open windows to equalize pressure', correct: 'C', explanation: 'The eye of a cyclone can appear deceptively calm. The dangerous eyewall will arrive again shortly after. Stay indoors.' },
        { text: 'What is a storm surge?', a: 'Sudden increase in wind speed', b: 'Abnormal rise in sea level due to a storm', c: 'Heavy rainfall during a cyclone', d: 'Electric storms associated with cyclones', correct: 'B', explanation: 'A storm surge is an abnormal rise in sea level, sometimes over 6 meters, caused by cyclone winds and low pressure. It is the deadliest aspect of cyclones.' },
        { text: 'What color code indicates the highest cyclone alert level in India?', a: 'Yellow', b: 'Orange', c: 'Red', d: 'Black', correct: 'C', explanation: 'IMD uses Yellow (be alert), Orange (be prepared), and Red (take action) warning codes. Red indicates the most severe cyclone threat.' },
        { text: 'Where should you shelter during a cyclone if evacuation is not possible?', a: 'Under a tree', b: 'In a basement', c: 'In the strongest interior room on the ground floor', d: 'Near windows to monitor the storm', correct: 'C', explanation: 'The strongest interior room away from windows provides the best protection. In coastal areas, ground floors may flood, so upper floors may be safer from storm surge if the structure is strong.' },
      ],
      LANDSLIDE: [
        { text: 'What is a common early warning sign of a landslide?', a: 'Sudden clear weather', b: 'Cracks appearing in the ground near slopes', c: 'Decrease in river water level', d: 'Quiet conditions in a hilly area', correct: 'B', explanation: 'Ground cracks near slopes, tilting trees, and changes in water flow are early warning signs of a potential landslide.' },
        { text: 'What is the best thing to do if you see a landslide approaching?', a: 'Try to outrun it', b: 'Move to higher ground perpendicular to the slide path', c: 'Lie flat to avoid being hit', d: 'Take shelter behind a large tree', correct: 'B', explanation: 'Move quickly to higher ground perpendicular to the slide path. Landslides can travel faster than 100 km/h making them impossible to outrun.' },
        { text: 'Which activity significantly increases landslide risk?', a: 'Planting trees on slopes', b: 'Deforestation', c: 'Building proper drainage', d: 'Terracing slopes', correct: 'B', explanation: 'Deforestation removes tree roots that hold soil together, dramatically increasing landslide risk during rainfall.' },
        { text: 'What sound might indicate an imminent landslide?', a: 'Silence', b: 'Thunder and lightning', c: 'Rumbling or cracking sounds from a hillside', d: 'High-pitched whistling wind', correct: 'C', explanation: 'Rumbling or cracking sounds from a hillside can indicate soil and rock movement and may precede a landslide.' },
        { text: 'When is landslide risk highest?', a: 'During dry, sunny weather', b: 'During winter frost', c: 'During and after heavy or prolonged rainfall', d: 'At high altitude only', correct: 'C', explanation: 'Landslide risk is highest during and after heavy or prolonged rainfall, which saturates soil and reduces slope stability.' },
      ],
      HEAT_WAVE: [
        { text: 'What is the medical emergency caused by extreme overheating?', a: 'Hypothermia', b: 'Heat stroke', c: 'Heat exhaustion', d: 'Hyperthermia', correct: 'B', explanation: 'Heat stroke is a life-threatening emergency where body temperature exceeds 40°C and the body can no longer regulate temperature. It requires immediate emergency care.' },
        { text: 'What is the best way to stay hydrated during a heat wave?', a: 'Drink cold fizzy drinks', b: 'Drink alcohol to stay cool', c: 'Drink water and electrolyte solutions regularly', d: 'Wait until you feel thirsty', correct: 'C', explanation: 'Drink water and ORS regularly throughout the day. Thirst is a late sign of dehydration. Avoid alcohol and caffeine which increase dehydration.' },
        { text: 'Who is most vulnerable during a heat wave?', a: 'Young adults aged 20-30', b: 'Teenagers', c: 'Elderly people, young children, and outdoor workers', d: 'People who exercise regularly', correct: 'C', explanation: 'Elderly people, young children, outdoor workers, and people with chronic illnesses are most vulnerable to heat-related illness.' },
        { text: 'What should you do to keep your home cool during extreme heat?', a: 'Keep windows open all day', b: 'Close blinds and curtains during the day, open windows at night', c: 'Use heavy curtains that absorb heat', d: 'Turn off fans as they circulate hot air', correct: 'B', explanation: 'Close blinds during the day to block solar heat. Open windows at night when outdoor air cools. Fans help but only if the air is cooler than body temperature.' },
        { text: 'What is the minimum daily water intake recommended during extreme heat?', a: '1 liter', b: '1.5 liters', c: '2-3 liters or more', d: '5 liters', correct: 'C', explanation: 'During extreme heat, adults should drink 2-3 liters of water daily, more if engaging in physical activity. Children and elderly may need reminders to drink.' },
      ],
      LIGHTNING: [
        { text: 'What is the 30-30 rule for lightning safety?', a: 'Seek shelter if lightning is within 30 km; wait 30 hours after the storm', b: 'Seek shelter if thunder follows lightning within 30 seconds; wait 30 min after last thunder', c: 'Count 30 seconds between lightning and thunder to determine distance', d: 'Call emergency services after 30 lightning strikes in 30 minutes', correct: 'B', explanation: 'If thunder follows lightning in 30 seconds or less, the storm is within 10 km. Seek shelter immediately. Wait 30 minutes after the last thunder before going outside.' },
        { text: 'What is the safest place to be during a lightning storm?', a: 'Under a tall tree', b: 'In an open field', c: 'Inside a substantial building or hard-topped vehicle', d: 'In a cave or overhanging rock', correct: 'C', explanation: 'A substantial building with plumbing and wiring to ground lightning is safest. A hard-topped metal vehicle (not a convertible) also provides protection.' },
        { text: 'Is it safe to touch a lightning strike victim?', a: 'No — they will still carry a charge', b: 'Yes — the human body does not store electrical charge', c: 'Only with rubber gloves', d: 'Only after 30 minutes', correct: 'B', explanation: 'It is completely safe to touch lightning strike victims. The human body does not hold an electrical charge. Call for help and provide first aid immediately.' },
        { text: 'What happens if you feel your hair standing up during a thunderstorm?', a: 'The storm is moving away', b: 'Static electricity is normal — keep walking', c: 'You are about to be struck — crouch immediately', d: 'A tornado is approaching', correct: 'C', explanation: 'Hair standing up indicates a strong electric field and that you may be about to be struck. Immediately crouch low on the balls of your feet, minimize ground contact, cover ears.' },
        { text: 'Which of these is the MOST dangerous place to be during a lightning storm?', a: 'Inside a concrete building', b: 'Under a tall isolated tree', c: 'Inside a hard-topped vehicle', d: 'In a low-lying ditch', correct: 'B', explanation: 'Tall isolated trees are prime lightning targets. Being near a struck tree can cause death through side flash, ground current, or falling wood.' },
      ],
      PANDEMIC: [
        { text: 'What is the most effective individual action to prevent disease spread?', a: 'Taking vitamin C supplements', b: 'Wearing a mask only when sick', c: 'Frequent handwashing with soap for at least 20 seconds', d: 'Avoiding going outside completely', correct: 'C', explanation: 'Frequent, proper handwashing (20 seconds with soap) is one of the most effective ways to prevent the spread of respiratory and gastrointestinal diseases.' },
        { text: 'What does it mean when WHO declares a "pandemic"?', a: 'A disease has killed more than 1 million people', b: 'A disease is spreading globally across multiple countries and continents', c: 'A disease is spreading within a single country', d: 'A new disease has been discovered', correct: 'B', explanation: 'A pandemic is declared when a new disease spreads globally across multiple countries and continents, affecting a large proportion of the population.' },
        { text: 'Why is vaccination important during a pandemic?', a: 'It eliminates all risk of infection', b: 'It reduces severity of illness and builds community immunity (herd immunity)', c: 'It is only beneficial for children', d: 'It prevents all long-term effects of diseases', correct: 'B', explanation: 'Vaccines reduce the risk of severe illness, hospitalization, and death. When enough people are vaccinated, it creates herd immunity that protects vulnerable people who cannot be vaccinated.' },
        { text: 'What is quarantine?', a: 'Isolation of confirmed sick individuals', b: 'Separation of people exposed to disease who may or may not be infected', c: 'A treatment for infectious diseases', d: 'A type of protective equipment', correct: 'B', explanation: 'Quarantine separates people who were potentially exposed to prevent possible spread. Isolation specifically separates confirmed cases. Both are important pandemic tools.' },
        { text: 'What should you do if you develop symptoms during a pandemic?', a: 'Go to work to complete important tasks', b: 'Visit a crowded clinic immediately', c: 'Self-isolate and contact health authorities for guidance', d: 'Take antibiotics immediately', correct: 'C', explanation: 'Self-isolate to prevent spreading disease and contact health authorities (call, don\'t walk in) for testing and treatment guidance. Antibiotics don\'t work against viruses.' },
      ],
    }

    const questions = questionSets[mod.disasterType] || []
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i]
      await prisma.question.upsert({
        where: { id: `q-${mod.disasterType.toLowerCase()}-${i + 1}` },
        update: {},
        create: {
          id: `q-${mod.disasterType.toLowerCase()}-${i + 1}`,
          quizId: quiz.id,
          text: q.text,
          optionA: q.a,
          optionB: q.b,
          optionC: q.c,
          optionD: q.d,
          correctOption: q.correct,
          explanation: q.explanation,
          order: i + 1,
        },
      })
    }
  }

  // ─── Simulation Scenarios ──────────────────────────────────────────────────
  const scenarios = [
    {
      id: 'sim-earthquake',
      disasterType: DisasterType.EARTHQUAKE,
      title: 'Earthquake Simulation',
      description: 'You are in a classroom when an earthquake strikes. Make the right decisions to stay safe.',
      steps: [
        {
          order: 1,
          situation: 'You are sitting in your classroom when the floor starts shaking violently. Books are falling off shelves. What do you do?',
          optionA: 'Run for the door immediately to get outside',
          optionB: 'Drop to your knees, take cover under your desk, and hold on',
          optionC: 'Stand in the doorframe for protection',
          correctOption: 'B',
          explanationA: 'Wrong! Running during shaking is dangerous. You can trip, be hit by falling objects, or be crushed in a stampede. Stay where you are.',
          explanationB: 'Correct! Drop, Cover, and Hold On is the recommended action. Under a sturdy desk, you are protected from falling debris while the shaking continues.',
          explanationC: 'Wrong! The doorframe myth is outdated. Modern buildings have frames no stronger than other structural parts. Under a desk is much safer.',
        },
        {
          order: 2,
          situation: 'The shaking has stopped. You are uninjured but there is dust and some ceiling tiles have fallen. What is your next action?',
          optionA: 'Immediately run outside as fast as possible',
          optionB: 'Stay at your desk and wait for your teacher\'s instructions',
          optionC: 'Text your parents to let them know you\'re safe',
          correctOption: 'B',
          explanationA: 'Wait! Rushing outside may expose you to falling debris, damaged structures, or downed power lines. Follow your teacher\'s calm instructions.',
          explanationB: 'Correct! Stay calm and wait for your teacher\'s instructions. A coordinated evacuation is much safer than everyone running at once.',
          explanationC: 'Not yet! Your immediate safety takes priority. Personal communication can wait until you are at a safe assembly point.',
        },
        {
          order: 3,
          situation: 'Your teacher instructs everyone to evacuate. You smell gas in the corridor. What do you do?',
          optionA: 'Turn the light switch on to see better',
          optionB: 'Alert your teacher immediately and cover your mouth while evacuating quickly',
          optionC: 'Stop to look for the gas leak',
          correctOption: 'B',
          explanationA: 'Dangerous! Any electrical spark (including light switches) can ignite leaking gas and cause an explosion. Never operate switches near a gas leak.',
          explanationB: 'Correct! Alert your teacher and evacuate quickly. Cover your mouth to reduce gas inhalation. The building must be evacuated and authorities called immediately.',
          explanationC: 'Wrong! Do not try to locate a gas leak yourself. Evacuate immediately and let trained emergency personnel handle it.',
        },
      ],
    },
    {
      id: 'sim-flood',
      disasterType: DisasterType.FLOOD,
      title: 'Flash Flood Simulation',
      description: 'Flash flooding is threatening your area. Navigate these critical decisions.',
      steps: [
        {
          order: 1,
          situation: 'You are walking home from school when water suddenly starts rushing down the street. The water is moving fast and is about 6 inches deep. What do you do?',
          optionA: 'Try to walk through the water — it is not very deep',
          optionB: 'Move immediately to higher ground or a nearby building',
          optionC: 'Wait and see if the water rises further before deciding',
          correctOption: 'B',
          explanationA: 'Dangerous! Just 6 inches of moving water can knock you off your feet. Moving floodwater is extremely powerful and may contain hidden hazards.',
          explanationB: 'Correct! Immediately move to higher ground or enter a nearby solid building. Flash floods can rise in seconds — every moment counts.',
          explanationC: 'Wrong! Do not wait. Flash floods can rise rapidly in minutes. Act immediately and move to higher ground.',
        },
        {
          order: 2,
          situation: 'You reach your home. The ground floor is starting to flood. What should you do?',
          optionA: 'Try to drive the family car to safer ground',
          optionB: 'Move to an upper floor and wait for emergency services',
          optionC: 'Go into the basement to retrieve important items',
          correctOption: 'B',
          explanationA: 'Dangerous! Most flood deaths occur in vehicles. Floodwater can sweep a car off the road with just 2 feet of water. Do not drive into floodwater.',
          explanationB: 'Correct! Move to an upper floor. Signal for help from upper windows. Wait for emergency services — do not attempt to swim or wade to safety.',
          explanationC: 'Extremely dangerous! Basements flood rapidly and people can become trapped and drown. Never enter a basement during flooding.',
        },
        {
          order: 3,
          situation: 'The flooding has receded and authorities say it is safe to return. You see floodwater still standing in your street. What do you do?',
          optionA: 'Wade through to assess the damage to your home',
          optionB: 'Wait for the water to fully recede and disinfect thoroughly before entering',
          optionC: 'Drink from the tap — the water company will have fixed supplies',
          correctOption: 'B',
          explanationA: 'Risky! Standing floodwater is still contaminated with sewage, chemicals, and hidden hazards. Wait for official clearance.',
          explanationB: 'Correct! Wait for standing water to fully recede. When entering, wear protective clothing. Disinfect all surfaces. Boil water until officially declared safe.',
          explanationC: 'Wrong! Do not assume tap water is safe after flooding. Boil water or use bottled water until health authorities declare the supply safe.',
        },
      ],
    },
    {
      id: 'sim-fire',
      disasterType: DisasterType.FIRE,
      title: 'School Fire Simulation',
      description: 'A fire breaks out at school. Make the right choices to ensure your safety.',
      steps: [
        {
          order: 1,
          situation: 'You smell smoke in the corridor and see fire coming from the school canteen. What is your first action?',
          optionA: 'Run to your locker to get your bag and valuables',
          optionB: 'Pull the nearest fire alarm and shout "Fire!" to alert others',
          optionC: 'Try to put out the fire with a bucket of water from the bathroom',
          correctOption: 'B',
          explanationA: 'Wrong! Never go back for belongings in a fire. You have only minutes — possibly less — to escape safely. No possession is worth your life.',
          explanationB: 'Correct! Alerting others immediately by activating the alarm saves lives. Then evacuate following your school\'s fire escape plan.',
          explanationC: 'Dangerous! A canteen fire may involve cooking oil or gas. Water on grease fires causes violent flare-ups. Only trained staff with the right extinguisher should fight fires.',
        },
        {
          order: 2,
          situation: 'You are evacuating and need to go through a smoke-filled corridor to reach the exit. What do you do?',
          optionA: 'Hold your breath and run through the corridor upright',
          optionB: 'Crawl low to the ground below the smoke and move toward the exit',
          optionC: 'Wait in your classroom with the door open for rescue',
          correctOption: 'B',
          explanationA: 'Wrong! Smoke rises and is thickest at face level. Running upright exposes you to the most toxic smoke. Clean air is near the floor.',
          explanationB: 'Correct! Crawl low below the smoke. Cover your mouth with a cloth if available. Breathe slowly and move toward the exit.',
          explanationC: 'Wrong! An open door allows smoke and fire to enter your classroom faster. If you must shelter in a room, close the door and seal gaps with cloth.',
        },
        {
          order: 3,
          situation: 'You reach a closed door in the evacuation route. What do you do before opening it?',
          optionA: 'Open it quickly to minimize exposure to any fire on the other side',
          optionB: 'Feel the door and handle with the back of your hand',
          optionC: 'Break the door down to check if there is fire on the other side',
          correctOption: 'B',
          explanationA: 'Dangerous! Opening a hot door rapidly can cause a "backdraft" — an explosive rush of fire. Always check the door temperature first.',
          explanationB: 'Correct! Feel the door and handle with the back of your hand. If hot, do not open it — use another exit or shelter in place.',
          explanationC: 'Wrong! Breaking the door is unnecessary and potentially dangerous. The back-of-hand test tells you if it is safe to open.',
        },
      ],
    },
    {
      id: 'sim-cyclone',
      disasterType: DisasterType.CYCLONE,
      title: 'Cyclone Simulation',
      description: 'A severe cyclone is approaching your coastal town. Make the right decisions.',
      steps: [
        {
          order: 1,
          situation: 'IMD issues a Red alert for your area — a Very Severe Cyclonic Storm will make landfall in 12 hours. Authorities issue an evacuation advisory for coastal areas. You live 500m from the beach. What do you do?',
          optionA: 'Stay home — your house is concrete and you have survived storms before',
          optionB: 'Evacuate immediately to the designated cyclone shelter',
          optionC: 'Wait to see if the cyclone actually hits before deciding',
          correctOption: 'B',
          explanationA: 'Wrong! Even concrete structures can fail in a very severe cyclone. The storm surge alone can submerge coastal areas completely. Evacuate when ordered.',
          explanationB: 'Correct! Follow evacuation orders immediately. 12 hours gives you time to evacuate safely. Waiting makes evacuation routes dangerous.',
          explanationC: 'Wrong! By the time the cyclone is confirmed to hit, it may be too late to evacuate safely. Follow Red alert evacuation orders without delay.',
        },
        {
          order: 2,
          situation: 'The cyclone has struck. You are in a cyclone shelter. Suddenly, the wind stops and it becomes eerily calm. What does this mean and what do you do?',
          optionA: 'The cyclone has passed — it is safe to go outside and check on your home',
          optionB: 'You are in the eye of the cyclone — stay inside and wait, the storm will intensify again',
          optionC: 'The shelter is no longer safe — move to another location',
          correctOption: 'B',
          explanationA: 'Extremely dangerous! The eye of a cyclone is deceptively calm. The violent eyewall will arrive from the opposite direction within minutes. Going outside could be fatal.',
          explanationB: 'Correct! The eye of a cyclone brings temporary calm. Stay inside — the eyewall will arrive from the opposite direction with the full fury of the storm.',
          explanationC: 'Wrong! The cyclone shelter is the safest place. Moving during the eye of a storm is extremely dangerous — you could be caught when the eyewall arrives.',
        },
        {
          order: 3,
          situation: 'After the cyclone, you see downed power lines near your home. You want to inspect damage. What do you do?',
          optionA: 'Step over the power lines carefully to reach your home',
          optionB: 'Stay far away from power lines and report them to electricity authorities',
          optionC: 'Move the power lines aside with a wooden stick',
          correctOption: 'B',
          explanationA: 'Extremely dangerous! Downed power lines may still be energized and can electrocute instantly. The ground around them may also be electrified.',
          explanationB: 'Correct! Stay at least 10 meters from downed power lines. Call the electricity authority. Wait for officials to declare areas safe before entering.',
          explanationC: 'Dangerous! Wooden sticks are not safe insulators for high-voltage lines. Only trained utility workers with proper equipment can handle downed power lines.',
        },
      ],
    },
    {
      id: 'sim-landslide',
      disasterType: DisasterType.LANDSLIDE,
      title: 'Landslide Simulation',
      description: 'Heavy monsoon rains are triggering landslide warnings in your hilly town.',
      steps: [
        {
          order: 1,
          situation: 'After three days of heavy rain, you notice large cracks appearing in the road near the hill above your school. What action do you take?',
          optionA: 'Continue as normal — cracks in roads are common during rain',
          optionB: 'Report the cracks to your teacher and local authorities immediately',
          optionC: 'Go closer to investigate the cracks more carefully',
          correctOption: 'B',
          explanationA: 'Wrong! Cracks in the ground near slopes are serious warning signs of potential landslide. They must be reported and the area must be evacuated.',
          explanationB: 'Correct! Ground cracks are an early warning sign. Report immediately so authorities can assess the risk and take preventive action.',
          explanationC: 'Dangerous! Going closer to a potentially unstable slope increases your risk. Stay away and report from a safe distance.',
        },
        {
          order: 2,
          situation: 'You hear a loud rumbling from the hillside and see a landslide beginning to move toward your path. What do you do?',
          optionA: 'Run away down the path in the same direction as the slide',
          optionB: 'Move quickly to higher ground perpendicular (sideways) to the slide\'s path',
          optionC: 'Take shelter behind a large tree',
          correctOption: 'B',
          explanationA: 'Wrong! Running in the direction of a landslide means it can overtake you. You cannot outrun a fast-moving landslide on a downhill path.',
          explanationB: 'Correct! Move perpendicular to the slide path — sideways across the hill. This gets you out of the slide\'s trajectory quickly.',
          explanationC: 'Wrong! Trees in a landslide zone are uprooted and can become projectiles. A tree is not a safe shelter from a landslide.',
        },
        {
          order: 3,
          situation: 'The landslide has stopped. You hear a person calling for help under the debris. What do you do?',
          optionA: 'Immediately start digging with your hands to rescue them',
          optionB: 'Call emergency services and keep the victim calm while professionals mobilize',
          optionC: 'Look for others to form a large digging team first',
          correctOption: 'B',
          explanationA: 'Be careful! Disturbing debris without proper support can cause further collapse. Call emergency services first — they have the right equipment.',
          explanationB: 'Correct! Call emergency rescue services immediately. Keep talking to the victim to locate them and keep them calm. Secondary landslides can occur — be aware of your surroundings.',
          explanationC: 'Not immediately — call emergency services first while keeping the victim calm. Professionals should lead the rescue with proper equipment.',
        },
      ],
    },
    {
      id: 'sim-heatwave',
      disasterType: DisasterType.HEAT_WAVE,
      title: 'Heat Wave Simulation',
      description: 'A severe heat wave has gripped your city with temperatures exceeding 45°C.',
      steps: [
        {
          order: 1,
          situation: 'It is 2 PM and 46°C outside. Your friend wants to play cricket in the open ground. What do you do?',
          optionA: 'Play for just 30 minutes — it will be fine',
          optionB: 'Decline and suggest indoor activities or going out in the early morning or evening',
          optionC: 'Play but drink water every hour',
          correctOption: 'B',
          explanationA: 'Wrong! Even 30 minutes of physical activity at 46°C can lead to heat exhaustion or heat stroke, which is life-threatening.',
          explanationB: 'Correct! During heat waves, avoid outdoor physical activity between 11 AM and 4 PM. Reschedule to early morning or after sunset.',
          explanationC: 'Still risky! The heat is dangerous regardless of water intake during extreme temperatures. Avoid outdoor activity during peak heat hours.',
        },
        {
          order: 2,
          situation: 'While walking to the bus stop, your friend suddenly stops, says they feel dizzy and nauseous, and their skin is hot and red but they are not sweating. What is happening and what do you do?',
          optionA: 'Give them cold water and ask them to rest on a bench in the sun',
          optionB: 'Call emergency services — this is likely heat stroke, a medical emergency. Move them to shade and cool them immediately.',
          optionC: 'Tell them to drink a cold soft drink and continue walking to get home',
          correctOption: 'B',
          explanationA: 'Wrong! They should be moved to shade (not kept in sun) and emergency services called. Hot, dry skin + dizziness = heat stroke warning signs.',
          explanationB: 'Correct! Hot, dry skin, dizziness, and confusion are signs of heat stroke — a medical emergency. Call 108 immediately. Move to shade, cool the body with water and fanning while waiting for help.',
          explanationC: 'Dangerous! Your friend is showing signs of heat stroke, not mild dehydration. Continuing activity and delaying medical care can be fatal. Call emergency services.',
        },
        {
          order: 3,
          situation: 'You notice an elderly neighbor has not been seen for two days during the heat wave. Their windows are closed. What do you do?',
          optionA: 'Assume they are on vacation and do not worry',
          optionB: 'Knock on their door and check on them — alert adults or call 108 if there is no response',
          optionC: 'Wait another day to see if they appear',
          correctOption: 'B',
          explanationA: 'Wrong! Elderly people are highly vulnerable to heat waves. Isolation and closed windows during extreme heat is a warning sign.',
          explanationB: 'Correct! Check on elderly neighbors during heat waves. Closed windows and no activity is a warning sign. If no response, alert adults or authorities. This can save a life.',
          explanationC: 'Wrong! Heat stroke can kill within hours. Do not delay — check on vulnerable neighbors immediately during a heat emergency.',
        },
      ],
    },
    {
      id: 'sim-lightning',
      disasterType: DisasterType.LIGHTNING,
      title: 'Lightning Storm Simulation',
      description: 'You are outdoors when a severe thunderstorm develops. Make the right safety choices.',
      steps: [
        {
          order: 1,
          situation: 'You are on a school picnic in an open field. Thunder rumbles and you count 15 seconds between the lightning flash and the thunder. What do you do?',
          optionA: 'Continue the picnic — the storm is far away',
          optionB: 'Immediately seek shelter in the nearest substantial building',
          optionC: 'Stand under the large tree at the edge of the field for protection',
          correctOption: 'B',
          explanationA: 'Wrong! Thunder in 15 seconds means lightning is about 5 km away and approaching. Seek shelter immediately — do not wait.',
          explanationB: 'Correct! 15 seconds between lightning and thunder = 5 km distance. By the 30-30 rule, seek shelter immediately. Lightning can strike from kilometers away.',
          explanationC: 'Extremely dangerous! Tall isolated trees are prime lightning targets. Being near a struck tree causes many lightning deaths. Never shelter under trees.',
        },
        {
          order: 2,
          situation: 'There is no building nearby. The lightning is getting very close. Your hair starts standing on end. What do you do?',
          optionA: 'Lie flat on the ground to present the lowest profile',
          optionB: 'Crouch low on the balls of your feet, feet together, hands over ears, head down',
          optionC: 'Run to the trees at the edge of the field',
          correctOption: 'B',
          explanationA: 'Wrong! Lying flat increases ground contact and increases the risk of ground current — electricity flowing through the ground from a nearby strike.',
          explanationB: 'Correct! Hair standing up means lightning strike is imminent. Crouch on the balls of your feet (minimize ground contact), feet together, head down, ears covered to protect from thunder blast.',
          explanationC: 'Dangerous! Trees are lightning attractors. Running to trees during a lightning emergency dramatically increases your risk.',
        },
        {
          order: 3,
          situation: 'A classmate has been struck by lightning and is unconscious. Is it safe to help them?',
          optionA: 'No — touching them is dangerous as they still carry an electric charge',
          optionB: 'Yes — it is completely safe. Call emergency services and start CPR if trained.',
          optionC: 'Only touch them with rubber gloves',
          correctOption: 'B',
          explanationA: 'Wrong! Lightning strike victims do not retain an electrical charge. It is completely safe to touch and help them immediately.',
          explanationB: 'Correct! Lightning victims carry no charge. Call emergency services immediately. If the person is not breathing and has no pulse, begin CPR if trained. Every second counts.',
          explanationC: 'Wrong! Rubber gloves are not needed. Lightning victims are safe to touch. Do not delay first aid.',
        },
      ],
    },
    {
      id: 'sim-pandemic',
      disasterType: DisasterType.PANDEMIC,
      title: 'Pandemic Response Simulation',
      description: 'A new respiratory illness is spreading rapidly. Navigate these critical decisions.',
      steps: [
        {
          order: 1,
          situation: 'You wake up with fever, cough, and body aches. Your class has an important exam today. What do you do?',
          optionA: 'Go to school wearing a mask — you do not want to miss the exam',
          optionB: 'Stay home, inform your school, and contact a doctor for guidance',
          optionC: 'Take paracetamol and go to school — symptoms will improve',
          correctOption: 'B',
          explanationA: 'Wrong! Going to school with symptoms risks spreading disease to classmates, teachers, and their families. The exam can be rescheduled.',
          explanationB: 'Correct! Self-isolate immediately. Inform your school so they can arrange alternatives. Contact a doctor — especially important during an outbreak. Do not prioritize activities over public health.',
          explanationC: 'Wrong! Medication may reduce symptoms temporarily, but you remain contagious. Going to school spreads the disease. Stay home.',
        },
        {
          order: 2,
          situation: 'You see a social media post claiming a "miracle cure" for the pandemic illness that authorities are "hiding." What do you do?',
          optionA: 'Share it immediately to help others',
          optionB: 'Try the cure — there is nothing to lose',
          optionC: 'Verify the information from official health sources (WHO, health ministry) before acting or sharing',
          correctOption: 'C',
          explanationA: 'Wrong! Sharing unverified health information can cause serious harm. Misinformation spreads faster than disease and can lead people to avoid real treatment.',
          explanationB: 'Dangerous! Unverified "cures" can be harmful or toxic. Some pandemic misinformation has led to poisoning deaths.',
          explanationC: 'Correct! Always verify health information from official sources: WHO, government health ministry, or registered medical professionals. Never share health misinformation.',
        },
        {
          order: 3,
          situation: 'The pandemic is easing, authorities are lifting restrictions. Your friend says they will stop all precautions immediately. What do you advise?',
          optionA: 'Agree — the pandemic is over and precautions are no longer needed',
          optionB: 'Follow the step-down guidance from health authorities gradually rather than stopping all at once',
          optionC: 'Maintain all restrictions indefinitely regardless of official guidance',
          correctOption: 'B',
          explanationA: 'Wrong! Lifting all precautions at once can trigger a resurgence. Most pandemics have multiple waves, especially when restrictions are removed too quickly.',
          explanationB: 'Correct! Follow health authorities\' step-down protocols. Gradually reduce precautions as guided. Continue monitoring for new variants or waves.',
          explanationC: 'Also not ideal! Maintaining all restrictions indefinitely when not needed has social, mental health, and economic costs. Follow official guidance on relaxing restrictions safely.',
        },
      ],
    },
  ]

  for (const scenario of scenarios) {
    const { steps, ...scenarioData } = scenario
    const created = await prisma.simulationScenario.upsert({
      where: { id: scenario.id },
      update: {},
      create: scenarioData,
    })

    for (const step of steps) {
      await prisma.simulationStep.upsert({
        where: { id: `${scenario.id}-step-${step.order}` },
        update: {},
        create: {
          id: `${scenario.id}-step-${step.order}`,
          scenarioId: created.id,
          ...step,
        },
      })
    }
  }

  // ─── Badges ───────────────────────────────────────────────────────────────
  const badges = [
    { id: 'badge-first-quiz', name: 'First Step', description: 'Complete your first quiz', iconEmoji: '🎯', color: '#3B82F6', criteria: 'Complete 1 quiz', xpReward: 50 },
    { id: 'badge-perfect-score', name: 'Perfect Score', description: 'Score 100% on any quiz', iconEmoji: '⭐', color: '#F59E0B', criteria: 'Score 100% on a quiz', xpReward: 150 },
    { id: 'badge-5-modules', name: 'Knowledge Seeker', description: 'Complete 5 learning modules', iconEmoji: '📚', color: '#8B5CF6', criteria: 'Complete 5 modules', xpReward: 200 },
    { id: 'badge-all-modules', name: 'Disaster Expert', description: 'Complete all 8 disaster modules', iconEmoji: '🏆', color: '#EF4444', criteria: 'Complete all modules', xpReward: 500 },
    { id: 'badge-first-drill', name: 'Drill Ready', description: 'Complete your first virtual drill', iconEmoji: '🚨', color: '#F97316', criteria: 'Complete 1 simulation', xpReward: 75 },
    { id: 'badge-streak-7', name: 'Week Warrior', description: 'Maintain a 7-day learning streak', iconEmoji: '🔥', color: '#EF4444', criteria: '7-day streak', xpReward: 100 },
    { id: 'badge-all-drills', name: 'Simulation Master', description: 'Complete all 8 disaster simulations', iconEmoji: '🎖️', color: '#10B981', criteria: 'Complete all simulations', xpReward: 400 },
    { id: 'badge-help-others', name: 'Community Hero', description: 'Rank in the top 10 on the leaderboard', iconEmoji: '🦸', color: '#6366F1', criteria: 'Top 10 leaderboard', xpReward: 300 },
  ]

  for (const badge of badges) {
    await prisma.badge.upsert({ where: { id: badge.id }, update: {}, create: badge })
  }

  // ─── Achievements ─────────────────────────────────────────────────────────
  const achievements = [
    { id: 'ach-prepared', name: 'Prepared Citizen', description: 'Complete at least one module from each disaster category', iconEmoji: '🏅', xpReward: 300, condition: 'all_disasters_started' },
    { id: 'ach-lifesaver', name: 'Lifesaver', description: 'Pass all 8 disaster quizzes with at least 70%', iconEmoji: '💪', xpReward: 500, condition: 'all_quizzes_passed' },
    { id: 'ach-speed-learner', name: 'Speed Learner', description: 'Complete a quiz in under 5 minutes with a passing score', iconEmoji: '⚡', xpReward: 150, condition: 'fast_quiz_completion' },
    { id: 'ach-level-10', name: 'Level 10 Hero', description: 'Reach Level 10 through XP accumulation', iconEmoji: '🌟', xpReward: 400, condition: 'reach_level_10' },
  ]

  for (const ach of achievements) {
    await prisma.achievement.upsert({ where: { id: ach.id }, update: {}, create: ach })
  }

  // ─── Emergency Contacts ───────────────────────────────────────────────────
  const contacts = [
    { name: 'National Emergency', role: 'Emergency Services', phone: '112', isNational: true, priority: 1 },
    { name: 'Police', role: 'Police Emergency', phone: '100', isNational: true, priority: 2 },
    { name: 'Fire Department', role: 'Fire Emergency', phone: '101', isNational: true, priority: 3 },
    { name: 'Ambulance', role: 'Medical Emergency', phone: '108', isNational: true, priority: 4 },
    { name: 'NDMA (National Disaster Management)', role: 'Disaster Management', phone: '1078', isNational: true, priority: 5 },
    { name: 'Child Helpline', role: 'Child Emergency', phone: '1098', isNational: true, priority: 6 },
    { name: 'Women Helpline', role: 'Women Safety', phone: '181', isNational: true, priority: 7 },
    { name: 'Railway Emergency', role: 'Rail Accident', phone: '1512', isNational: true, priority: 8 },
    { name: 'DPS School Office', role: 'School Emergency', phone: '+91-11-12345678', isNational: false, schoolId: school.id, priority: 9 },
    { name: 'School Medical Room', role: 'Medical', phone: '+91-11-12345679', isNational: false, schoolId: school.id, priority: 10 },
  ]

  for (let i = 0; i < contacts.length; i++) {
    await prisma.emergencyContact.upsert({
      where: { id: `contact-${i + 1}` },
      update: {},
      create: { id: `contact-${i + 1}`, ...contacts[i] },
    })
  }

  // ─── Emergency Alerts ─────────────────────────────────────────────────────
  await prisma.emergencyAlert.upsert({
    where: { id: 'alert-001' },
    update: {},
    create: {
      id: 'alert-001',
      schoolId: school.id,
      title: 'Earthquake Drill Scheduled',
      description: 'A mandatory earthquake preparedness drill will be conducted on Friday at 10:00 AM. All students and staff must participate. Please review the Drop, Cover, and Hold On procedure beforehand.',
      priority: AlertPriority.MEDIUM,
      category: AlertCategory.DRILL,
      publishedBy: admin.id,
      isActive: true,
    },
  })

  await prisma.emergencyAlert.upsert({
    where: { id: 'alert-002' },
    update: {},
    create: {
      id: 'alert-002',
      title: 'Heat Wave Advisory',
      description: 'IMD has issued a Heat Wave warning for the region. Temperatures expected to exceed 45°C for the next 3 days. All outdoor activities including sports and field trips are suspended. Students must carry water bottles at all times.',
      priority: AlertPriority.HIGH,
      category: AlertCategory.HEAT_WAVE,
      publishedBy: admin.id,
      isActive: true,
    },
  })

  // ─── Award student some badges ────────────────────────────────────────────
  await prisma.userBadge.upsert({
    where: { userId_badgeId: { userId: student.id, badgeId: 'badge-first-quiz' } },
    update: {},
    create: { userId: student.id, badgeId: 'badge-first-quiz' },
  })
  await prisma.userBadge.upsert({
    where: { userId_badgeId: { userId: student.id, badgeId: 'badge-first-drill' } },
    update: {},
    create: { userId: student.id, badgeId: 'badge-first-drill' },
  })

  console.log('✅ Database seeded successfully!')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('Test accounts:')
  console.log('  Admin:   admin@disasterprep.edu   / Admin@123')
  console.log('  Teacher: teacher@disasterprep.edu / Teacher@123')
  console.log('  Student: student@disasterprep.edu / Student@123')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
