# YouthCamping Traveler Platform

An adventure travel company management suite built with Next.js 14, Node.js + Express, Prisma ORM, and integrated with Anthropic Claude and Twilio.

## Quick Start (Local Development)

### Backend setup
1. \`cd backend\`
2. Install dependencies: \`npm install\`
3. Create a \`.env\` file matching \`.env.example\` inside the \`/backend\` directory.
   - For local testing, SQLite is used out of the box when DATABASE_URL is mapped to a local \`file:./dev.db\`
4. Migrate the database: \`npx prisma db push\`
5. Seed the database with the sample trip: \`npx ts-node prisma/seed.ts\`
6. Start the server: \`npm run dev\` (Runs on Port 5000)

### Frontend setup
1. \`cd frontend\`
2. Install dependencies: \`npm install\`
3. Create a \`.env.local\` file mapping \`NEXT_PUBLIC_API_URL=http://localhost:5000\`
4. Start the app: \`npm run dev\` (Runs on Port 3000)

## Access Roles
Default seeded users from \`seed.ts\`:
- Admin: \`admin@youthcamping.in\` | \`Admin@123\`
- Traveler: \`rahul@example.com\` | \`Traveler@123\`

---

## Deployment Instructions

### 1. Database (Neon - PostgreSQL)
- Create a new project in [Neon](https://neon.tech).
- Copy the provided Postgres Connection String.

### 2. Backend (Railway)
- Push your backend folder to GitHub.
- Connect your GitHub repository to [Railway](https://railway.app).
- Under the Railway dashboard's **Variables** tab, set all required environment variables:
  - \`DATABASE_URL\` (from Neon)
  - \`JWT_SECRET\` (random string)
  - \`ANTHROPIC_API_KEY\` (from Anthropic console)
  - \`TWILIO_ACCOUNT_SID\` & \`TWILIO_AUTH_TOKEN\` (from Twilio console)
- In the Railway **Deploy** settings, add the custom build command:
  - \`npx prisma generate && npx tsc\`
- Add a custom start command:
  - \`npx prisma migrate deploy && node dist/server.js\`

### 3. Frontend (Vercel)
- Push your frontend folder to GitHub.
- Connect your GitHub repository to [Vercel](https://vercel.com).
- Under **Environment Variables**, configure:
  - \`NEXT_PUBLIC_API_URL\` (URL produced by your Railway backend instance)
- Deploy! Vercel will automatically detect Next.js 14 and optimize the App Router caching. 

---
*Built with ❤️ for YouthCamping Adventures.*
