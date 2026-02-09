# Backend API for Yélo

This backend uses Express.js, Node.js, and MongoDB. It provides authentication (login, signup) and a tasks API. 

## Features
- User authentication (JWT-based)
- Task CRUD endpoints
- MongoDB for data storage
- Environment variable support

## Getting Started

1. Install dependencies:
   ```sh
   npm install
   ```
2. Create a `.env` file in the backend folder with:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```
3. Start the server:
   ```sh
   npm run dev
   ```

## API Endpoints
- POST `/api/auth/signup` — Register (accepts `email`, `password`, `fullName`)
- POST `/api/auth/login` — Login
- PUT `/api/auth/password` — Update password (auth required)
- GET `/api/tasks` — List tasks (auth required)
- POST `/api/tasks` — Create task (auth required)
- PUT `/api/tasks/:id` — Update task (auth required)
- DELETE `/api/tasks/:id` — Delete task (auth required)

## Connect Frontend
- Update your frontend to use the backend API endpoints above.

---
Replace placeholder values in `.env` before running.
