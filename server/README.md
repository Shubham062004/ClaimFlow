# ClaimFlow Express Backend 🚀

Production-ready, scalable Express.js REST API for the **ClaimFlow** Healthcare Claims Management Platform. Built with TypeScript, Node.js, Express, MongoDB, Mongoose, and JWT Authentication following clean MVC architecture.

---

## 🛠 Tech Stack & Architecture

- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Database**: MongoDB & Mongoose ORM
- **Authentication**: JSON Web Tokens (JWT) & HTTP-only cookies
- **Security**: Bcryptjs password hashing, Helmet headers, CORS policies
- **Validation**: Express Validator & custom sanitizers
- **File Upload**: Multer (PDF, JPG, PNG up to 5MB)
- **Logging**: Morgan HTTP logger + custom structured logging
- **Language**: TypeScript

---

## 📁 Directory Structure

```text
server/
├── .env
├── .env.example
├── package.json
├── tsconfig.json
└── src/
    ├── config/
    │   ├── db.ts               # Mongoose connection & lifecycle handlers
    │   └── env.ts              # Validated environment configuration
    ├── types/
    │   ├── express.d.ts        # Extended Request interface (user payload)
    │   ├── user.types.ts       # User interface & Role enum ('Patient', 'Insurer', 'Admin')
    │   ├── claim.types.ts      # Claim interface & Status enum ('Pending', 'Approved', 'Rejected')
    │   └── api.types.ts        # Standardized API response DTOs & metrics interfaces
    ├── utils/
    │   ├── logger.ts           # Logger utility & Morgan HTTP middleware
    │   ├── apiError.ts         # Custom ApiError class with status codes
    │   ├── apiResponse.ts      # Standardized JSON response builder
    │   ├── asyncHandler.ts     # Async controller exception wrapper
    │   ├── jwtUtils.ts         # JWT token generator & validator
    │   └── hashUtils.ts        # Password hashing & comparison helpers
    ├── models/
    │   ├── user.model.ts       # Mongoose User Schema
    │   └── claim.model.ts      # Mongoose Claim Schema
    ├── validators/
    │   ├── auth.validator.ts   # Express Validator rules for authentication
    │   └── claim.validator.ts  # Express Validator rules for claim CRUD & patch
    ├── middleware/
    │   ├── validation.middleware.ts # Validation result extractor middleware
    │   ├── auth.middleware.ts       # JWT Bearer token & cookie verifier
    │   ├── role.middleware.ts       # RBAC authorization middleware
    │   ├── upload.middleware.ts     # Multer file storage & mime filter
    │   └── error.middleware.ts      # Global 404 & exception handling middleware
    ├── services/
    │   ├── auth.service.ts          # Authentication business logic
    │   ├── claim.service.ts         # Claims management & role scoping logic
    │   └── dashboard.service.ts     # Real-time analytics aggregation service
    ├── controllers/
    │   ├── health.controller.ts     # Health status check controller
    │   ├── auth.controller.ts       # Auth route controllers
    │   ├── claim.controller.ts      # Claims route controllers
    │   └── dashboard.controller.ts    # Dashboard analytics controller
    ├── routes/
    │   ├── health.routes.ts         # /api/health router
    │   ├── auth.routes.ts           # /api/auth router
    │   ├── claim.routes.ts          # /api/claims router
    │   ├── dashboard.routes.ts      # /api/dashboard router
    │   └── index.ts                 # Combined API router
    ├── uploads/                     # Storage directory for document uploads
    ├── app.ts                       # Express application configuration
    ├── server.ts                    # HTTP server entry point
    └── seed.ts                      # Database seeder script
```

---

## 📡 API Endpoints Reference

### Health
- `GET /api/health` — System status, MongoDB state, and server uptime.

### Authentication
- `POST /api/auth/register` — Register a new account (`Patient`, `Insurer`, `Admin`).
- `POST /api/auth/login` — Authenticate user credentials & receive JWT token.
- `GET /api/auth/me` — Retrieve logged-in user profile (*Auth required*).

### Healthcare Claims
- `POST /api/claims` — Submit new claim with optional file attachment (*Patient, Admin*).
- `GET /api/claims` — Fetch claims list (Patients view own claims; Insurers/Admins view all).
- `GET /api/claims/:id` — Get single claim details (*Auth required*).
- `PATCH /api/claims/:id` — Adjudicate claim (`status`, `approvedAmount`, `insurerComments`) (*Insurer, Admin*).

### Dashboard Analytics
- `GET /api/dashboard` — Fetch real-time dashboard stats & recent claims (*Auth required*).

---

## ⚡ Setup & Run

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment Variables**:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

3. **Seed Database with Demo Data**:
   Populate test accounts (`patient@claimflow.com`, `insurer@claimflow.com`, `admin@claimflow.com`) and sample claims:
   ```bash
   npm run seed
   ```

4. **Start Development Server**:
   ```bash
   npm run dev
   ```

5. **Build for Production**:
   ```bash
   npm run build
   npm start
   ```

---

## 📦 Recommended Backend NPM Packages

| Package | Category | Purpose |
| :--- | :--- | :--- |
| `express` | Core Framework | Minimalist web framework for building REST APIs |
| `mongoose` | Database ORM | Object Data Modeling (ODM) library for MongoDB |
| `jsonwebtoken` | Security | Implementation of JSON Web Tokens for auth state |
| `bcryptjs` | Security | Hashing user passwords securely using bcrypt |
| `multer` | File Handling | Multipart/form-data handler for medical document uploads |
| `express-validator` | Validation | Input sanitization & validation middleware |
| `helmet` | Security | Sets security HTTP headers to protect against common web vulnerabilities |
| `cors` | Security | Enables Cross-Origin Resource Sharing with configured origins |
| `morgan` | Logging | HTTP request logger middleware for node.js |
| `cookie-parser` | Parsing | Parse HTTP request cookies for token retrieval |
| `dotenv` | Configuration | Loads environment variables from `.env` file |
| `tsx` (Dev) | Tooling | Fast TypeScript execution & watch server for development |
| `typescript` (Dev) | Language | Static typing & compilation for Node.js |
