# Society Maintenance Tracker Requirements

## Source Documents
- `Society_Maintenance_Tracker.pdf`
- `Assignment Submission Usage Guidelines.pdf`

## Objective
Build a web platform for apartment societies where residents can submit and track maintenance complaints with optional photos, while administrators manage complaint lifecycle, priorities, overdue complaints, notices, email updates, and dashboard reporting.

## Functional Requirements
- Residents can register with name, email, and password.
- Residents and admins can log in with JWT-based authentication.
- Passwords must be securely hashed.
- Backend must enforce role-based access for resident and admin capabilities.
- Residents can create complaints with category, description, and optional photo.
- New complaints start as `Open` with default `Low` priority.
- Residents can view only their own complaints.
- Residents can open complaint details and see full history.
- Admins can view all complaints.
- Admins can filter complaints by category, status, date range, and priority.
- Admins can update complaint status through `Open`, `In Progress`, and `Resolved`.
- Admins can update complaint priority as `Low`, `Medium`, or `High`.
- Every admin status or priority change creates a history entry with timestamp, actor, old/new values, and optional note.
- Resolved complaints are closed and cannot be edited further.
- Complaints older than a configurable threshold and not resolved are treated as overdue.
- Overdue complaints appear first in the admin list and are visually flagged.
- Admins can create notices with title, content, and important flag.
- Important notices are pinned above regular notices.
- All logged-in users can view notices.
- Residents receive email notifications when their complaint status changes.
- Residents receive email notifications when an important notice is posted.
- Admin dashboard shows counts by status, category, and overdue complaints.

## Non-Functional Requirements
- Use React, Vite, Tailwind CSS, React Router, and Axios for the frontend.
- Use Node.js, Express.js, MongoDB, Mongoose, JWT, bcrypt, and JavaScript for the backend.
- Use npm as the package manager.
- Keep frontend and backend separated.
- Follow modular backend structure: config, controllers, routes, models, middleware, services, utils.
- Follow modular frontend structure: api, components, context, layouts, pages, routes, utils.
- Use RESTful API design and proper HTTP status codes.
- Validate input and uploaded files.
- Handle invalid input, unauthorized access, forbidden access, missing resources, duplicate data, database failures, and network failures gracefully.
- Use environment variables for secrets and configuration.
- Do not commit `.env`, `node_modules`, build artifacts, or editor files.
- Keep dependencies minimal and assignment-focused.
- Provide accessible, responsive, professional dashboard UI with consistent spacing, labels, loading indicators, validation messages, and error states.
- Use semantic HTML and meaningful alt text.

## Deliverables
- Complete source code.
- `README.md` with setup guide, environment variables, frontend/backend run commands, project structure, API docs, database schema, assumptions, and implemented features.
- `.env.example` files.
- `SYSTEM_DESIGN.md` under 800 words covering complaint history, overdue detection, photo handling, and notification flow.
- Clean repository suitable for GitHub submission on `main`.

## Engineering Assumptions
- MongoDB connection string is supplied through `MONGODB_URI`.
- Admin users are created through a seed script using `ADMIN_NAME`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD`.
- Local file upload storage under backend `uploads/` is acceptable for assignment delivery; production can replace it with cloud object storage.
- Email uses SMTP through `nodemailer`; in development or missing SMTP configuration, emails are logged instead of sent.
- HTTPS is handled by deployment platform or reverse proxy.
- The UI is English-only.
- Account deletion is out of scope because it is not a core assignment requirement.
