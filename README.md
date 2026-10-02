# Amplify Digital Technologies — Web Platform

The Amplify Digital Technologies website and learning platform: a marketing
site, course/coaching registration, Paystack payments, and a full learning
management system (LMS) with learner, instructor, company and admin
dashboards.

## Tech stack

- **Next.js 16** (App Router, React 19, TypeScript) — one codebase for the
  public site, the LMS, and the backend (Server Actions + Route Handlers).
- **PostgreSQL** with **Drizzle ORM** — type-safe schema and queries, no
  native binaries to install (works the same on Windows, macOS, Linux and
  in CI).
- **Auth.js (NextAuth v5)** — email/password login today, with Google OAuth
  ready to switch on by adding two environment variables.
- **Paystack** — course and coaching-session payments, verified both via the
  checkout redirect and a server-to-server webhook (so a payment is never
  lost if someone closes their browser mid-redirect).
- **Tailwind CSS v4** — themed with the Amplify brand palette (navy / teal).

No paid services are required to run this locally: Postgres can run on your
own machine or a free tier from [Neon](https://neon.tech) or
[Supabase](https://supabase.com), and Paystack has a free test mode.

## Getting started

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up Postgres.** Either run one locally, or grab a free connection
   string from Neon/Supabase. Then:
   ```bash
   cp .env.example .env.local
   # edit .env.local and paste your DATABASE_URL
   ```

3. **Create the database tables**
   ```bash
   npm run db:push
   ```

4. **Seed demo data** (a few real Amplify courses, an admin, an instructor,
   a learner with a completed course + certificate, a demo company with a
   staff member, and a couple of job listings):
   ```bash
   npm run db:seed
   ```
   Demo logins (password for all: `Password123!`):
   | Role | Email |
   |---|---|
   | Admin | admin@amplifydigitaltech.com |
   | Instructor | instructor@amplifydigitaltech.com |
   | Learner | learner@amplifydigitaltech.com |
   | Company admin | hr@northstartech.ng |

5. **Add Auth.js and Paystack keys** to `.env.local`:
   - `AUTH_SECRET` — generate with `npx auth secret`
   - `PAYSTACK_SECRET_KEY` / `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` — free test
     keys from your [Paystack dashboard](https://dashboard.paystack.com/#/settings/developer)

6. **Run it**
   ```bash
   npm run dev
   ```
   Visit http://localhost:3000.

### Paystack webhook (for production)

In your Paystack dashboard, add a webhook pointing to
`https://yourdomain.com/api/paystack/webhook`. This is what reliably marks a
course enrollment or coaching booking as paid even if the customer closes
the tab right after paying — the checkout redirect page
(`/checkout/callback`) does the same verification for the case where they
do return, so the flow works properly either way.

## What's built (Phase 1)

- **Marketing site** — Home, About, Courses (with filtering), Course
  detail, Coaching, Enterprise (for companies), Jobs, Contact.
- **Accounts** — learner sign-up, company sign-up (creates a company +
  company-admin account), login, role-based access (learner / instructor /
  company admin / admin).
- **Enrollment & payments** — free courses enroll instantly; paid courses
  and coaching sessions go through Paystack, verified via redirect +
  webhook.
- **Learner dashboard** — enrolled courses with progress bars, a course
  player (curriculum, mark lessons complete, watch/read content), assignment
  submission, direct messaging with the course instructor, coaching
  bookings, a certificate once a course hits 100%, and a job board gated by
  certificate ownership where a role requires one.
- **Instructor dashboard** — courses taught, student roster with progress,
  a submissions queue to give feedback/approve assignments, and messaging
  with students.
- **Company dashboard** — add staff (creates their learner accounts under
  your company) and assign them courses; progress is visible per staff
  member.
- **Admin dashboard** — full course editor (create courses, add modules and
  lessons, publish/unpublish), user role management, enrollments, coaching
  booking confirmation, companies, job listings, and contact-form
  inquiries.
- **Certificates** — auto-issued on 100% course completion, with a public,
  printable verification page at `/certificate/[certificateNumber]`.

## Deliberate simplifications (and what to add next)

Being upfront about what's *not* fully built yet, so nothing here comes as
a surprise:

- **Messaging is refresh-based, not real-time.** It works (send/receive,
  persisted, per-course thread) but doesn't push new messages live. Adding
  that means wiring up a realtime provider (Pusher, Ably, or Postgres
  `LISTEN/NOTIFY` over a WebSocket) — a self-contained upgrade to
  `MessageThread.tsx` and the `sendMessageAction`.
- **Assignment submissions take a link, not a file upload.** Learners paste
  a link to their work (GitHub, Google Drive, etc.) rather than uploading a
  file to the platform. Real file storage (e.g. S3, Cloudflare R2, or
  Vercel Blob) is a clean addition to `submitAssignmentAction`.
- **Job matching is manual, not automated.** Admins post roles and gate
  them by a required course certificate; there's no resume-matching engine.
- **No email notifications yet** (booking confirmed, new message, feedback
  received, etc.) — plugging in Resend or SendGrid is the natural next step.
- **No automated test suite.** I ran a full manual end-to-end pass of every
  major flow (registration, enrollment, payment logic, progress tracking,
  messaging, submissions, certificates, job applications, admin CRUD,
  company staff/course assignment) before delivery, but there are no
  Playwright/Vitest tests checked in yet.
- **The logo is a coded placeholder**, not your original artwork —
  see the note below.
- **Coaching sessions don't include video-call scheduling** (e.g. a Zoom/
  Google Meet link) — currently it's a booking + confirmation; the actual
  call is arranged outside the platform.

None of these are hard to add — they just weren't necessary for a working
first version, and I'd rather hand over something real and tell you exactly
where the edges are.

## About the logo

`src/components/layout/Logo.tsx` draws a coded approximation of your mark
(the mountain "A" merged with a "D", in your navy/teal palette) so the site
never depends on a screenshot of the brand guide. Swap in your real vector
logo whenever it's available:

- Replace the `LogoMark` SVG with your actual logo file (SVG is best for
  crisp scaling), or
- Drop an official PNG/SVG export into `public/brand/` and swap the
  `<Logo>` component to render an `<Image>` instead.

The browser tab icon is still Next.js's default (`src/app/favicon.ico`) —
replace that file with a favicon generated from your logo whenever you're
ready.

## Project structure

```
src/
  app/
    (marketing)/       Public site — home, courses, coaching, etc.
    (auth)/             Login, register, register/company
    dashboard/          Protected app — learner/instructor/company/admin
    api/                NextAuth handler + Paystack webhook
    certificate/        Public certificate verification page
    checkout/callback/  Paystack redirect landing page
  components/
    ui/                 Small reusable primitives (Button, Card, Field...)
    layout/             Navbar, Footer, Logo
    dashboard/          Dashboard-only components
    marketing/          Public-site-only components
  lib/
    db/                 Drizzle schema, client, seed script, shared types
    actions/            Server Actions — one file per feature area
    auth.ts             Auth.js config + requireUser/requireRole helpers
    paystack.ts         Paystack API wrapper (initialize/verify/webhook)
    validations.ts      Zod schemas for every form
```

## Deploying

This is a standard Next.js app — it deploys to
[Vercel](https://vercel.com) with zero config (connect the repo, add the
environment variables from `.env.example`, done). Any Node.js host works
too (`npm run build && npm run start`). Point `DATABASE_URL` at a
production Postgres instance (Neon and Supabase both have generous free
tiers that are fine to start on) and switch `PAYSTACK_SECRET_KEY` /
`NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` to your live keys when you're ready to
accept real payments.
