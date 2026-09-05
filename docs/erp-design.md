# Student ERP System — Implementation Plan & Design Doc

Project: **SERP** — Basic Student ERP System
Stack: **Node.js (ESM) + Express + MongoDB/Mongoose** on the server, **Vite + React** on the client.

---

## 1. Current State (As of Audit)

### ✅ Completed
| Component | File | Status |
|---|---|---|
| Express server | `server.js` | Runs on port `3000`; `clerkMiddleware()` applied globally |
| MongoDB connection | `config/db.js` | Connects using `MONGO_URI` from `.env` |
| User model | `models/user.model.js` | Mongoose schema with `clerkId`, `email`, `name`, `role`, `studentId`, `faculty` |
| Auth middleware | `middleware/clerkAuth.js` | Exports `requireAuth()` from `@clerk/express` |
| Webhook route | `routes/webhook.js` | POST `/api/webhook/clerk` stub (returns `{"recived": true}`) |
| Environment | `.env` | Has Clerk keys + `MONGO_URI` |
| Documentation | `docs/clerk-auth-setup.md` / `.pdf` | Clerk setup guide (ESM version) |

### ⚠️ Outstanding Auth Issues
| # | Issue | File | Fix |
|---|---|---|---|
| 1 | **Import order bug** — `connectDB()` called before `dotenv.config()` in `server.js:7-9`. Works only because `db.js` has its own `dotenv.config()`. Fix: move `dotenv.config()` to top of `server.js` before all imports. | `server.js` | Reorder |
| 2 | **Webhook stub** — no signature verification, no user sync to MongoDB. | `routes/webhook.js` | Implement `verifyWebhookSignature()` using `@clerk/express` webhook utilities |
| 3 | **Typo** — `"recived"` → `"received"` | `routes/webhook.js:line 8` | Fix string |
| 4 | **Typo in env** — `CLERK_WHEBHOOK_SECRET` → `CLERK_WEBHOOK_SECRET` | `.env` | Rename variable |
| 5 | **Duplicate key** — `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` + `CLERK_PUBLISHABLE_KEY` both present | `.env` | Remove `NEXT_PUBLIC_` client-side prefix from server env |
| 6 | **Incomplete auth middleware** — only wraps `requireAuth()`, no role-check or DB user attachment | `middleware/clerkAuth.js` | Add `protect` (with `User.findOne`) and `authorize(...roles)` as documented |

### 📋 Client (Frontend)
- `client/` directory is **empty** — no `package.json`, no React app initialized.

---

## 2. Feature Roadmap & Order

| Priority | Feature | Backend Work | Frontend Work |
|---|---|---|---|
| **P0** | Fix auth (issues 1–6 above) | — | — |
| **P1** | **Feature 1: Course & Schedule Mgmt** | Course API + Schema | Courses page, timetable view |
| **P2** | **Feature 2: Assignment & Grade Tracker** | Assignment + Grade API | Assignments page, GPA calculator |
| **P3** | **Feature 3: Document Storage Hub** | File upload API (Multer + local or Cloudinary) | File library UI |
| **P4** | **Feature 4: Student Dashboard** | Dashboard aggregation endpoint | Dashboard page with cards |
| **P5** | **Feature 5: Study Analytics & Reminders** | Analytics + notification endpoints | Charts (Chart.js), reminder settings |

---

## 3. Project Structure (Planned)

### Backend (`server/`)
```
server/
├── server.js                        # Entry: express app, middleware, route mounting
├── config/
│   └── db.js                        # MongoDB connection
├── middleware/
│   ├── clerkAuth.js                 # protect + authorize(role) wrappers
│   └── upload.js                    # Multer config (F3 — file uploads)
├── models/
│   ├── User.js                      # (exists) Clerk-linked user profile
│   ├── Course.js                    # (F1) Course definition
│   ├── Schedule.js                  # (F1) Weekly timetable / exam dates
│   ├── Assignment.js                # (F2) Assignment deadlines
│   ├── Grade.js                     # (F2) Grade records
│   └── Document.js                  # (F3) File metadata
├── routes/
│   ├── webhook.js                   # (exists) Clerk webhook endpoint
│   ├── auth.js                      # GET /me, user profile
│   ├── courses.js                   # (F1) CRUD courses, schedules
│   ├── assignments.js               # (F2) CRUD assignments, grades
│   ├── documents.js                 # (F3) Upload, list, delete files
│   └── dashboard.js                 # (F4) Aggregated dashboard data
├── controllers/                     # Business logic per feature
│   ├── courseController.js
│   ├── assignmentController.js
│   ├── documentController.js
│   └── dashboardController.js
└── utils/
    ├── gpaCalculator.js             # (F2) Weighted GPA computation
    └── notificationService.js       # (F5) Email/browser alert scheduler
```

