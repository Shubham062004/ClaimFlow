# ClaimFlow Healthcare Claims Management Platform 🏥

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https.mit-license.org)
[![Node.js Version](https://img.shields.io/badge/Node.js-%3E%3D18.0.0-green.svg)](https://nodejs.org/)
[![React Version](https://img.shields.io/badge/React-19-61dafb.svg)](https://react.dev/)
[![Express Version](https://img.shields.io/badge/Express-4.21-000000.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248.svg)](https://www.mongodb.com/)

**ClaimFlow** is a production-ready, full-stack Healthcare Claims Management Platform designed to streamline claim submissions for patients and accelerate claims adjudication for health insurance providers. Built with a modern **React 19 + Vite** frontend and a robust **Express + MongoDB** backend adhering to clean MVC architecture and security best practices.

---

## ✨ Features

- 👤 **Role-Based Access Control (RBAC)**: Distinct workflows and permissions for **Patients**, **Insurers**, and **System Administrators**.
- 📄 **Digital Claim Submissions**: Drag-and-drop document upload (PDF, PNG, JPG) with file validation for medical bills and diagnosis reports.
- ⚡ **Real-Time Adjudication**: Insurers can review, approve, adjust payout amounts, or reject claims with detailed insurer comments.
- 📊 **Analytics Dashboard**: Dynamic metrics showing total claims count, pending queue status, total claimed value vs approved payout value.
- 🔒 **Enterprise-Grade Security**: JWT authentication (Bearer token & HTTP-only cookies), password hashing via Bcrypt, Helmet headers, CORS controls, and Express Validator input sanitization.
- ⚡ **Full TypeScript**: End-to-end type safety across both frontend components and backend services.

---

## 🏛 Architecture Overview

```text
ClaimFlow Repository Root
├── src/                      # React 19 + Vite + TypeScript Frontend
├── server/                   # Express.js + Node.js + MongoDB Backend
├── .env.example              # Frontend environment template
├── CONTRIBUTING.md           # Contribution guidelines & branching model
├── LICENSE                   # MIT Open Source License
└── README.md                 # Primary project documentation
```

---

## 📁 Folder Structure Documentation

### Repository Layout
```text
ClaimFlow/
├── .env                      # Local environment variables for frontend
├── .env.example              # Template environment variables for frontend
├── .gitignore                # Comprehensive Git ignore rules for root, client & server
├── CONTRIBUTING.md           # Contribution & Git commit guidelines
├── LICENSE                   # MIT License
├── package.json              # Root package with monorepo npm scripts
├── README.md                 # Primary repository documentation
├── src/                      # Frontend Application (React 19 + Vite)
│   ├── assets/               # Images, icons, static branding
│   ├── components/           # UI design system & claim components
│   │   ├── common/           # Buttons, Badges, Modals, Inputs, Skeletons
│   │   ├── layout/           # Header, Sidebar, Footer components
│   │   └── claims/           # ClaimCard, ClaimTable, FileUploader
│   ├── hooks/                # Custom React hooks (useAuth, useClaims)
│   ├── layouts/              # Page layout wrappers (DashboardLayout)
│   ├── pages/                # Application routes & views
│   │   ├── auth/             # Login & Register views
│   │   ├── patient/          # Submit claim & patient dashboard
│   │   ├── insurer/          # Adjudication & review views
│   │   └── shared/           # Landing page & 404 handler
│   ├── services/             # Axios API client & service endpoints
│   ├── types/                # Frontend TypeScript type declarations
│   └── README.md             # Frontend specific documentation
└── server/                   # Backend Application (Express + Mongoose)
    ├── .env                  # Backend environment variables
    ├── .env.example          # Backend environment variable template
    ├── package.json          # Backend dependencies & scripts
    ├── tsconfig.json         # TypeScript compiler configuration
    ├── README.md             # Backend specific documentation
    └── src/
        ├── config/           # Database connection & env validation
        ├── controllers/      # Route controllers (Health, Auth, Claims, Dashboard)
        ├── middleware/       # Auth, RBAC, Multer upload, Validation & Error handlers
        ├── models/           # Mongoose User & Claim models
        ├── routes/           # REST API routes (/api/auth, /api/claims, /api/dashboard)
        ├── services/         # Core business logic services
        ├── validators/       # Express Validator schemas
        ├── utils/            # JWT, Bcrypt, Logger & ApiError utilities
        ├── types/            # Backend TypeScript types & Express request extensions
        ├── uploads/          # Physical file storage for uploaded documents
        ├── app.ts            # Express application setup
        ├── server.ts         # Server entry point & graceful shutdown
        └── seed.ts           # Database seeder script
```

---

## 🛠 Prerequisites

Before starting, ensure you have the following installed on your local machine:
- **Node.js**: `v18.0.0` or higher ([Download Node.js](https://nodejs.org/))
- **MongoDB**: `v6.0` or higher running locally on port `27017` or a MongoDB Atlas URI ([Download MongoDB](https://www.mongodb.com/try/download/community))
- **npm**: `v9.0.0` or higher (comes with Node.js)

---

## 📥 Installation & Setup Guide

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/ClaimFlow.git
cd ClaimFlow
```

### 2. Configure Environment Variables

#### Frontend Configuration:
Copy `.env.example` in the root directory to `.env`:
```bash
cp .env.example .env
```
Default `.env` contents:
```env
VITE_APP_NAME="ClaimFlow"
VITE_API_BASE_URL="http://localhost:5000/api"
```

#### Backend Configuration:
Copy `server/.env.example` to `server/.env`:
```bash
cp server/.env.example server/.env
```
Default `server/.env` contents:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/claimflow
JWT_SECRET=supersecretjwtkeyforclaimflowhealthcareplatform2026
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173,http://localhost:3000
UPLOAD_DIR=src/uploads
```

### 3. Install Dependencies
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server && npm install && cd ..
```

### 4. Seed Database with Demo Accounts
Populate MongoDB with default accounts (`patient@claimflow.com`, `insurer@claimflow.com`, `admin@claimflow.com`) and sample claims:
```bash
npm run seed:server
```

---

## 💻 Scripts Reference

| Command | Location | Description |
| :--- | :--- | :--- |
| `npm run dev` | Root | Starts Vite React frontend on `http://localhost:5173` |
| `npm run dev:server` | Root | Starts Express backend in watch mode on `http://localhost:5000` |
| `npm run build` | Root | Builds production bundle for React frontend |
| `npm run build:server` | Root | Compiles backend TypeScript code into `server/dist` |
| `npm run seed:server` | Root | Runs database seeder script to populate initial users & claims |
| `npm run dev` | `server/` | Starts backend development server directly |
| `npm run build` | `server/` | Compiles backend server code directly |
| `npm run seed` | `server/` | Runs seeder directly inside `server/` |

---

## 📦 Recommended NPM Packages Overview

### 🎨 Frontend Recommended Packages

| Package | Purpose | Why It's Recommended |
| :--- | :--- | :--- |
| `react` & `react-dom` | Core UI Library | Standard declarative UI framework |
| `vite` | Dev Server & Bundler | Lightning-fast HMR and optimized production builds |
| `@tanstack/react-query` | Server State | Automatic caching, refetching, and query synchronization |
| `axios` | HTTP Requests | Interceptors for JWT auth headers and error handling |
| `react-router-dom` | Client Routing | Declarative nested routing & protected route guards |
| `react-hook-form` | Form State | Uncontrolled form handling with optimal render performance |
| `zod` | Validation | Type-safe schema validation matching backend DTOs |
| `@hookform/resolvers` | Integration | Connects Zod validation rules directly to React Hook Form |
| `tailwindcss` | Styling | Utility-first CSS framework for custom responsive design |
| `framer-motion` | Motion / Animation | Smooth micro-interactions and modal transitions |
| `lucide-react` | Icons | Modern, lightweight icon suite |
| `react-hot-toast` | UI Notifications | Accessible toast alerts for user feedback |
| `clsx` & `tailwind-merge` | Class Merging | Prevents Tailwind utility class precedence conflicts |

### ⚙️ Backend Recommended Packages

| Package | Purpose | Why It's Recommended |
| :--- | :--- | :--- |
| `express` | Web Framework | Industry-standard web application framework for Node.js |
| `mongoose` | MongoDB ORM | Schema enforcement, validation hooks, and virtual mappings |
| `jsonwebtoken` | Auth Security | Stateless authentication token issuing & verification |
| `bcryptjs` | Password Security | Secure adaptive salt-hashing for user passwords |
| `multer` | File Uploads | Multipart form-data handling for medical bill attachment storage |
| `express-validator` | Request Validation | Sanitizes and validates request parameters prior to controller logic |
| `helmet` | HTTP Security | Mitigates XSS, clickjacking, and header security risks |
| `cors` | Cross-Origin Access | Restricts API access to authorized frontend origins |
| `morgan` | Request Logging | Standardized HTTP request logging |
| `cookie-parser` | Cookie Parsing | Reads authentication cookies from HTTP requests |
| `dotenv` | Configuration | Environment variable management |
| `tsx` (Dev) | Execution Tooling | Fast TypeScript watch & execution without manual build steps |

---

## 📝 Commit Message Convention

ClaimFlow enforces **[Conventional Commits Specification](https://www.conventionalcommits.org/)**:

```text
<type>(<scope>): <description>

Examples:
  feat(claims): add PDF drag-and-drop document uploader
  fix(auth): fix password validation edge case on registration
  docs(readme): add installation guide and npm package tables
  refactor(services): extract dashboard aggregation query into service
```

---

## 🤝 Contribution Guidelines

Please read [CONTRIBUTING.md](file:///c:/Users/shubh/OneDrive/Desktop/Projects/ClaimFlow/CONTRIBUTING.md) for details on our code of conduct, branching strategy, and the pull request process.

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](file:///c:/Users/shubh/OneDrive/Desktop/Projects/ClaimFlow/LICENSE) file for details.