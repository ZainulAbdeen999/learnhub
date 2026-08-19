# LearnHub - Coding Learning Platform

A w3schools-style learning platform with monetization: **documentation + video tutorials + practice quizzes + paid courses with Stripe** — deploy to Railway/Render and start earning.

## Features

- Courses with topics, lessons, and quizzes
- Markdown docs, code examples, and embedded YouTube videos in every lesson
- Quizzes with instant results + explanations (60% to pass)
- Practice zone with quick recall drills
- Progress tracking dashboard
- **Monetization:** Stripe checkout for paid courses (lifetime access per course)
- Admin panel: manage courses, lessons, quizzes + view earnings
- JWT authentication (student & admin roles)

## Tech Stack

- **Frontend:** React 18 + Vite + React Router + React Markdown
- **Backend:** Node.js + Express 5 + better-sqlite3
- **Payments:** Stripe (Checkout Sessions)
- **Auth:** JWT + bcrypt

## Local Development

```bash
cd learnhub
npm install          # installs concurrently at root
npm run install:all  # installs backend + frontend
npm run seed         # seed database with demo content (HTML/CSS/JS/Python courses)
npm run dev          # backend :5000 + frontend :5173
```

Open http://localhost:5173

## Demo Accounts

| Role    | Email                | Password   |
|---------|----------------------|------------|
| Admin   | admin@learnhub.com   | admin123   |
| Student | student@learnhub.com | student123 |

Admin key: `admin-key-123`

---

## Stripe Setup (for payments)

1. Create a free account at https://dashboard.stripe.com
2. In **Developers → API keys** → copy the **Secret key** (starts with `sk_test_`)
3. In **Developers → Webhooks** → add endpoint:
   - URL: `https://your-domain.com/api/webhooks/stripe`
   - Events: `checkout.session.completed`
   - Copy the **Signing secret** (starts with `whsec_`)
4. Create a `.env` file in the project root:

```
STRIPE_SECRET_KEY=sk_test_yourkeyhere
STRIPE_WEBHOOK_SECRET=whsec_yoursecrethere
FRONTEND_URL=https://your-live-url.com
JWT_SECRET=any-long-random-string
```

5. In **Admin → Courses** set the price for courses you want to sell (0 = free)

Students will see a "Buy now" button → Stripe Checkout → automatic enrollment after payment.

---

## Deploy to Railway

1. Push this folder to a new GitHub repo
2. Go to https://railway.app → New Project → Deploy from GitHub
3. Railway auto-detects the `render.yaml` or use:
   - **Build:** `npm install && npm --prefix frontend install && npm --prefix frontend run build`
   - **Start:** `node backend/server.js`
4. Add environment variables in Railway dashboard:
   - `STRIPE_SECRET_KEY`
   - `STRIPE_WEBHOOK_SECRET`
   - `FRONTEND_URL` = your Railway domain (e.g. `https://learnhub.up.railway.app`)
   - `JWT_SECRET` = random string
   - `ADMIN_KEY` = your admin registration key
5. Run `npm run seed` once on the server (Railway shell) or after first start

## Deploy to Render

1. Push to GitHub, create new Web Service on Render
2. Build: `npm install && cd frontend && npm install && npm run build`
3. Start: `node backend/server.js`
4. Set env vars as above in Render dashboard

---

## Project Structure

```
learnhub/
├── backend/
│   ├── server.js     # Express API + Stripe webhooks + SPA serving
│   ├── db.js         # SQLite schema + migrations
│   └── seed.js       # Demo content
├── frontend/
│   └── src/
│       ├── pages/    # Home, Courses, CourseDetail, LessonView, QuizView,
│       │             # Practice, Dashboard, Login, Register, Admin
│       └── components/  # CourseSidebar, PurchaseGate
├── Procfile          # Railway start command
├── render.yaml       # Render deployment config
└── .env.example      # Environment variables template
```

## Adding content

Login as admin → Admin panel → select or create course → add topics, lessons, quizzes.

**Video URLs:** paste YouTube embed URLs, e.g. `https://www.youtube.com/embed/UB1O30fR-EE`

**Marking courses paid:** Admin → Courses → select course → set price (>0) → Save
