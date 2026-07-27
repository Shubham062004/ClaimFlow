# ClaimFlow Frontend 🎨

Modern, responsive web application for the **ClaimFlow** Healthcare Claims Management Platform. Built with React 19, Vite, TypeScript, Tailwind CSS, TanStack Query, React Router v7, and Framer Motion.

---

## 🛠 Tech Stack & Tools

- **Framework**: React 19 (Vite bundler)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 & Lucide Icons
- **State & Data Fetching**: TanStack Query (React Query v5) & Axios
- **Routing**: React Router v7
- **Forms & Validation**: React Hook Form & Zod
- **Animations**: Framer Motion
- **UI Notifications**: React Hot Toast

---

## 📁 Directory Structure

```text
src/
├── assets/                  # Static assets (images, logos, icons)
├── components/              # Shared reusable UI components
│   ├── common/              # Buttons, Cards, Inputs, Modals, Badges, Skeletons
│   ├── layout/              # Header, Sidebar, Footer components
│   └── claims/              # ClaimCard, ClaimTable, ClaimStatusBadge, FileUploader
├── hooks/                   # Custom React hooks (useAuth, useClaims, useDashboard)
├── layouts/                 # Route layouts (DashboardLayout, AuthLayout)
├── pages/                   # Page components
│   ├── auth/                # LoginPage, RegisterPage
│   ├── patient/             # PatientDashboard, SubmitClaimPage, MyClaimsPage
│   ├── insurer/             # InsurerDashboard, ReviewClaimPage
│   └── shared/              # LandingPage, NotFoundPage
├── services/                # API client & endpoint service methods
│   ├── api.ts               # Axios instance with interceptors
│   ├── authService.ts       # Auth API integration
│   └── claimService.ts      # Claim API integration
├── types/                   # TypeScript interfaces (User, Claim, API DTOs)
├── main.tsx                 # Application entry point
└── index.css                # Global CSS styles & Tailwind directives
```

---

## 🚀 Key Application Features

1. **Patient Portal**:
   - Interactive Claims Dashboard displaying claim status distribution.
   - Streamlined Claim Submission form with drag-and-drop file upload for medical bills/receipts.
   - Claim history timeline and detail view.

2. **Insurer Adjudication Dashboard**:
   - Real-time queue of pending healthcare claims.
   - Claim review modal with document preview, approval/rejection actions, approved amount calculation, and insurer comment logs.

3. **Role-Based Routing**:
   - Protected routes redirecting unauthorized users based on role (`Patient` vs `Insurer` / `Admin`).

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

3. **Start Vite Development Server**:
   ```bash
   npm run dev
   ```

4. **Build Production Distribution**:
   ```bash
   npm run build
   ```

---

## 📦 Recommended Frontend NPM Packages

| Package | Category | Purpose |
| :--- | :--- | :--- |
| `react` & `react-dom` | Core Framework | UI library for building component-based interfaces |
| `vite` | Build Tool | Next-generation frontend build tool & dev server |
| `@tanstack/react-query` | Data Fetching | Async state management, caching, background refetching |
| `axios` | HTTP Client | Promise-based HTTP client with request/response interceptors |
| `react-router-dom` | Routing | Declarative routing for single-page React applications |
| `react-hook-form` | Form State | Performant, flexible forms with easy validation integration |
| `zod` | Validation | TypeScript-first schema validation with type inference |
| `@hookform/resolvers` | Form Integration | Connects Zod schemas seamlessly with React Hook Form |
| `tailwindcss` | Styling | Utility-first CSS framework for rapid UI styling |
| `framer-motion` | Animations | Production-ready motion library for fluid UI animations |
| `lucide-react` | Icons | Beautiful & consistent icon set |
| `react-hot-toast` | UI Feedback | Lightweight toast notifications for user actions |
| `clsx` & `tailwind-merge` | Styling Utilities | Safely construct and merge dynamic Tailwind class names |
