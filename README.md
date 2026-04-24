# TaskManager

A production-ready full-stack task management web app built with React, Node.js, Express, and MongoDB. Features secure JWT authentication and full CRUD functionality for personal task tracking.

![Tech Stack](https://img.shields.io/badge/React-18-61DAFB?logo=react) ![Node](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js) ![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb)

---

## Features

- **Authentication** — Secure signup and login with bcrypt-hashed passwords
- **JWT sessions** — Token stored in localStorage, auto-attached via Axios interceptor
- **Protected routes** — Frontend redirects unauthenticated users to login
- **Task CRUD** — Create, read, and delete tasks scoped per user
- **Optimistic UI** — Task deletions reflected instantly without waiting for the server
- **Responsive** — Works on mobile and desktop
- **Clean architecture** — MVC on the backend, Context API + custom hooks on the frontend

---

## Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | React 18, Vite, Tailwind CSS        |
| Backend    | Node.js 18+, Express 4              |
| Database   | MongoDB Atlas, Mongoose             |
| Auth       | JWT (jsonwebtoken), bcryptjs        |
| HTTP       | Axios (with interceptors)           |
| Validation | express-validator                   |
| Routing    | React Router v6                     |

---

## Project Structure

```
task-manager/
├── client/                  # React + Vite frontend
│   └── src/
│       ├── api/             # Axios instance + API functions
│       ├── components/      # Reusable UI components
│       ├── context/         # AuthContext (global auth state)
│       └── pages/           # Login, Signup, Dashboard
└── server/                  # Express API
    ├── config/              # MongoDB connection
    ├── controllers/         # Business logic (auth, tasks)
    ├── middleware/          # JWT verification
    ├── models/              # Mongoose schemas
    └── routes/              # Route definitions
```

---

## Local Setup

### Prerequisites

- Node.js >= 18
- npm >= 9
- A [MongoDB Atlas](https://cloud.mongodb.com) account (free tier works)

### 1. Clone the repository

```bash
git clone https://github.com/your-username/task-manager.git
cd task-manager
```

### 2. Configure environment variables

```bash
# Copy the example file
cp .env.example server/.env
```

Edit `server/.env`:

```env
MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/taskmanager?retryWrites=true&w=majority
JWT_SECRET=generate_a_long_random_string_here
PORT=5000
CLIENT_URL=http://localhost:5173
```

Generate a secure JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. Install dependencies

```bash
# Install backend deps
cd server && npm install

# Install frontend deps
cd ../client && npm install
```

### 4. Run the development servers

Open **two terminals**:

```bash
# Terminal 1 — Backend (http://localhost:5000)
cd server
npm run dev

# Terminal 2 — Frontend (http://localhost:5173)
cd client
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

> The Vite dev server proxies all `/api` requests to `http://localhost:5000`, so no CORS issues during development.

---

## API Reference

### Auth

| Method | Endpoint            | Access | Description         |
|--------|---------------------|--------|---------------------|
| POST   | `/api/auth/signup`  | Public | Register new user   |
| POST   | `/api/auth/login`   | Public | Login, get JWT      |
| GET    | `/api/auth/me`      | Private| Get current user    |

### Tasks

| Method | Endpoint            | Access  | Description         |
|--------|---------------------|---------|---------------------|
| GET    | `/api/tasks`        | Private | Get all user tasks  |
| POST   | `/api/tasks`        | Private | Create a task       |
| DELETE | `/api/tasks/:id`    | Private | Delete a task       |

All private routes require `Authorization: Bearer <token>` header.

---

## Demo Credentials

After running locally, create an account through the signup page. Example:

```
Email:    demo@taskmanager.com
Password: demo123
```

---

## Deployment

### Frontend → Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → Import your repo
3. Set **Root Directory** to `client`
4. Add environment variable:
   ```
   VITE_API_URL=https://your-backend.onrender.com/api
   ```
5. Deploy — Vercel auto-detects Vite

### Backend → Render

1. Go to [render.com](https://render.com) → New → Web Service
2. Connect your GitHub repo
3. Configure:
   - **Root Directory:** `server`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
4. Add environment variables (from your `.env`):
   - `MONGO_URI`
   - `JWT_SECRET`
   - `PORT` → `10000` (Render's default)
   - `CLIENT_URL` → your Vercel URL (e.g. `https://taskmanager.vercel.app`)
5. Deploy

### Backend → Railway (alternative)

1. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub
2. Select your repo, set **Root Directory** to `server`
3. Add the same environment variables
4. Railway auto-detects Node.js and runs `npm start`

### After deploying both:

Update `CLIENT_URL` in your Render/Railway env vars to your Vercel URL, and update `VITE_API_URL` in Vercel env vars to your backend URL. Redeploy both services.

---

## Environment Variables Reference

| Variable      | Location     | Description                          |
|---------------|--------------|--------------------------------------|
| `MONGO_URI`   | `server/.env`| MongoDB Atlas connection string       |
| `JWT_SECRET`  | `server/.env`| Secret key for signing JWTs           |
| `PORT`        | `server/.env`| Express server port (default: 5000)   |
| `CLIENT_URL`  | `server/.env`| Frontend URL for CORS allow-list      |
| `VITE_API_URL`| `client/.env`| Backend API base URL (prod only)      |

---

## Security Notes

- Passwords are hashed with bcrypt (salt rounds: 12)
- JWTs expire after 7 days
- User enumeration is prevented (login returns same error for invalid email or password)
- Task ownership is verified server-side before every delete
- `password` field is excluded from all DB query results by default (`select: false`)
- JSON body size is limited to 10kb

---

## License

MIT
