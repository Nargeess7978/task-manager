# Task Manager

A full stack task management app: create, view, edit and delete tasks, change status
(Pending / In progress / Completed), set priority, and search or filter.

**Live demo:** _add your Vercel link_  
**Repository:** _add your GitHub link_

## Tech stack
- Next.js 15 (React) – UI and REST API in one project
- PostgreSQL + Prisma ORM
- Zod – validation shared by the form and the API
- Plain CSS, responsive layout

## Run locally
```bash
npm install
cp .env.example .env      # then paste your own DATABASE_URL
npx prisma db push        # creates the Task table
npm run dev               # http://localhost:3000
```

## Project structure
```
app/            page UI, layout, styles
app/api/tasks   REST API route handlers
components/     TaskForm (create/edit modal)
lib/            prisma client, validation schemas, API helpers
prisma/         database schema
```

## REST API
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/tasks?search=&status=&priority=` | List tasks (search + filters) |
| POST | `/api/tasks` | Create a task |
| GET | `/api/tasks/:id` | Get one task |
| PUT | `/api/tasks/:id` | Update a task (partial allowed) |
| DELETE | `/api/tasks/:id` | Delete a task |

Fields: `title` (required, max 100), `description` (max 500), `status` (`PENDING` | `IN_PROGRESS` | `COMPLETED`), `priority` (`LOW` | `MEDIUM` | `HIGH`). `id`, `createdAt`, `updatedAt` are set automatically.

Errors return `{ "error": "message", "details": [{ "field", "message" }] }` with status 400 (invalid input), 404 (not found) or 500 (server error).

## Deploy (Vercel)
1. Push to GitHub and import the repo in Vercel.
2. Add the `DATABASE_URL` environment variable (Neon or Supabase connection string).
3. Deploy. The build script creates the table automatically.
