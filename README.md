# Team Task Manager

Full-stack MERN task manager with authentication, projects, team members, task assignment, status tracking, dashboard stats, and role-based access control.

## Features

- Signup and login with JWT authentication
- Admin and member roles
- Admin can create projects
- Admin can add members to projects
- Admin can create and assign tasks
- Members can view and update only their assigned tasks
- Dashboard shows total tasks, status counts, and overdue tasks
- React frontend connected to Express REST APIs
- MongoDB database with Mongoose relationships

## Tech Stack

- Frontend: React, React Router, Axios
- Backend: Node.js, Express.js
- Database: MongoDB, Mongoose
- Authentication: JWT, bcryptjs

## Demo Accounts

Run the seed command first.

```text
Admin: admin@example.com / admin123
Member: member1@example.com / member123
Member: member2@example.com / member123
```

## Local Setup

1. Install backend dependencies:

```bash
cd server
npm install
```

2. Install frontend dependencies:

```bash
cd ../client
npm install
```

3. Create `server/.env`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/team-task-manager
JWT_SECRET=replace_with_a_long_random_secret
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

4. Add demo data:

```bash
cd ../server
npm run seed
```

5. Start backend:

```bash
npm run dev
```

6. Start frontend in another terminal:

```bash
cd client
npm start
```

Frontend: `http://localhost:3000`

Backend API: `http://localhost:5000/api`

## API Routes

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/dashboard`
- `GET /api/projects`
- `POST /api/projects`
- `PUT /api/projects/:projectId/members`
- `GET /api/tasks?projectId=PROJECT_ID`
- `POST /api/tasks`
- `PUT /api/tasks/:taskId/status`
- `GET /api/users`

## Railway Deployment

This project can be deployed as one Railway service. Express serves the React production build.

1. Push the project to GitHub.
2. Create a new Railway project from the GitHub repo.
3. Add environment variables:

```env
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=replace_with_a_long_random_secret
NODE_ENV=production
```

4. Railway will run:

```bash
npm install
npm run build
npm start
```

5. After deployment, open the Railway URL.

Optional: run seed once from Railway shell or locally against the production MongoDB URI:

```bash
npm run seed
```

## Notes

- In development, React uses `http://localhost:5000/api`.
- In production, React uses `/api`, so it works on the same Railway domain.
- `.env` is ignored by git. Use `.env.example` as a template.
