# Local Business Directory

A mobile-first web application enabling local small businesses to list their services across location-specific directories.

## Tech Stack

- **Frontend**: Next.js 14+ (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS with CSS Variables
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js v5 (Email, Google OAuth, Facebook OAuth)
- **Icons**: Lucide React
- **Hosting**: Railway.com
- **Image Hosting**: Cloudinary

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL database (local or Railway)
- Google OAuth credentials
- Facebook OAuth credentials

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy `.env.example` to `.env` and fill in your environment variables:
   ```bash
   cp .env.example .env
   ```

4. Run Prisma migrations:
   ```bash
   npx prisma migrate dev
   ```

5. Seed the database (optional):
   ```bash
   npx prisma db seed
   ```

6. Start the development server:
   ```bash
   npm run dev
   ```

7. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
localbusinessdirectory.app/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles with CSS variables
├── components/            # React components
├── lib/                   # Utility functions
├── prisma/               # Database schema and migrations
│   └── schema.prisma     # Prisma schema
├── docs/                 # Documentation
│   ├── kanban_dev.html   # Development Kanban board
│   └── Local_Business_Directory_Complete_PRD.md
└── public/               # Static assets

```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Railway Deployment

This project is configured for deployment on Railway.com with automatic Git-based deployment.

### Environment Variables Required

See `.env.example` for all required environment variables.

## Team

- **[Flow]** - DevOps Engineer (Infrastructure, Deployment)
- **[Codey]** - Technical Program Manager (Auth, API)
- **[Syntax]** - Principal Engineer (Database, Backend)
- **[Aesthetica]** - Frontend Developer & UI/UX
- **[Verity]** - QA Lead
- **[Sentinal]** - Security Specialist

## Documentation

- [Complete PRD](./docs/Local_Business_Directory_Complete_PRD.md)
- [Development Kanban](./docs/kanban_dev.html)
- [Project Instructions](./CLAUDE.md)

## License

Private - All Rights Reserved
