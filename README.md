# Lifefkd24x7 🖋️

A community-powered quote-sharing platform. Real quotes, real people, no fluff.
Users sign up, drop quotes into the vault, and see them go live instantly — no approval gate. Admins manage users and moderate content from a completely separate, secured panel.

---

## ✨ Features

### User App
- 🔐 JWT-based register / login
- 📝 Submit quotes — auto-published instantly (no waiting on approval)
- 📋 Browse all quotes with search, category filter & pagination
- ❤️ Like / unlike quotes
- 🗂️ "My Quotes" — view, edit, delete your own submissions
- 🌗 Full dark/light theme toggle (persisted to `localStorage`)
- 🏠 Dynamic landing page — live stats & live quote feed pulled from the API

### Admin Panel (fully separate app & port)
- 🔑 Dedicated admin login (`/api/auth/admin-login`), backed by `.env` credentials
- 📊 Dashboard — total quotes, total users, recent activity tables
- 📚 Manage all quotes — search, filter, edit, delete
- 👥 Manage all users — promote/demote admin, ban/unban, delete
- 🌗 Independent theme state from the user app

---

## 🏗️ Architecture

This project is split into **three independent apps** that talk to each other only over HTTP:

```
quote-management-website/
├── server/      → Node + Express + MongoDB REST API   (port 5000)
├── client/      → User-facing React + Vite + Tailwind app (port 5173)
└── admin/       → Admin-only React + Vite + Tailwind app  (port 5174)
```

**Why separate frontends?**
- Admin panel never ships to regular users — smaller bundle, better security boundary
- User-side bugs can't break the admin tools and vice versa
- Each app has its own `AuthContext` (different localStorage keys, different login endpoints) and its own `ThemeContext`

| | Server | Client (User) | Admin |
|---|---|---|---|
| Port | `5000` | `5173` | `5174` |
| Login endpoint | — | `/api/auth/login` | `/api/auth/admin-login` |
| Auth storage keys | — | `token`, `user` | `adminToken`, `adminUser` |
| Theme storage key | — | `theme` | `adminTheme` |

---

## 🛠️ Tech Stack

**Backend**
- Node.js + Express (ES Modules)
- MongoDB + Mongoose
- JWT authentication
- bcrypt password hashing

**Frontend (both apps)**
- React 18 + Vite
- Tailwind CSS (`@tailwindcss/vite` plugin)
- React Router DOM
- Axios
- React Hot Toast

---

## 📂 Folder Structure

