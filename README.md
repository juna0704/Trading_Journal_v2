# 📊 Trading Journal Application

A full-stack **Trading Journal platform** designed to help traders log, analyze, and manage their trades with **secure authentication, admin approval workflows, and role-based access control**.

This project is built with a **production-grade architecture**, focusing on:

- Security
- Scalability
- Clean separation of frontend & backend
- Real-world authentication and admin flows

---

## 🧠 What This App Does

### 👤 For Traders

- Register and verify email
- Login with JWT authentication
- Log and manage trading activity
- Secure password reset flow
- Account activation controlled by admin

### 🛠️ For Admins

- Admin dashboard access
- Approve or reject new users
- Activate / deactivate user accounts
- Full control with role-based authorization

---

## 🏗️ Project Structure

```txt
trading-journal/
├─ README.md                ← You are here (Entry point)
├─ backend/
│  ├─ README.md             ← Backend overview & API docs index
│  └─ docs/                 ← Detailed backend documentation
├─ frontend/
│  └─ README.md             ← Frontend setup & UI docs
```

---

## 📄 Documentation Navigation (Start Here)

> 📌 **All documentation is linked hierarchically — no duplication**

### 🔙 Backend Documentation

👉 **[Backend README](backend/Readme.md)**
Includes:

- API overview
- Authentication flows
- Admin endpoints
- System health endpoints
- Links to detailed API docs

---

### 🎨 Frontend Documentation

👉 **[Frontend README](frontend/Readme.md)**
Includes:

- Frontend setup instructions
- Auth state handling
- API integration guide
- Page & route structure
- UI/UX behavior rules

---

## 🔐 Authentication Highlights

- JWT Access & Refresh tokens
- Email verification flow
- Admin approval required for activation
- Role-based access (`USER`, `SUPER_ADMIN`)
- Secure password reset via tokenized email links

---

## ❤️ System Health & Reliability

The backend exposes public system endpoints for monitoring:

- `/health` → Server health status
- `/api/live` → API availability
- Centralized error handling (404, auth, validation)

These make the app **deployment-ready** for Docker, CI/CD, and cloud hosting.

---

## 🚀 Quick Start (Development)

```bash
# Backend
cd backend
npm install
npm run dev
```

```bash
# Frontend
cd frontend
npm install
npm run dev
```

---

## 🧑‍💻 Tech Stack (High Level)

**Backend**

- Node.js + TypeScript
- Express
- Prisma + PostgreSQL
- JWT Authentication

**Frontend**

- React / Next.js
- Context-based auth state
- API service layer
- Protected routes

---

## 🎯 Why This Project Matters

This is **not a toy project**.

It demonstrates:

- Real authentication systems
- Admin-controlled user lifecycle
- Secure API design
- Clean documentation structure
- Scalable architecture suitable for real users

Ideal for:

- Portfolio
- Startup MVP
- Learning production patterns
- Interviews

---

## 📌 Final Note

> Start at this README → move to Backend → dive into Docs
> Start at this README → move to Frontend → understand UI flows

Everything is **connected, intentional, and easy to navigate**.
