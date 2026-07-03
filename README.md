# Society Maintenance Tracker

A full-stack MERN-style complaint tracking platform for apartment societies. Residents can register, submit complaints with optional photos, and track status history. Admins can manage complaints, set priorities, detect overdue items, post notices, send notifications, and view dashboard metrics.

Working Link - https://societyos-society-management-system.vercel.app/login

## Tech Stack
- Frontend: React, Vite, Tailwind CSS, React Router, Axios
- Backend: Node.js, Express.js, MongoDB, Mongoose
- Authentication: JWT, bcrypt
- Uploads: Multer local image storage
- Email: Nodemailer SMTP with development log fallback

## Project Structure
```text
.
├── backend/
│   ├── src/config
│   ├── src/controllers
│   ├── src/middleware
│   ├── src/models
│   ├── src/routes
│   ├── src/scripts
│   ├── src/services
│   └── src/utils
├── frontend/
│   └── src/
│       ├── api
│       ├── components
│       ├── context
│       ├── layouts
│       ├── pages
│       ├── routes
│       └── utils
├── PROJECT_REQUIREMENTS.md
├── PROJECT_STATUS.md
└── SYSTEM_DESIGN.md
```

## Setup
Install dependencies separately:

```bash
cd backend
npm install

cd ../frontend
npm install
```

Create environment files:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Update `backend/.env` with a JWT secret. `MONGODB_URI` is recommended; when it is omitted in development, the backend starts an in-memory MongoDB instance so the app can be tested immediately.

## Environment Variables
Backend:
- `PORT`: API port, default `5000`
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: JWT signing secret
- `JWT_EXPIRES_IN`: token lifetime, default `7d`
- `CLIENT_URL`: frontend origin for CORS
- `OVERDUE_THRESHOLD_DAYS`: overdue threshold
- `MAX_UPLOAD_SIZE_MB`: image upload size limit
- `ADMIN_NAME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`: admin seed credentials(refer .env.example)
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `EMAIL_FROM`: email settings

Frontend:
- `VITE_API_URL`: backend API URL
- `VITE_UPLOADS_URL`: backend base URL for uploaded images

## Run Locally
Seed an admin after configuring `backend/.env`:

```bash
cd backend
npm run seed:admin
```

Start backend:

```bash
cd backend
npm run dev
```

Start frontend:

```bash
cd frontend
npm run dev
```

Open `http://localhost:5173`.

## API Docs
Base URL: `/api`

### Auth
- `POST /register` `{ name, email, password }`
- `POST /login` `{ email, password }`
- `GET /me` authenticated

### Complaints
- `GET /options` authenticated; returns categories, statuses, priorities
- `POST /complaints` resident only; multipart form fields `category`, `description`, optional `photo`
- `GET /complaints/me` resident only
- `GET /complaints` admin only; query `status`, `category`, `priority`, `startDate`, `endDate`, `search`
- `GET /complaints/:id` resident owner or admin
- `PUT /complaints/:id` admin only; `{ status, priority, note }`

### Notices
- `GET /notices` authenticated
- `POST /notices` admin only; `{ title, content, isImportant }`

### Dashboard
- `GET /dashboard` admin only; returns counts by status, category, and overdue total

## Database Schema
### User
`name`, `email` unique, `passwordHash`, `role` (`resident` or `admin`), timestamps.

### Complaint
`resident`, `category`, `description`, `photoUrl`, `status`, `priority`, `resolvedAt`, timestamps. Indexed by resident, status, category, priority, and created date.

### ComplaintHistory
`complaint`, `changedBy`, `oldStatus`, `newStatus`, `oldPriority`, `newPriority`, `note`, timestamps.

### Notice
`postedBy`, `title`, `content`, `isImportant`, timestamps. Important notices sort first.

## Features Implemented
- Resident registration and login
- Admin login through seed script
- JWT authentication and role authorization
- Complaint creation with optional image upload
- Resident complaint list and detail history
- Admin complaint list, filters, status updates, priority updates
- Closed resolved complaints
- Overdue detection using configurable threshold
- Notice board with pinned important notices
- Email notifications for status changes and important notices
- Admin dashboard metrics
- Responsive Tailwind UI with loading, validation, and error states

## Assumptions
- Local uploads are used for assignment simplicity; production should use cloud storage.
- Missing SMTP configuration logs email payloads in development.
- HTTPS is expected at deployment layer.
- Hosted URL depends on deployment platform credentials and is not generated locally.
