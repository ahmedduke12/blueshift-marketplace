# BlueShift - B2B Labor Mobility Marketplace

A comprehensive B2B marketplace platform for labor mobility in Saudi Arabia, built with React, tRPC, and Supabase.

## Features

- 🏢 **Multi-Role System**: Workers, Company Admins, Sponsors, Regulators, Super Admins
- ✅ **8-Point Compliance Engine**: Automated validation for Saudi labor regulations
- 📊 **Real-time Dashboard**: Company and worker management
- 🔐 **Secure Authentication**: OAuth-based authentication system
- 📱 **Responsive Design**: Mobile-first UI with Tailwind CSS
- 🗄️ **PostgreSQL Database**: Powered by Supabase

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: tRPC 11, Express
- **Database**: PostgreSQL (Supabase)
- **ORM**: Drizzle ORM
- **Deployment**: Netlify

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm
- Supabase account

### Installation

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Edit .env with your Supabase credentials

# Run development server
pnpm dev
```

### Environment Variables

```env
DATABASE_URL=postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres
```

## Database Schema

The application includes 13 tables:
- users, companies, workers, jobs
- assignments, approvals, complianceChecks
- auditLogs, transactions, notifications
- workerAvailability, companyAdmins, analyticsSnapshots

## Deployment

### Netlify

1. Push to GitHub
2. Connect repository to Netlify
3. Add environment variables in Netlify dashboard
4. Deploy!

## License

MIT

## Author

Built for the Saudi Arabian labor mobility market
