# Finance Dashboard Backend

A role-based backend for managing financial records, users, and dashboard analytics.

## Tech Stack
- Node.js + Express
- SQLite with better-sqlite3
- JWT for authentication
- Joi for validation
- bcryptjs for password hashing

## Features
- User registration & login (JWT)
- Role-based access control (Viewer / Analyst / Admin)
- Financial records CRUD with soft delete
- Filtering by type, category, date range
- Dashboard summaries: totals, category breakdown, monthly trends, recent activity
- Admin user management (role assignment, activate/deactivate)

## Setup

1. Clone the repo
2. Run `npm install`
3. Create `.env` file (see `.env.example`)
4. Run `npm run seed` to initialize database and sample data
5. Run `npm run dev` to start server

## API Endpoints

### Auth
- `POST /api/auth/register` – register new user
- `POST /api/auth/login` – login, returns JWT

### Users (authenticated)
- `GET /api/users/me` – get own profile
- `GET /api/users` – list all users (admin only)
- `PATCH /api/users/:id/role` – update role (admin only)
- `PATCH /api/users/:id/status` – activate/deactivate (admin only)

### Records (authenticated)
- `GET /api/records` – list records with filters (`type`, `category`, `date_from`, `date_to`, `page`, `limit`)
- `POST /api/records` – create record (analyst/admin)
- `PATCH /api/records/:id` – update record (analyst/admin)
- `DELETE /api/records/:id` – soft delete (admin only)

### Dashboard (analyst/admin only)
- `GET /api/dashboard/summary` – total income, expenses, net balance
- `GET /api/dashboard/categories` – breakdown by category & type
- `GET /api/dashboard/trends?months=12` – monthly trends
- `GET /api/dashboard/recent?limit=10` – recent activity
- `GET /api/dashboard/top-categories?type=expense&limit=5` – top spending/earning categories

## Sample Users (after seeding)
- Admin: admin@finance.com / admin123
- Analyst: analyst@finance.com / analyst123
- Viewer: viewer@finance.com / viewer123

## Project Structure
- src/
- config/ – database connection
- middleware/ – auth, role, validation
- modules/ – feature-based (auth, users, records, dashboard)
- utils/ – response helper
- database/ – schema and seed

**Live Demo:** [https://finance-backend-h2t5.onrender.com](https://finance-backend-h2t5.onrender.com)  
*Note: free instance spins down, first request may take ~50s.*
