# 🚀 Full-Stack Task Manager

A responsive, full-stack Task Management application built to efficiently manage daily items with comprehensive CRUD functionalities.

## 🔗 Project Links
* **Live Deployment Link:** https://vercel.app
* **Walkthrough Video:** [Add your video link here before submitting!]

## ✨ Key Features
* **Full CRUD Operations:** Add, view, edit, and delete tasks dynamically.
* **Database Integration:** Powered by an online Neon PostgreSQL cloud database.
* **Server-Side Validation:** Ensures required task details are captured securely.
* **Responsive Layout:** Clean UI designed for both mobile and desktop views.

## 🛠️ Tech Stack
* **Frontend:** Next.js (React), Tailwind CSS
* **Backend:** Next.js API Routes / Server Actions
* **Database & ORM:** Neon Serverless PostgreSQL & Prisma ORM
* **Hosting:** Vercel

## 🔌 API Endpoints
* `GET /api/tasks` - Fetches all tasks from the database.
* `POST /api/tasks` - Creates a new task card.
* `PATCH /api/tasks` - Updates an existing task's status or content.
* `DELETE /api/tasks` - Removes a task permanently from the database.

## 💡 Key Challenges & Solutions
* **The Challenge:** The cloud build phase on Vercel initially failed (Error Code `P1012`) because the Prisma client couldn't access or recognize a valid `DATABASE_URL` string layout during automated dependency compilation.
* **The Solution:** Added the correct live serverless database connection URI inside Vercel's private environment variables settings dashboard, allowing seamless build compilation and smooth data connections.
