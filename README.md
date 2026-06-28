# Task Management System

An enterprise-grade, highly polished, production-ready full-stack Task Management System. This repository features a modern React Single Page Application (SPA) styled with Tailwind CSS, interacting with a secure Node.js & Express RESTful API utilizing cryptographically signed JSON Web Tokens (JWT) for authentication.

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](#)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![React Version](https://img.shields.io/badge/react-v19.0.1-blue.svg)](#)
[![Vite Version](https://img.shields.io/badge/vite-v6.2.3-purple.svg)](#)

---

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Key Features](#-key-features)
- [Technologies Used](#-technologies-used)
- [Folder Structure](#-folder-structure)
- [Folder Explanations](#-folder-explanations)
- [Installation & Quick Start](#-installation--quick-start)
- [Environment Variables](#-environment-variables)
- [Running Locally](#-running-locally)
- [Running with Docker](#-running-with-docker)
- [API Integration & Axios Interceptors](#-api-integration--axios-interceptors)
- [Authentication Flow](#-authentication-flow)
- [Routing Design](#-routing-design)
- [Deployment Guide](#-deployment-guide)
- [Screenshots & Demo Instructions](#-screenshots--demo-instructions)
- [Future Improvements](#-future-improvements)
- [Testing Checklist](#-testing-checklist)
- [Author](#-author)

---

## 🔍 Project Overview

This Task Management System provides organizations with a secure, responsive, and lightweight workspace to catalog, assign, prioritize, and monitor work status updates. It avoids the typical "todo list" clichés by establishing high-performance sorting engines, granular status state filters, search indexing, and deep dashboard analytics.

---

## ✨ Key Features

- **JWT Authentication Flow**: Seamless login, registration, auto-session restoration, and token expiration handling.
- **Axios API Client**: Global request interceptor to append authorization tokens automatically.
- **Analytics Dashboard**: Dynamic completion ratios, urgent tracking counters, and recent task pipelines.
- **Search & Filter Controls**: Debounced title searching paired with multi-parameter select filtering (status/priority).
- **High-Performance Sorting**: Toggle fields dynamically (Created Date, Due Date, Priority, Title) across ascending and descending orders.
- **Framer Motion Transitions**: Clean micro-animations, loading loaders, and page routing transitions.
- **Fully Responsive**: Desktop-first precision adapting seamlessly to mobile screen ratios.
- **Dockerized Ready**: Optimized Dockerfile and Docker Compose files for lightning-fast environment setups.

---

## 🛠️ Technologies Used

### Frontend Client
- **React 19 (Latest)**: Modern hooks, context, and state managers.
- **Vite 6**: Fast bundling, server routing.
- **Tailwind CSS v4**: Utility-first styling engine.
- **Lucide Icons**: Unified clean iconography.
- **Framer Motion**: Smooth modal transitions and page animations.
- **Axios**: HTTP request coordinator.

### Backend Server
- **Node.js**: Underlying runtime.
- **Express.js**: REST routing middleware.
- **Crypto Module**: PBKDF2 cryptography for secure password salting/hashing and HMAC-SHA256 for token verification.
- **JSON Persistent DB**: Local atomic filesystem database.

---

## 📂 Folder Structure

```text
Task-Manager-Frontend/
├── .env.example              # Template for secret declarations
├── .gitignore                # Target directories for git tracking exclusion
├── .dockerignore             # List of files to omit from docker build stages
├── Dockerfile                # Production multi-stage node builder
├── docker-compose.yml        # Compose orchestration file
├── nginx.conf                # Nginx SPA history route router
├── package.json              # Dependency manifest
├── server.ts                 # Full Express + Vite dev server entry
├── index.html                # Main html wrapper template
├── tsconfig.json             # TypeScript rules definition
├── vite.config.ts            # Vite compiler configuration
└── src/
    ├── main.tsx              # React mounting root
    ├── App.tsx               # Main routes mapper and provider wrapper
    ├── index.css             # Tailwind v4 import, fonts and custom styles
    ├── types.ts              # Global type safety declarations
    ├── assets/               # Branding assets and logos
    ├── components/           # Reusable generic UI elements
    │   ├── Navbar.tsx        # Profile badge and logout triggers
    │   ├── Footer.tsx        # Basic attribution footer
    │   ├── Loader.tsx        # High fidelity loading spinner
    │   ├── TaskCard.tsx      # Individual list card and quick action controls
    │   ├── SearchBar.tsx     # Debounced input search bar
    │   ├── FilterComponent.ts# Dropdown filter parameters
    │   ├── SortDropdown.tsx  # Dynamic sort-by toggle
    │   ├── PaginationComponent.tsx # Page selection with range statistics
    │   └── DeleteConfirmationModal.tsx # Confirm deletes overlay
    ├── layouts/              # Screen containers
    │   ├── AuthLayout.tsx    # Single centered card layout
    │   └── DashboardLayout.tsx # Navigation and global body bounds
    ├── routes/               # Routing shields
    │   ├── ProtectedRoute.tsx # Shielding pages from anonymous lookups
    │   └── PublicRoute.tsx   # Redirecting authenticated users from login/register
    ├── services/             # API clients
    │   └── api.ts            # Reusable Axios instance with JWT interceptors
    ├── context/              # Context API stores
    │   ├── AuthContext.tsx   # User registration, login, and session persistence
    │   ├── TaskContext.tsx   # Tasks list, statistics, details, and CRUD methods
    │   └── ToastContext.tsx  # Dynamic toast animations portal
    ├── hooks/                # Custom hooks
    │   ├── useAuth.ts        # Direct hook access to AuthContext
    │   ├── useTasks.ts       # Direct hook access to TaskContext
    │   └── useToast.ts       # Direct hook access to ToastContext
    └── utils/                # Helper tools
```

---

## 📂 Folder Explanations

- **`components/`**: Houses independent, reusable visual fragments which do not depend on global routing. By keeping components modular and DRY (Don't Repeat Yourself), UI elements can be shared across the entire system.
- **`layouts/`**: Separates global background frames. For example, the `AuthLayout` handles centralized forms, whereas `DashboardLayout` hosts the `Navbar` and footer.
- **`routes/`**: Handles path security guard shields (`ProtectedRoute` and `PublicRoute`) to intercept routing changes.
- **`services/`**: Holds API integration layers. The configured `api.ts` file instantiates Axios, manages headers, and intercepts expired sessions automatically.
- **`context/`**: Decentralizes app states using the Context API to avoid prop-drilling.

---

## ⚙️ Environment Variables

Copy `.env.example` into `.env` and configure accordingly:

```env
# URL where this applet is hosted
APP_URL="http://localhost:3000"

# Target API route. Default is relative /api proxy
VITE_API_URL="/api"
```

---

## 🚀 Running Locally

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Application in Development Mode
This fires the Express server on port `3000` while utilizing Vite's middleware wrapper:
```bash
npm run dev
```
Navigate to [http://localhost:3000](http://localhost:3000) to view the live app!

### 3. Build for Production
Compiles Vite client assets and bundles the backend server into standard Node-executable ESM:
```bash
npm run build
```

---

## 🐳 Running with Docker

### Using Docker Build
```bash
# Build the container image
docker build -t task-manager .

# Run the container exposing port 3000
docker run -p 3000:3000 task-manager
```

### Using Docker Compose
```bash
docker-compose up --build
```
The application will launch on [http://localhost:3000](http://localhost:3000).

---

## 🔐 Authentication Flow

1. **Sign-Up**: User posts credentials to `/api/auth/register`. The Express backend salts and hashes the password securely using standard Node pbkdf2 and generates a cryptographically signed HMAC-SHA256 JWT containing user details.
2. **Login**: User logs in at `/api/auth/login`. On credential matching, the server yields a token which is saved to `localStorage`.
3. **Session Auto-Restoration**: On page refresh, the client mounts the token from `localStorage` and performs a verification query to `/api/auth/me`. If valid, the user's details are restored.
4. **Logout**: Deletes the token and user details from `localStorage`, immediately redirecting back to `/login`.

---

## 🔒 Security & Guarded Routing

- **Route Shielding**: Authenticated routes are enclosed inside a `<ProtectedRoute>` tag. If authentication resolves false, the router redirects the user to `/login`.
- **Credential Masking**: If an authenticated session is active, navigating to `/login` or `/register` triggers the `<PublicRoute>` which redirects the user back to the `/dashboard` automatically.
- **Session Expiration Guard**: If an API request throws a `401` or `403` status code (indicating an expired or modified JWT token), Axios interceptors immediately clear `localStorage` and redirect the viewport to `/login?expired=true`.

---

## 📈 Dashboard Analytics

The dashboard tracks four vital KPIs:
1. **Total tasks cataloged**: Count of all tasks created by the user.
2. **Completed tasks**: Percent-based indicators.
3. **Pending actions**: Leftovers requiring active tracking.
4. **High priority urgencies**: Uncompleted tasks marked as high priority.

---

## 🧩 Test Checklist

### 1. Authentication
- [ ] User is unable to access `/dashboard` without signing in.
- [ ] Login fields raise inline validation errors on malformed email or empty passwords.
- [ ] Registered password requires at least 6 characters.
- [ ] Logout deletes stored tokens and redirects back to login.

### 2. Task Operations
- [ ] User can create a task (title is validated as required).
- [ ] Task status can be checked/unchecked dynamically from All Tasks or Dashboard lists.
- [ ] Search input successfully debounces and filters lists.
- [ ] Sorting order reverses on clicking arrow indicator.
- [ ] Deleting a task launches a protective warning modal requesting confirmation.

---

## 🔮 Future Improvements

- **Sub-tasks / Checklists**: Add child-task arrays to break down complex procedures.
- **Team Collaborations**: Invite other users to view and co-edit identical task boards.
- **SLA Notifications**: Fire calendar reminders as due dates approach.

---

## ✍️ Author

**Bibina Samley** (bibinasamley@gmail.com)  
*Full Stack Engineer*
