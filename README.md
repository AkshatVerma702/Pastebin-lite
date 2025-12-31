# Pastebin-Lite

A simple Pastebin-like application built with **Next.js** and **Redis**. Users can create text pastes, share a URL, and view pastes with optional constraints (TTL and view limits). Features include creating pastes with optional time-to-live (TTL) and maximum views, viewing pastes via a shareable URL, and a health check route for monitoring. The project is serverless deployment ready on **Vercel**.

## Routes

**Health Check:** `GET /api/healthz` returns JSON `{ "ok": true }` if the service and Redis are accessible.

**Create a Paste:** `POST /api/pastes` with JSON body `{ "content": "Your text here", "ttl_seconds": 60, "max_views": 5 }` (ttl_seconds and max_views are optional). Response example: `{ "id": "abcd1234", "url": "https://your-app.vercel.app/p/abcd1234" }`.

**Fetch a Paste (API):** `GET /api/pastes/:id` returns JSON with paste content, remaining views, and expiry info. Returns 404 if paste is expired, missing, or view limit exceeded.

**View a Paste (HTML):** `GET /p/:id` renders the paste content in HTML. Returns 404 if paste is unavailable.

## Getting Started (Local Development)

1. Clone the repository: `git clone <your-repo-url>` and `cd pastebin`.
2. Install dependencies: `npm install`.
3. Create a `.env.local` file with `NEXT_PUBLIC_BASE_URL=http://localhost:3000` and `REDIS_URL=redis://default:<password>@<host>:<port>`.
4. Run the development server: `npm run dev`.
5. Open [http://localhost:3000](http://localhost:3000) to view the app.

## Persistence Layer

This project uses **Redis** to store pastes. Each paste is saved as a JSON object in Redis with optional TTL and view count constraints. Redis keys follow the pattern `paste:<id>`. TTL is handled via Redis `EXPIRE`, and view counts are decremented on each fetch.

## Design Decisions

- Serverless-compatible: Next.js API routes handle all logic and are safe for Vercel deployment.
- Centralized constraints logic: TTL and max_views are handled in API routes for consistent behavior across API and HTML views.
- Redis over in-memory storage: Allows pastes to persist across serverless invocations.
- Dynamic URLs: Protocol and host are determined from request headers for proper URL generation in both development and production.

## Deployment

Deployed on Vercel: [https://pastebin-lite-flax.vercel.app](https://pastebin-lite-flax.vercel.app). Make sure to set environment variables in Vercel project settings: `NEXT_PUBLIC_BASE_URL` and `REDIS_URL`.