### Frontend (`client/`)
```
client/
├── index.html
├── package.json                     # Vite + React + @clerk/clerk-react
├── src/
│   ├── main.jsx                     # Root: ClerkProvider
│   ├── App.jsx                      # Routes: ClerkAuth routes + protected pages
│   ├── routes/
│   │   ├── AuthRoutes.jsx           # SignIn / SignUp wrappers
│   │   └── ProtectedRoute.jsx       # Wraps <SignedIn> for authenticated pages
│   ├── pages/
│   │   ├── Dashboard.jsx            # (F4) Central dashboard
│   │   ├── Courses.jsx              # (F1) Course list + timetable
│   │   ├── CourseForm.jsx           # (F1) Add/edit course
│   │   ├── Assignments.jsx          # (F2) Assignment list + status
│   │   ├── AssignmentForm.jsx       # (F2) Add/edit assignment
│   │   ├── Grades.jsx               # (F2) Grade view + GPA
│   │   ├── Documents.jsx            # (F3) File library
│   │   └── Analytics.jsx            # (F5) Charts + reminders
│   ├── components/
│   │   ├── Timetable.jsx            # (F1) Weekly grid
│   │   ├── AssignmentCard.jsx       # (F2) Deadline card with status
│   │   ├── GradeChart.jsx           # (F5) Chart.js grade trends
│   │   └── FileUploader.jsx         # (F3) Drag-drop upload
│   ├── hooks/
│   │   └── useApi.js                # Centralized fetch wrapper (adds auth token)
│   ├── services/
│   │   └── api.js                   # axios/fetch interceptor with Clerk token
│   └── styles/
```

---

## 4. Feature Specifications

### Feature 1 — Course and Schedule Management

#### Data Model: `Course`
```
{
  _id: ObjectId,
  courseCode: String,     // e.g. "CS101"
  title: String,          // e.g. "Intro to Computer Science"
  credits: Number,        // e.g. 3
  description: String,
  faculty: String,        // teacher/instructor name
  semester: String,       // e.g. "Fall 2025"
  user: ObjectId → User,  // owner (teacher who created it)
  students: [ObjectId → User],  // enrolled students
  createdAt, updatedAt
}
```

#### Data Model: `Schedule`
```
{
  _id: ObjectId,
  course: ObjectId → Course,
  dayOfWeek: Number,      // 1=Monday ... 7=Sunday
  startTime: String,      // "09:00"
  endTime: String,        // "10:30"
  location: String,       // room/building
  scheduleType: String,   // "lecture" | "lab" | "tutorial"
}
```

#### Data Model: `ExamDate`
```
{
  _id: ObjectId,
  course: ObjectId → Course,
  date: Date,
  startTime: String,
  endTime: String,
  location: String,
  description: String,
}
```

#### API Endpoints
| Method | Path | Auth | Purpose |
|---|---|---|---|
| `GET` | `/api/courses` | Student/Teacher | List courses for current user |
| `GET` | `/api/courses/:id` | Student/Teacher | Get course + schedule + exams |
| `POST` | `/api/courses` | Teacher/Admin | Create course |
| `PUT` | `/api/courses/:id` | Teacher/Admin | Edit course |
| `DELETE` | `/api/courses/:id` | Teacher/Admin | Delete course |
| `POST` | `/api/courses/:id/schedule` | Teacher | Add class slot |
| `GET` | `/api/schedules` | Student | Get user's weekly timetable |
| `POST` | `/api/courses/:id/exams` | Teacher | Add exam date |

#### Frontend Pages
- **Courses page** — table of courses with filters by semester
- **Course detail page** — shows schedule grid, exam dates, enrolled students
- **Course form** — add/edit modal or page