```
server/
├── config/
│   └── db.js                  # MongoDB connection
├── controller/
│   ├── auth.controller.js     # register, login, adminLogin, getMe
│   ├── quote.controller.js    # CRUD + like
│   ├── user.controller.js     # profile, my-quotes
│   └── admin.controller.js    # stats, manage quotes/users
├── middleware/
│   ├── auth.middleware.js     # JWT verification
│   └── admin.middleware.js    # role check
├── models/
│   ├── userModel.js
│   └── quoteModel.js
├── routers/
│   ├── authRoute.js
│   ├── quoteRoute.js
│   ├── userRoute.js
│   └── adminRoute.js
├── .env
└── server.js

client/
└── src/
    ├── context/
    │   ├── AuthContext.jsx     # user/token/login/logout + BACKEND url
    │   └── ThemeContext.jsx    # dark/light tokens
    ├── components/
    │   ├── Sidebar.jsx
    │   └── ProtectedRoute.jsx
    └── pages/
        ├── Landing.jsx
        ├── Login.jsx
        ├── Register.jsx
        └── user/
            ├── Dashboard.jsx
            ├── AddQuote.jsx
            └── MyQuotes.jsx

admin/
└── src/
    ├── context/
    │   ├── AuthContext.jsx     # admin/token/login/logout + BACKEND url
    │   └── ThemeContext.jsx    # dark/light tokens + table tokens
    ├── components/
    │   ├── Sidebar.jsx
    │   └── ProtectedRoute.jsx
    └── pages/
        ├── Login.jsx
        └── admin/
            ├── Dashboard.jsx
            ├── AllQuotes.jsx
            └── Users.jsx
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB running locally (or a MongoDB Atlas URI)

### 1. Clone the repo
```bash
git clone <your-repo-url>
cd quote-management-website
```

### 2. Backend setup
```bash
cd server
npm install
```

Create `server/.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/lifefkd24x7
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d
ADMIN_EMAIL=admin@lifefkd24x7.com
ADMIN_PASSWORD=your_admin_password_here
```

Run the server:
```bash
npm run dev
```
API will be live at **http://localhost:5000**

### 3. User client setup
```bash
cd ../client
npm install
```

Create `client/.env`:
```env
VITE_BACKEND_URL=http://localhost:5000
```

Run:
```bash
npm run dev
```
User app will be live at **http://localhost:5173**

### 4. Admin panel setup
```bash
cd ../admin
npm install
```

Create `admin/.env`:
```env
VITE_BACKEND_URL=http://localhost:5000
```

Run:
```bash
npm run dev
```
Admin app will be live at **http://localhost:5174**

> ℹ️ The very first successful login at `/api/auth/admin-login` using the credentials in `server/.env` automatically creates (or promotes) that user to the `admin` role in the database — no manual seeding required.

---

## 🔌 API Overview

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Create a user account | Public |
| POST | `/api/auth/login` | User login | Public |
| POST | `/api/auth/admin-login` | Admin login (auto-provisions admin) | Public |
| GET | `/api/auth/me` | Get current user | User |
| GET | `/api/quotes` | List quotes (search/category/pagination) | Public |
| POST | `/api/quotes` | Create a quote (auto-published) | User |
| PUT | `/api/quotes/:id` | Update own quote | User |
| DELETE | `/api/quotes/:id` | Delete own quote | User |
| PUT | `/api/quotes/:id/like` | Like / unlike a quote | User |
| GET | `/api/users/my-quotes` | Get my submitted quotes | User |
| GET | `/api/admin/public-stats` | Total quotes & users (for landing page) | Public |
| GET | `/api/admin/stats` | Full dashboard stats | Admin |
| GET | `/api/admin/quotes` | All quotes (search/filter/pagination) | Admin |
| DELETE | `/api/admin/quotes/:id` | Delete any quote | Admin |
| GET | `/api/admin/users` | All users (search/filter/pagination) | Admin |
| PUT | `/api/admin/users/:id/role` | Promote/demote admin role | Admin |
| PUT | `/api/admin/users/:id/ban` | Ban / unban a user | Admin |
| DELETE | `/api/admin/users/:id` | Delete a user | Admin |

---

## 🎨 Theming

Both apps use a shared theming pattern via `ThemeContext`. Every page consumes the same token set, so dark/light mode stays visually consistent everywhere:

```js
theme.bg, theme.bg2, theme.bg3, theme.bgCard, theme.bgInput, theme.bgHover,
theme.border, theme.borderInput,
theme.text, theme.text2, theme.text3, theme.textInput, theme.placeholder,
theme.navBg, theme.divider, theme.gridGap,
theme.ring, theme.focusBorder, theme.footer,
theme.tableHead, theme.tableRow, theme.tableBorder   // admin only
```

Usage in any component:
```jsx
import { useContext } from 'react'
import { ThemeContext } from '../context/ThemeContext'

const { dark, toggleTheme, theme } = useContext(ThemeContext)

<div className={`${theme.bg} ${theme.text}`}>...</div>
```

---

## 🗒️ Notes on Design Decisions

- **No approval workflow** — quotes go live the instant a user submits them. Admins retain full edit/delete control after the fact, but there's no pending queue blocking users.
- **Separate admin login** — admins never use the same login form or endpoint as regular users; credentials are sourced from environment variables, not a public registration flow.
- **`BACKEND` URL lives in context, not scattered `import.meta.env` calls** — every component pulls it from `AuthContext` for a single source of truth.

---

## 👤 Author

**Anu**

---
