# Nestra - Society Maintenance Tracker

A full-stack MERN-style society operations platform for apartment communities. Nestra supports multiple isolated societies, resident onboarding by joining code, complaint tracking, notices, OTP password recovery, and admin dashboards.

## Tech Stack
- Frontend: React, Vite, Tailwind CSS, React Router, Axios
- Backend: Node.js, Express.js, MongoDB, Mongoose
- Authentication: JWT, bcrypt
- Uploads: Multer memory uploads with Cloudinary storage
- Email: Resend HTTPS API
- Branding: Nestra

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

The backend creates an idempotent public demo society named `General Society` with joining code `GENERAL-DEMO`. Existing records without a society reference are backfilled into this society.

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
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`: Cloudinary image storage
- `RESEND_API_KEY`: Resend API key for email delivery
- `EMAIL_FROM`: verified Resend sender address

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
- `POST /register` `{ name, email, password, societyCode }`
- `POST /societies/register` `{ societyName, name, email, password, address? }`; creates a society and admin
- `POST /login` `{ email, password }`
- `POST /forgot-password` `{ email }`; sends a time-limited OTP without revealing account existence
- `POST /verify-otp` `{ email, otp }`
- `POST /reset-password` `{ resetToken, password }`
- `GET /me` authenticated

### Complaints
- `GET /options` authenticated; returns categories, statuses, priorities
- `POST /complaints` resident only; multipart form fields `category`, `description`, optional `photo`; images are stored in Cloudinary
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
`name`, `email` unique, `passwordHash`, `role` (`resident` or `admin`), `societyId`, timestamps.

### Society
`name`, unique `joiningCode`, `address`, `isActive`, `createdBy`, timestamps.

### Complaint
`societyId`, `resident`, `category`, `description`, Cloudinary `photoUrl` and `photoPublicId`, `status`, `priority`, `resolvedAt`, timestamps. Indexed by society, resident, status, category, priority, and created date.

### ComplaintHistory
`societyId`, `complaint`, `changedBy`, `oldStatus`, `newStatus`, `oldPriority`, `newPriority`, `note`, timestamps.

### Notice
`societyId`, `postedBy`, `title`, `content`, `isImportant`, timestamps. Important notices sort first and are isolated by society.

### PasswordResetOtp
Stores hashed OTP and reset-token values with expiry, resend, and verification-attempt controls.

## Features Implemented
- Resident registration and login
- Multi-society registration and tenant-isolated data access
- Society joining codes and General Society demo access
- Admin login through seed script
- JWT authentication and role authorization
- Complaint creation with optional Cloudinary image upload
- Resident complaint list and detail history
- Admin complaint list, filters, status updates, priority updates
- Closed resolved complaints
- Overdue detection using configurable threshold
- Notice board with pinned important notices
- Resend email notifications for status changes and important notices
- Email OTP forgot-password flow with expiry and single-use reset tokens
- Admin dashboard metrics
- Responsive Tailwind UI with loading, validation, and error states

## Deployment Notes
- Set `VITE_API_URL` in Vercel to `https://societyos-society-management-system.onrender.com/api`.
- Set `CLIENT_URL=https://nestra-society.vercel.app` in Render.
- Configure Cloudinary and Resend credentials in the Render environment; do not commit `.env` files.
- In development, missing Resend configuration logs email content locally. In production, email delivery failures return a controlled error.
- HTTPS is expected at deployment layer.
- The hosted frontend is `https://nestra-society.vercel.app`; the backend is `https://societyos-society-management-system.onrender.com`.
