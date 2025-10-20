# Social App

[![React](https://img.shields.io/badge/React-19.1.1-blue?logo=react&logoColor=white)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-latest-green?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express.js-latest-lightgrey?logo=express&logoColor=black)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-latest-2EA0F0?logo=prisma&logoColor=white)](https://www.prisma.io/)
[![MySQL](https://img.shields.io/badge/MySQL-latest-blue?logo=mysql&logoColor=white)](https://www.mysql.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-latest-brightgreen?logo=vite&logoColor=white)](https://vitejs.dev/)

A modern full-stack **social app** built with **React + Vite (frontend)** and **Node.js + Express + TypeScript (backend)** using **Prisma + MySQL**. Features: authentication (JWT + refresh tokens in httpOnly cookies), posts (create/edit/delete), comments (create/edit/delete), likes, user profiles with avatar upload, file uploads, simple search & filters and protected routes.

---

## 📌 Table of Contents

1. [Features](#-features)
2. [Tech Stack](#-tech-stack)
3. [Project Structure](#-project-structure)
4. [Installation & Setup](#-installation--setup)
5. [Environment Variables](#-environment-variables)
6. [Scripts](#-scripts)
7. [API Endpoints (summary)](#-api-endpoints-summary)
8. [Frontend Routes (pages)](#-frontend-routes-pages)
9. [Screenshots (placeholders)](#-screenshots-placeholders)
10. [Troubleshooting & Notes](#-troubleshooting--notes)
11. [Future Improvements](#-future-improvements)
12. [Author](#-author)

---

## 🚀 Features

### Authentication

-   Register / Login / Logout
-   Access token (JWT) + Refresh token (server-side stored) with httpOnly cookies
-   Protected routes server & client side

### Users

-   View users list & profiles
-   Edit profile, upload avatar
-   Change password, delete account

### Posts

-   Create, edit, delete posts (image upload + tags)
-   Pagination, search, sort (recent / popular), tag & image filters
-   Post counts for likes & comments

### Interactions

-   Like / unlike posts
-   Comments: create, edit, delete (owner-only)
-   File uploads for post images and avatars

### Frontend UX

-   Protected routes with `PrivateRoute`
-   Axios interceptor that refreshes tokens on 401
-   Responsive UI with CSS modules
-   Route for creating/editing posts (reuse create page for editing)

---

## 🛠️ Tech Stack

**Frontend:** React 19, React Router, TypeScript, Vite, Axios, lucide-react (icons), CSS Modules
**Backend:** Node.js, Express, TypeScript, Prisma ORM, MySQL, multer (uploads), bcrypt, jsonwebtoken
**Dev Tools:** ts-node-dev / nodemon, Prisma CLI, Vite

---

## 📂 Project Structure

### Server (`server/`)

```
server/
├─ node_modules/
├─ prisma/
│  ├─ migrations/
│  │  └─ 20251001150326_init/
│  │     └─ migration.sql
│  ├─ schema.prisma
│  └─ seed.ts
├─ uploads/
│  ├─ avatars/
│  └─ ...
├─ .env
├─ .gitignore
├─ package.json
├─ package-lock.json
├─ tsconfig.json
└─ src/
   ├─ app.ts
   ├─ server.ts
   ├─ controllers/       (authController.ts, postsController.ts, commentsController.ts, likesController.ts, userController.ts, ...)
   ├─ routes/            (authRoutes.ts, postsRoutes.ts, commentsRoutes.ts, likesRoutes.ts, userRoutes.ts, uploadsRoutes.ts)
   ├─ services/          (authService.ts, postsService.ts, commentsService.ts, likesService.ts, userService.ts)
   ├─ middleware/        (auth.ts, errorHandler.ts)
   ├─ models/            (index.ts — prisma client)
   ├─ utils/             (jwt.ts, hash.ts)
   └─ types/
```

### Client (`client/`)

```
client/
├─ node_modules/
├─ public/
│  └─ appLogoIcon.png
├─ .gitignore
├─ package.json
├─ index.html
├─ tsconfig.json
├─ vite.config.ts
└─ src/
   ├─ main.tsx
   ├─ App.tsx
   ├─ index.css
   ├─ api/
   │  ├─ apiClient.ts
   │  ├─ authApi.ts
   │  ├─ postsApi.ts
   │  ├─ commentsApi.ts
   │  ├─ likesApi.ts
   │  └─ usersApi.ts
   ├─ hooks/
   │  └─ useAuth.tsx
   ├─ routing/
   │  ├─ AppRoutes.tsx
   │  └─ routes.ts
   ├─ components/
   │  ├─ PostCard/
   │  ├─ ProfileCard/
   │  ├─ Input/
   │  ├─ Button/
   │  └─ Layout/
   ├─ pages/
   │  ├─ Home/
   │  ├─ Auth/
   │  ├─ MyProfile/
   │  ├─ CreatePost/
   │  ├─ Post/
   │  └─ Settings/
   └─ assets/
```

---

## 💾 Installation & Setup

### Prerequisites

-   Node.js (v18+ recommended)
-   npm or yarn
-   MySQL running & accessible

---

### Backend (server)

1. Open terminal:

```bash
cd server
npm install
```

2. Create `.env` (see example below).

3. Generate Prisma client & run migrations:

```bash
npx prisma generate
npx prisma migrate dev --name init
```

4. (Optional) Seed the DB:

```bash
npx ts-node prisma/seed.ts
```

5. Start server (dev):

```bash
npm start
```

Server runs by default at `http://localhost:5000`.

---

### Frontend (client)

1. Open terminal:

```bash
cd client
npm install
```

2. Start dev server:

```bash
npm start
```

Frontend runs by default at `http://localhost:5173`.

---

## 🔐 Environment Variables

Create `server/.env` with values like below (do **not** commit real secrets):

```
PORT=5000
DATABASE_URL="mysql://USER:PASSWORD@127.0.0.1:3306/social_app"

# JWT
JWT_ACCESS_SECRET=your_access_secret_here
JWT_REFRESH_SECRET=your_refresh_secret_here
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d

# Security / environment
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
```

Notes:

-   `DATABASE_URL`: MySQL connection string.
-   `JWT_*`: random long secrets.
-   `CORS_ORIGIN`: frontend origin (Vite default `http://localhost:5173`).

---

## 🔁 Useful Scripts (examples)

**server/package.json**

```json
{
    "scripts": {
        "dev": "ts-node-dev --respawn src/server.ts",
        "build": "tsc",
        "start": "node dist/server.js",
        "seed": "ts-node prisma/seed.ts"
    }
}
```

**client/package.json**

```json
{
    "scripts": {
        "start": "vite",
        "build": "vite build",
        "preview": "vite preview",
        "lint": "eslint \"src/**/*.{ts,tsx}\" --fix"
    }
}
```

---

## 🔗 API Endpoints (summary)

Base: `http://localhost:5000/api`

### Auth

-   `POST /api/auth/register` — body: `{ username, email, password }`
-   `POST /api/auth/login` — body: `{ email, password }` → sets `accessToken` and `refreshToken` cookies on success
-   `POST /api/auth/logout` — protected → clears refresh token & cookies
-   `GET  /api/auth/me` — protected → returns current user
-   `POST /api/auth/refresh` — uses `refreshToken` cookie to refresh tokens

### Users

-   `GET /api/users` — protected — list users (supports `page`, `limit`, `count` query)
-   `GET /api/users/:id` — protected — get user by id
-   `GET /api/users/email/:email` — protected — get user by email
-   `PATCH /api/users/:id` — protected — update profile
-   `DELETE /api/users/:id` — protected — delete user (cascades deletes likes/comments/posts)
-   `POST /api/users/:id/avatar` — protected — avatar upload (`multipart/form-data`, field `avatar`)
-   `POST /api/users/:id/password` — protected — change password

### Posts

-   `GET /api/posts` — list posts (supports `page`, `limit`, `userId`, `search`, `tag`, `sort`, `hasImage`)
-   `POST /api/posts` — protected — create post
-   `GET /api/posts/:id` — get post by id
-   `PATCH /api/posts/:id` — protected — update post (owner only)
-   `DELETE /api/posts/:id` — protected — delete post (owner only)

### Comments

-   `GET /api/posts/:postId/comments` — list comments for a post
-   `POST /api/posts/:postId/comments` — protected — create comment
-   `PATCH /api/posts/:postId/comments/:commentId` — protected — update comment (owner only)
-   `DELETE /api/posts/:postId/comments/:commentId` — protected — delete comment (owner only)

### Likes

-   `POST /api/posts/:postId/likes` — protected — like a post
-   `DELETE /api/posts/:postId/likes` — protected — unlike a post

### Uploads

-   `POST /api/uploads` — upload files (returns `url`)
-   Static files served from `/uploads/*` (e.g. avatars under `/uploads/avatars/...`)

---

## 🧭 Frontend Routes (pages)

Main client routes:

-   `/` — Home (feed)
-   `/post` — Post page (single post view)
-   `/users/:id` — User profile
-   `/me` — My profile
-   `/edit-profile` — Edit profile
-   `/create` — Create post
-   `/posts/edit/:id` — Edit post (reuses create page)
-   `/login` — Login
-   `/register` — Register
-   `/settings` — Settings (change password, delete account)
-   `/search` — Search results
-   `/about`, `/help`, `/contact`, `/forgot-password`

`PrivateRoute` protects pages that require authentication.

---

## 📸 Screenshots

**Login / Register Pages**
![Login Page](./Screenshots/login.png)
![Sign Up Page](./Screenshots/sign_up.png)

**Home Page**
![Home Page](./Screenshots/home.png)

**Post Page (single post view)**
![Post Page](./Screenshots/post.png)

**My Profile**
![My Profile](./Screenshots/my_profile.png)

**Edit Profile**
![Edit Profile](./Screenshots/edit_profile.png)

**Create / Edit Post**
![Create/Edit Post](./Screenshots/create_post.png)

**Settings**
![Settings](./Screenshots/settings.png)

---

## ⚠️ Troubleshooting & Notes

**1. Login stuck on "Please wait..."**

-   The frontend sets `isLoading` while login/register runs; ensure any thrown errors from the API are propagated back to the UI and `isLoading` is cleared in `finally`. The axios interceptor will attempt `/auth/refresh` on 401 — if refresh fails (e.g. invalid refresh token) it clears cookies and rejects; your UI should surface the backend message (401) and stop loading.

**2. CORS & cookies**

-   Backend `app.ts` sets `cors({ origin: "http://localhost:5173", credentials: true })`. If your frontend runs on a different origin, update `CORS_ORIGIN`. Axios client must have `withCredentials: true` (it does) so cookies are sent.

**3. Comments/avatars after update**

-   If you see default avatar after comment update, ensure the backend `updateComment` (or the code that returns comment) includes the `author` relation with `avatar_url` and that frontend mapping uses `comment.author.avatar_url` (or builds full URL) instead of dropping it when replacing the comment item in state.

**4. RightPanel suggested users**

-   Filter out the logged-in user on the frontend before rendering suggestions (e.g. `users.filter(u => u.id !== currentUser.id)`).

**5. 404 on comment delete**

-   Ensure client requests to `DELETE /api/posts/:postId/comments/:commentId` match server route and that `commentsRoutes` is registered under `/api` (app uses `app.use("/api", commentsRoutes);`). Also confirm `auth` middleware is applied and cookie/token is present.

**6. Token refresh semantics**

-   Server deletes the old refresh record on successful refresh and creates a new one; the frontend should retry original request after successful refresh (axios interceptor handles this).

---

## ⚡ Future Improvements

-   Real-time: WebSockets for live comments/likes/notifications
-   Better media handling: CDN + image resizing / thumbnails
-   Infinite scroll UX improvements
-   Rate limiting & brute-force protection on auth endpoints
-   Admin dashboard for moderation (posts, users)
-   Unit & integration tests, CI pipeline, Dockerized deployment

---

## 🌐 Demo (Coming Soon)

_A live demo will be available after deployment._

---

## 💻 Author

Harut Choloyan — [GitHub](https://github.com/HarutC05)