---

### Feature 2 — Assignment and Grade Tracker

#### Data Model: `Assignment`
```
{
  _id: ObjectId,
  course: ObjectId → Course,
  title: String,
  description: String,
  dueDate: Date,
  totalMarks: Number,
  status: String,         // "not_started" | "in_progress" | "submitted" | "graded"
  assignedTo: [ObjectId → User],
  createdBy: ObjectId → User,
  createdAt, updatedAt
}
```

#### Data Model: `Grade`
```
{
  _id: ObjectId,
  assignment: ObjectId → Assignment,
  student: ObjectId → User,
  course: ObjectId → Course,
  marksObtained: Number,
  totalMarks: Number,
  grade: String,          // "A", "B+", etc. or null if not graded
  gradedBy: ObjectId → User,
  gradedAt: Date,
  createdAt, updatedAt
}
```

#### API Endpoints
| Method | Path | Auth | Purpose |
|---|---|---|---|
| `GET` | `/api/assignments` | Student/teacher | List assignments (filtered by role) |
| `GET` | `/api/assignments/:id` | Student/Teacher | Assignment detail + submissions |
| `POST` | `/api/assignments` | Teacher | Create assignment |
| `PUT` | `/api/assignments/:id` | Teacher | Edit assignment |
| `DELETE` | `/api/assignments/:id` | Teacher | Delete assignment |
| `POST` | `/api/assignments/:id/submit` | Student | Submit assignment (status change) |
| `POST` | `/api/grades` | Teacher | Record grade for assignment |
| `GET` | `/api/grades?course=:id` | Student/Teacher | View grades for a course |
| `GET` | `/api/grades/gpa` | Student | Calculate current GPA |

#### GPA Calculation Logic
- Each course has `credits` (from Course model).
- Grade points mapping: A=4.0, A-=3.7, B+=3.3, B=3.0, etc.
- GPA = Σ(grade_points × credits) / Σ(credits)

#### Frontend Pages
- **Assignments page** — list with due dates, status badges
- **Assignment form** — create/edit assignment (teacher)
- **Grades page** — grade table per course, GPA summary card

---

### Feature 3 — Document Storage Hub

#### Storage Strategy Options
| Option | Pros | Cons |
|---|---|---|
| **Local disk (Multer)** | No external dependency, simple | Doesn't scale, not suitable for multi-server deployment, files lost on server reset |
| **Cloudinary** | Handles PDF, DOCX, image; CDN; free tier | External service, migration to another provider = data migration |
| **AWS S3** | Industry standard, durable | Costs, more setup complexity |

**Recommendation:** Start with **local disk storage** using Multer for MVP. Switch to Cloudinary later by only changing the upload utility — keep file metadata in MongoDB either way.

#### Data Model: `Document`
```
{
  _id: ObjectId,
  user: ObjectId → User,
  title: String,
  filename: String,        // original name
  storedAs: String,        // server filename / cloud URL
  path: String,            // server path or cloud URL
  size: Number,            // bytes
  mimetype: String,        // "application/pdf", "application/msword", etc.
  course: ObjectId → Course,  // optional link to course
  tags: [String],          // e.g. ["syllabus", "notes", "assignment"]
  uploadedAt, updatedAt
}
```

#### API Endpoints
| Method | Path | Auth | Purpose |
|---|---|---|---|
| `GET` | `/api/documents` | Any user | List user's documents (filter by tag/course) |
| `POST` | `/api/documents/upload` | Any user | Upload one or more files (multipart/form-data) |
| `GET` | `/api/documents/:id` | Owner/Admin | Get document metadata + download URL |
| `GET` | `/api/documents/:id/download` | Owner/Admin | Stream file to client |
| `DELETE` | `/api/documents/:id` | Owner/Admin | Delete file + metadata |
| `PUT` | `/api/documents/:id` | Owner | Update title/tags/course |

#### Frontend Pages
- **Documents page** — grid/list view with preview icons, search by tag
- **FileUploader component** — drag-drop zone, supports PDF, DOCX, images

---

### Feature 4 — Student Dashboard

