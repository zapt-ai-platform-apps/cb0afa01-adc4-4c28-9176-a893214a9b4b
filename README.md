# Aviary - Work Management Suite

Aviary is a GDPR-first, all-in-one work-management suite for creative & tech SMEs.

## Features

- Project management with Kanban boards
- Task tracking with subtasks and comments
- Time tracking and reporting
- Resource planning and capacity management
- OKR goal tracking
- Automation workflows
- File management with secure storage
- Team collaboration
- GDPR-compliant data handling

## Tech Stack

- Frontend: React 18, TailwindCSS, React Router, React Query
- Backend: Node.js on Vercel Functions
- Database: CockroachDB with Drizzle ORM
- Storage: S3-compatible storage
- Authentication: Supabase Auth

## Getting Started

### Development

1. Clone the repository
2. Install dependencies with `npm install`
3. Create a `.env` file with the required environment variables
4. Run the development server with `npm run dev`

### Production

The application is deployed to Vercel and can be accessed at:

- Staging: https://staging.aviaryapp.eu
- Production: https://app.aviary.eu

## Project Structure

- `/src`: Frontend application code
- `/api`: Backend API routes (deployed as Vercel Functions)
- `/drizzle`: Database schema and migrations
- `/public`: Static assets

## Data Model

Aviary uses a relational data model with the following key entities:

- Organizations
- Users with role-based access control
- Projects
- Tasks with subtasks
- Time entries
- Resource planning with capacity and bookings
- OKRs and key results
- Automations