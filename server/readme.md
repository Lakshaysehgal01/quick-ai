# Quick-AI Backend (server/)

## Overview

This is the backend for the Quick-AI project. It provides RESTful APIs for AI-powered features, user management, file uploads, and more. Built with Node.js, Express, TypeScript, Prisma, and Clerk authentication.

---

## Tech Stack

- **Node.js** with **Express** (API server)
- **TypeScript** (type safety)
- **Prisma** (ORM for PostgreSQL)
- **Clerk** (authentication)
- **Cloudinary** (media storage)
- **Multer** (file uploads)
- **OpenAI** (AI features)
- **PDF-TS** (PDF parsing)
- **dotenv** (environment variables)
- **CORS** (cross-origin requests)

---

## Project Structure

```
server/
  src/
    Controller/      # Business logic for AI and user endpoints
    Middleware/      # Custom middleware (e.g., auth)
    Routes/          # Express routers for AI and user APIs
    lib/             # Utility libraries (Cloudinary, DB, Multer)
    types/           # TypeScript type definitions
    index.ts         # Main entry point
  prisma/
    schema.prisma    # Prisma schema (PostgreSQL)
    migrations/      # DB migrations
  uploads/           # Uploaded files
  package.json       # Scripts and dependencies
  tsconfig.json      # TypeScript config
```

---

## Setup & Development

1. **Install dependencies:**
   ```sh
   npm install
   ```
2. **Configure environment variables:**
   - Copy `.env.example` to `.env` and fill in required values (DB, Clerk, Cloudinary, OpenAI, etc).
3. **Set up the database:**
   ```sh
   npx prisma migrate dev
   npx prisma generate
   ```
4. **Run the server in development:**
   ```sh
   npm run dev
   ```

---

## Scripts

- `npm run build` — Compile TypeScript
- `npm run start` — Run compiled server
- `npm run dev` — Build and start server (dev mode)

---

## API Endpoints

- `/api/v1/ai` — AI-powered features (image, text, etc)
- `/api/v1/user` — User profile, creations, etc

All endpoints are protected by Clerk authentication middleware.

---

## Example: Main Server (`src/index.ts`)

```ts
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { clerkMiddleware, requireAuth } from "@clerk/express";
import aiRouter from "./Routes/ai.routes.js";
import userRouter from "./Routes/user.routes.js";
dotenv.config({ quiet: true });

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(cors());
app.use(clerkMiddleware());

app.use(requireAuth());
app.use("/api/v1/ai", aiRouter);
app.use("/api/v1/user", userRouter);

app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});
```

---

## Prisma Model Example

```prisma
model Creation {
  id         Int      @id @default(autoincrement())
  userId     String   // Clerk user ID
  prompt     String
  content    String
  type       String
  publish    Boolean  @default(false)
  likedBy    String[] @default([]) // Clerk user IDs who liked it
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

### `/api/v1/ai` — AI-powered features

| Route | Method | Description |
|-------|--------|-------------|
| `/generate-article` | POST | Generate an article from a prompt (requires premium) |
| `/generate-blog-title` | POST | Generate a blog title from a prompt (requires premium) |
| `/generate-image` | POST | Generate an image from a prompt (requires premium) |
| `/remove-image-background` | POST | Remove background from an uploaded image (requires premium, file upload: `image`) |
| `/remove-image-object` | POST | Remove an object from an uploaded image (requires premium, file upload: `image`) |
| `/resume-review` | POST | Review an uploaded resume and provide feedback (requires premium, file upload: `resume`) |

All `/ai` routes require authentication and premium access.

---

### `/api/v1/user` — User profile, creations, etc

| Route | Method | Description |
|-------|--------|-------------|
| `/get-user-creation` | GET | Get all creations (articles, images, etc) for the authenticated user (requires premium) |
| `/published-creation` | GET | Get all published creations from all users (requires premium) |
| `/toggle-like` | POST | Like or unlike a creation (requires premium) |

All `/user` routes require authentication and premium access.

---

All endpoints are protected by Clerk authentication middleware.
## License

MIT
```