#### API Endpoints
| Method | Path | Auth | Purpose |
|---|---|---|---|
| `GET` | `/api/dashboard` | Any user | Aggregated dashboard data |
| `GET` | `/api/dashboard/today` | Any user | Today's classes (from Schedule) |
| `GET` | `/api/dashboard/deadlines` | Any user | Next 3 urgent assignment deadlines |
| `GET` | `/api/dashboard/recent-grades` | Any user | Last 5 graded assignments |

**Dashboard response shape:**
```json
{
  "todayClasses": [{ "course": "CS101", "time": "09:00-10:30", "location": "Room 101" }],
  "urgentDeadlines": [{ "title": "Math HW", "dueDate": "...", "course": "MATH201" }],
  "recentGrades": [{ "course": "CS101", "assignment": "Project 1", "grade": "A-", "date": "..." }],
  "quickAccessDocuments": [{ "title": "Syllabus", "id": "..." }]
}
```

#### Frontend Pages
- **Dashboard page** — card-based layout: Today's Classes, Urgent Deadlines, Recent Grades, Quick Access to Docs

---

### Feature 5 — Study Analytics and Reminders (Nice-to-have)

#### Sub-feature 5a: Analytics
- **Data source:** Assignment + Grade data from Features 1 & 2.
- **Charts to show:**
  - Grade trends over time (line chart)
  - Assignment completion rate (bar chart)
  - Course-wise GPA breakdown (pie/bar chart)

#### Data Model: None required
- Analytics computed at request time from `Assignment` and `Grade` collections.

#### API Endpoints
| Method | Path | Auth | Purpose |
|---|---|---|---|
| `GET` | `/api/analytics/grades` | Student | Grade trend data for charts |
| `GET` | `/api/analytics/completion` | Student | Assignment completion stats |
| `GET` | `/api/analytics/gpa-by-course` | Student | GPA breakdown per course |

#### Sub-feature 5b: Reminders
- **Email notifications:** Use `nodemailer` with SMTP or a service like Resend/SendGrid.
- **Browser notifications:** Frontend `Notification` API + service worker (optional).
- **Scheduler:** `node-cron` or a background loop to check upcoming deadlines daily.

#### Logic
```
Daily check (cron):
  For each student:
    Find assignments due in next 24h, 72h
    If due date has a reminder flag:
      Send email: "Assignment X is due on <date>"
```

#### Frontend Pages
- **Analytics page** — Chart.js visualizations
- **Reminders settings page** — toggle email notifications, set advance notice hours

---

## 5. Cross-Cutting Concerns

### Authentication & Authorization
- All routes except `/` (health) and `/api/webhook/clerk` require a valid Clerk session.
- Role hierarchy: `admin` > `teacher` > `student`.
- `admin` can manage all courses/assignments; `teacher` can manage courses they own; `student` has read access to enrolled courses.

### API Client (Frontend)
- Centralized `api.js` using `fetch` with a Clerk token interceptor:
  ```js
  const token = await getToken();
  fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  ```

### Error Handling
- All API routes wrapped in try/catch.
- 401: No token / invalid session.
- 403: Authenticated but role doesn't have permission.
- 404: Resource not found.
- 400: Validation error (missing required fields).

### CORS
- Configure in `server.js` — allow `CLIENT_URL` (client dev origin).
  ```js
  app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
  ```

### Environment Variables Checklist
```env
# Clerk
CLERK_SECRET_KEY=sk_...
CLERK_WEBHOOK_SECRET=whsec_...       # FIX typo

# MongoDB
MONGO_URI=mongodb+srv://...

# Server
PORT=3000
CLIENT_URL=http://localhost:5173

# (F5) Optional notification service
SMTP_HOST=smtp.resend.com
SMTP_USER=...
SMTP_PASS=...
```

---

## 6. Implementation Order (Step-by-Step)

### Phase 0: Auth Finishing Touches
1. Fix import order: move `dotenv.config()` to top of `server.js` before all imports.
2. Fix `.env`: rename `CLERK_WHEBHOOK_SECRET` → `CLERK_WEBHOOK_SECRET`, remove duplicate publishable key.
3. Fix `user.model.js` schema is already clean (the `faculty:` fix was applied).
4. Complete `middleware/clerkAuth.js` — add `protect` and `authorize` functions with MongoDB user lookup.
5. Complete `routes/webhook.js` — verify webhook signature, create/update/delete User documents.
6. Fix `webhook.js` typo: `"recived"` → `"received"`.
7. Add CORS middleware to `server.js`.

