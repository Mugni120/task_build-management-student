# AGENTS.md

## Project Overview

Full-stack Student Management System — Express 5 backend with SQLite, vanilla JS frontend (no build step).

## Commands

```bash
# Install dependencies
npm install

# Start the backend server (port 3000)
node backend/server.js

# ⚠️ `npm run api-service` is BROKEN — it runs `node server.js` but the file is at `backend/server.js`.
# Use `node backend/server.js` directly.
```

There is no test framework, linter, or formatter configured. `npm test` exits with an error by default.

## Architecture

- **Backend** (`backend/server.js`): Express 5 REST API at `/api/students` — full CRUD (GET, POST, PUT, DELETE). CommonJS (`require`), not ESM.
- **Frontend** (`frontend/`): Static HTML/CSS/JS. Open `frontend/index.html` directly in a browser — no dev server or build step needed.
- **Database** (`backend/students.db`): SQLite, auto-created on server start. No migrations. The `students` table is created via `CREATE TABLE IF NOT EXISTS`.

## Key Gotchas

- **Frontend API URL is hardcoded** to `http://localhost:3000/api/students` in `frontend/app.js`. No environment-based configuration.
- **Express 5** — not Express 4. Some middleware and routing behaviors differ.
- **No `.gitignore`** — `node_modules/` and `backend/students.db` are at risk of being committed. Add a `.gitignore` before pushing to any remote.
- **No CI/CD, no pre-commit hooks** — nothing validates code before commit.
- **Port 3000** is hardcoded in `backend/server.js` (no `PORT` env var support).
