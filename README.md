# Disaster Preparedness and Response Education System

A comprehensive educational platform built with Next.js to teach students about disaster preparedness, response strategies, and safety protocols through interactive modules, quizzes, and simulations.

## 🌟 Features

### 🎓 For Students
- **Interactive Modules**: Learn about various natural disasters (Earthquakes, Floods, Fires, etc.) with detailed guides on what to do before, during, and after a crisis.
- **Quizzes & Assessments**: Test your knowledge and earn XP, badges, and certificates upon successful completion.
- **Simulations**: Participate in step-by-step scenario-based simulations to practice decision-making in emergency situations.
- **Gamification**: Level up your profile, maintain daily streaks, and compete on the leaderboard.
- **Emergency Contacts**: Quick access to national and local emergency contact numbers.

### 👨‍🏫 For Teachers
- **Student Progress Tracking**: Monitor how students are performing on quizzes and simulations.
- **Schedule Drills**: Organize and keep track of school-wide disaster drills and training events.
- **Reporting**: Generate detailed analytics and reports on student engagement and readiness.

### 🛡️ For Administrators
- **School Management**: Manage teacher and student accounts.
- **Emergency Alerts**: Broadcast high-priority alerts and notifications to all users within the institution.
- **System Analytics**: Overview of platform usage, drill records, and overall readiness scores.

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL (via [Neon Serverless](https://neon.tech/))
- **ORM**: [Prisma](https://www.prisma.io/)
- **Authentication**: [NextAuth.js](https://authjs.dev/) with bcrypt
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/) & [Lucide Icons](https://lucide.dev/)
- **Data Visualization**: [Recharts](https://recharts.org/)
- **Forms & Validation**: React Hook Form & Zod
- **Email Service**: Resend & Nodemailer
- **PDF Generation**: jsPDF & html2canvas

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- A PostgreSQL database

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Aj2280/Disaster-Preparedness-and-Response-Education-System-.git
   cd Disaster-Preparedness-and-Response-Education-System-
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables:**
   Create a `.env` or `.env.local` file in the root directory and add the necessary variables:
   ```env
   DATABASE_URL="postgresql://user:password@host:port/database"
   NEXTAUTH_SECRET="your_nextauth_secret"
   ```

4. **Initialize the database:**
   Run Prisma migrations to set up the database schema:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Seed the database (Optional):**
   Populate the database with initial dataset (contacts, disasters, quizzes):
   ```bash
   npx tsx scripts/seed_disasters.ts
   npx tsx scripts/seed_quizzes.ts
   npx tsx scripts/seed_contacts.ts
   npx tsx scripts/seed_students.ts
   ```

6. **Run the development server:**
   ```bash
   npm run dev
   ```

7. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📁 Project Structure

- `app/`: Next.js App Router pages and API routes.
  - `(dashboard)/`: Role-based dashboards (Admin, Student, Teacher).
  - `api/`: API endpoints for authentication, modules, quizzes, etc.
- `components/`: Reusable React components (UI, Shared, Layout).
- `lib/`: Utility functions, Prisma client, NextAuth configuration, and constants.
- `prisma/`: Prisma schema and database configuration.
- `scripts/`: Data seeding scripts for populating the database using CSV datasets.
- `public/`: Static assets (images, icons).

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.