### Phase 1: Course & Schedule Management (Feature 1)
1. Create `server/models/Course.js`, `Schedule.js`, `ExamDate.js`.
2. Create `server/controllers/courseController.js` — CRUD + schedule + exams.
3. Create `server/routes/courses.js` — protected routes.
4. Mount routes in `server.js`: `app.use("/api/courses", courseRoutes);`
5. Initialize `client/` with Vite + React + Clerk.
6. Create frontend pages: `Courses.jsx`, `CourseForm.jsx`.

### Phase 2: Assignment & Grade Tracker (Feature 2)
1. Create `server/models/Assignment.js`, `Grade.js`.
2. Create `server/controllers/assignmentController.js` — CRUD + submit + grade + GPA.
3. Create `server/routes/assignments.js`, `routes/grades.js`.
4. Create `server/utils/gpaCalculator.js`.
5. Frontend: `Assignments.jsx`, `AssignmentForm.jsx`, `Grades.jsx`.

### Phase 3: Document Storage Hub (Feature 3)
1. Install `multer` in server.
2. Create `server/middleware/upload.js` — Multer config.
3. Create `server/models/Document.js`.
4. Create `server/controllers/documentController.js` — upload, list, download, delete.
5. Create `server/routes/documents.js`.
6. Frontend: `Documents.jsx`, `FileUploader.jsx`.

### Phase 4: Student Dashboard (Feature 4)
1. Create `server/controllers/dashboardController.js`.
2. Create `server/routes/dashboard.js`.
3. Frontend: `Dashboard.jsx`.

### Phase 5: Study Analytics & Reminders (Feature 5)
1. Create `server/controllers/analyticsController.js`.
2. Create `server/routes/analytics.js`.
3. Install `nodemailer` + `node-cron` (or use `resend`/`sendgrid`).
4. Create `server/utils/notificationService.js`.
5. Frontend: `Analytics.jsx` (with Chart.js), reminders settings.

---

## 7. Tech Stack Summary

| Layer | Choice | Rationale |
|---|---|---|
| **Backend** | Express (ESM) | Already set up |
| **Database** | MongoDB + Mongoose | Already set up |
| **Auth** | Clerk | Already set up |
| **File Upload** | Multer (local) → Cloudinary (future) | Multer is simple, swap out later |
| **Frontend** | React + Vite | Fast dev, ESM-native |
| **Frontend Auth** | `@clerk/clerk-react` | Official Clerk React SDK |
| **Charts** | `recharts` | Works well with React, no heavy deps |
| **HTTP Client** | `fetch` (built-in) | No axios dependency needed |
| **Notifications** | `nodemailer` (SMTP) or `resend` | Simple email sending |
| **Scheduling** | `node-cron` | Run daily reminder checks |

---

## 8. API Response Conventions

```json
// Success
{
  "success": true,
  "data": { ... },
  "message": "Operation completed"
}

// Error
{
  "success": false,
  "error": "Not found",
  "message": "Course with id xyz not found"
}
```

All protected endpoints respond `401` when no valid Clerk session is present, `403` when the session is valid but the role is insufficient.

---

## 9. Open Questions / Decisions Needed

| # | Question | Options | Recommendation |
|---|---|---|---|
| 1 | File storage backend for documents? | Local disk vs Cloudinary vs S3 | Start with local disk (Multer) |
| 2 | Grade scale format? | Letter grades (A-F) vs numeric (0-100) | Support both — numeric marks, derived letter grade |
| 3 | Email provider for reminders? | SMTP vs Resend vs SendGrid | Start with Resend (good free tier) |
| 4 | Timetable display format? | Weekly grid vs list view | Weekly grid (Mon–Sun columns) |
| 5 | User enrollment model? | Teachers create courses, students join via code | Auto-enroll students who created the course as "teacher", students self-enroll via course code |

---

*Generated: 2026-09-05*
*Status: Planning phase — no implementation code written per project requirements.*