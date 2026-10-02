import { relations, sql } from "drizzle-orm";
import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import type { AdapterAccountType } from "@auth/core/adapters";

// ---------------------------------------------------------------------------
// Enums
// ---------------------------------------------------------------------------

export const roleEnum = pgEnum("role", [
  "learner",
  "instructor",
  "company_admin",
  "admin",
]);

export const courseLevelEnum = pgEnum("course_level", [
  "beginner",
  "intermediate",
  "advanced",
]);

export const enrollmentStatusEnum = pgEnum("enrollment_status", [
  "active",
  "completed",
  "cancelled",
]);

export const paymentStatusEnum = pgEnum("payment_status", [
  "pending",
  "success",
  "failed",
]);

export const paymentPurposeEnum = pgEnum("payment_purpose", [
  "course_enrollment",
  "coaching_booking",
]);

export const bookingStatusEnum = pgEnum("booking_status", [
  "pending_payment",
  "pending",
  "confirmed",
  "completed",
  "cancelled",
]);

export const lessonTypeEnum = pgEnum("lesson_type", [
  "video",
  "reading",
  "assignment",
  "quiz",
]);

export const submissionStatusEnum = pgEnum("submission_status", [
  "submitted",
  "reviewed",
  "approved",
  "changes_requested",
]);

export const jobTypeEnum = pgEnum("job_type", [
  "full_time",
  "part_time",
  "contract",
  "internship",
]);

export const applicationStatusEnum = pgEnum("application_status", [
  "submitted",
  "shortlisted",
  "rejected",
  "hired",
]);

const id = () =>
  uuid("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID());

// ---------------------------------------------------------------------------
// Companies
// ---------------------------------------------------------------------------

export const companies = pgTable("companies", {
  id: id(),
  name: text("name").notNull(),
  industry: text("industry"),
  contactEmail: text("contact_email").notNull(),
  contactPhone: text("contact_phone"),
  address: text("address"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const companiesRelations = relations(companies, ({ many }) => ({
  staff: many(users),
  enrollments: many(enrollments),
}));

// ---------------------------------------------------------------------------
// Users + NextAuth (Auth.js) required tables
// ---------------------------------------------------------------------------

export const users = pgTable("users", {
  id: id(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: timestamp("email_verified", { withTimezone: true }),
  image: text("image"),
  passwordHash: text("password_hash"),
  role: roleEnum("role").notNull().default("learner"),
  phone: text("phone"),
  bio: text("bio"),
  headline: text("headline"),
  companyId: uuid("company_id").references(() => companies.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const usersRelations = relations(users, ({ one, many }) => ({
  company: one(companies, {
    fields: [users.companyId],
    references: [companies.id],
  }),
  coursesTaught: many(courses),
  enrollments: many(enrollments),
  payments: many(payments),
  bookings: many(coachingBookings),
  submissions: many(submissions),
  jobApplications: many(jobApplications),
}));

export const accounts = pgTable(
  "accounts",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("provider_account_id").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => [
    primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  ]
);

export const sessions = pgTable("sessions", {
  sessionToken: text("session_token").primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { withTimezone: true }).notNull(),
});

export const verificationTokens = pgTable(
  "verification_tokens",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { withTimezone: true }).notNull(),
  },
  (vt) => [primaryKey({ columns: [vt.identifier, vt.token] })]
);

// ---------------------------------------------------------------------------
// Courses / Modules / Lessons
// ---------------------------------------------------------------------------

export const courses = pgTable("courses", {
  id: id(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  summary: text("summary").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  level: courseLevelEnum("level").notNull().default("beginner"),
  durationWeeks: integer("duration_weeks").notNull().default(4),
  priceNaira: integer("price_naira").notNull().default(0),
  isFree: boolean("is_free").notNull().default(false),
  thumbnailUrl: text("thumbnail_url"),
  instructorId: uuid("instructor_id").references(() => users.id, {
    onDelete: "set null",
  }),
  published: boolean("published").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const coursesRelations = relations(courses, ({ one, many }) => ({
  instructor: one(users, {
    fields: [courses.instructorId],
    references: [users.id],
  }),
  modules: many(modules),
  enrollments: many(enrollments),
  jobs: many(jobs),
}));

export const modules = pgTable("modules", {
  id: id(),
  courseId: uuid("course_id")
    .notNull()
    .references(() => courses.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  position: integer("position").notNull().default(0),
});

export const modulesRelations = relations(modules, ({ one, many }) => ({
  course: one(courses, {
    fields: [modules.courseId],
    references: [courses.id],
  }),
  lessons: many(lessons),
}));

export const lessons = pgTable("lessons", {
  id: id(),
  moduleId: uuid("module_id")
    .notNull()
    .references(() => modules.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  type: lessonTypeEnum("type").notNull().default("reading"),
  content: text("content"),
  videoUrl: text("video_url"),
  durationMinutes: integer("duration_minutes").notNull().default(15),
  position: integer("position").notNull().default(0),
});

export const lessonsRelations = relations(lessons, ({ one, many }) => ({
  module: one(modules, {
    fields: [lessons.moduleId],
    references: [modules.id],
  }),
  progress: many(lessonProgress),
  submissions: many(submissions),
}));

// ---------------------------------------------------------------------------
// Enrollments + progress
// ---------------------------------------------------------------------------

export const enrollments = pgTable("enrollments", {
  id: id(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  courseId: uuid("course_id")
    .notNull()
    .references(() => courses.id, { onDelete: "cascade" }),
  companyId: uuid("company_id").references(() => companies.id, {
    onDelete: "set null",
  }),
  status: enrollmentStatusEnum("status").notNull().default("active"),
  progressPercent: integer("progress_percent").notNull().default(0),
  enrolledAt: timestamp("enrolled_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  completedAt: timestamp("completed_at", { withTimezone: true }),
});

export const enrollmentsRelations = relations(
  enrollments,
  ({ one, many }) => ({
    user: one(users, {
      fields: [enrollments.userId],
      references: [users.id],
    }),
    course: one(courses, {
      fields: [enrollments.courseId],
      references: [courses.id],
    }),
    company: one(companies, {
      fields: [enrollments.companyId],
      references: [companies.id],
    }),
    lessonProgress: many(lessonProgress),
    messages: many(messages),
    certificate: one(certificates),
  })
);

export const lessonProgress = pgTable("lesson_progress", {
  id: id(),
  enrollmentId: uuid("enrollment_id")
    .notNull()
    .references(() => enrollments.id, { onDelete: "cascade" }),
  lessonId: uuid("lesson_id")
    .notNull()
    .references(() => lessons.id, { onDelete: "cascade" }),
  completed: boolean("completed").notNull().default(false),
  completedAt: timestamp("completed_at", { withTimezone: true }),
});

export const lessonProgressRelations = relations(lessonProgress, ({ one }) => ({
  enrollment: one(enrollments, {
    fields: [lessonProgress.enrollmentId],
    references: [enrollments.id],
  }),
  lesson: one(lessons, {
    fields: [lessonProgress.lessonId],
    references: [lessons.id],
  }),
}));

// ---------------------------------------------------------------------------
// Assignment submissions
// ---------------------------------------------------------------------------

export const submissions = pgTable("submissions", {
  id: id(),
  lessonId: uuid("lesson_id")
    .notNull()
    .references(() => lessons.id, { onDelete: "cascade" }),
  enrollmentId: uuid("enrollment_id")
    .notNull()
    .references(() => enrollments.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  content: text("content"),
  fileUrl: text("file_url"),
  status: submissionStatusEnum("status").notNull().default("submitted"),
  feedback: text("feedback"),
  submittedAt: timestamp("submitted_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
});

export const submissionsRelations = relations(submissions, ({ one }) => ({
  lesson: one(lessons, {
    fields: [submissions.lessonId],
    references: [lessons.id],
  }),
  enrollment: one(enrollments, {
    fields: [submissions.enrollmentId],
    references: [enrollments.id],
  }),
  user: one(users, { fields: [submissions.userId], references: [users.id] }),
}));

// ---------------------------------------------------------------------------
// Messaging (per-enrollment thread between learner and instructor)
// ---------------------------------------------------------------------------

export const messages = pgTable("messages", {
  id: id(),
  enrollmentId: uuid("enrollment_id")
    .notNull()
    .references(() => enrollments.id, { onDelete: "cascade" }),
  senderId: uuid("sender_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  body: text("body").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  readAt: timestamp("read_at", { withTimezone: true }),
});

export const messagesRelations = relations(messages, ({ one }) => ({
  enrollment: one(enrollments, {
    fields: [messages.enrollmentId],
    references: [enrollments.id],
  }),
  sender: one(users, { fields: [messages.senderId], references: [users.id] }),
}));

// ---------------------------------------------------------------------------
// Coaching bookings
// ---------------------------------------------------------------------------

export const coachingBookings = pgTable("coaching_bookings", {
  id: id(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  topic: text("topic").notNull(),
  notes: text("notes"),
  preferredDate: timestamp("preferred_date", { withTimezone: true }).notNull(),
  status: bookingStatusEnum("status").notNull().default("pending_payment"),
  priceNaira: integer("price_naira").notNull().default(15000),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const coachingBookingsRelations = relations(
  coachingBookings,
  ({ one }) => ({
    user: one(users, {
      fields: [coachingBookings.userId],
      references: [users.id],
    }),
  })
);

// ---------------------------------------------------------------------------
// Payments (Paystack)
// ---------------------------------------------------------------------------

export const payments = pgTable("payments", {
  id: id(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  reference: text("reference").notNull().unique(),
  amountNaira: integer("amount_naira").notNull(),
  purpose: paymentPurposeEnum("purpose").notNull(),
  relatedId: uuid("related_id").notNull(),
  status: paymentStatusEnum("status").notNull().default("pending"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  verifiedAt: timestamp("verified_at", { withTimezone: true }),
});

export const paymentsRelations = relations(payments, ({ one }) => ({
  user: one(users, { fields: [payments.userId], references: [users.id] }),
}));

// ---------------------------------------------------------------------------
// Certificates
// ---------------------------------------------------------------------------

export const certificates = pgTable("certificates", {
  id: id(),
  enrollmentId: uuid("enrollment_id")
    .notNull()
    .unique()
    .references(() => enrollments.id, { onDelete: "cascade" }),
  certificateNumber: text("certificate_number").notNull().unique(),
  issuedAt: timestamp("issued_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const certificatesRelations = relations(certificates, ({ one }) => ({
  enrollment: one(enrollments, {
    fields: [certificates.enrollmentId],
    references: [enrollments.id],
  }),
}));

// ---------------------------------------------------------------------------
// Jobs / recommendations
// ---------------------------------------------------------------------------

export const jobs = pgTable("jobs", {
  id: id(),
  title: text("title").notNull(),
  companyName: text("company_name").notNull(),
  description: text("description").notNull(),
  location: text("location").notNull().default("Remote"),
  type: jobTypeEnum("type").notNull().default("full_time"),
  requiredCourseId: uuid("required_course_id").references(() => courses.id, {
    onDelete: "set null",
  }),
  isActive: boolean("is_active").notNull().default(true),
  postedAt: timestamp("posted_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const jobsRelations = relations(jobs, ({ one, many }) => ({
  requiredCourse: one(courses, {
    fields: [jobs.requiredCourseId],
    references: [courses.id],
  }),
  applications: many(jobApplications),
}));

export const jobApplications = pgTable("job_applications", {
  id: id(),
  jobId: uuid("job_id")
    .notNull()
    .references(() => jobs.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  coverNote: text("cover_note"),
  status: applicationStatusEnum("status").notNull().default("submitted"),
  appliedAt: timestamp("applied_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const jobApplicationsRelations = relations(
  jobApplications,
  ({ one }) => ({
    job: one(jobs, { fields: [jobApplications.jobId], references: [jobs.id] }),
    user: one(users, {
      fields: [jobApplications.userId],
      references: [users.id],
    }),
  })
);

// ---------------------------------------------------------------------------
// Contact inquiries (public contact form)
// ---------------------------------------------------------------------------

export const inquiries = pgTable("inquiries", {
  id: id(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const schema = {
  companies,
  users,
  accounts,
  sessions,
  verificationTokens,
  courses,
  modules,
  lessons,
  enrollments,
  lessonProgress,
  submissions,
  messages,
  coachingBookings,
  payments,
  certificates,
  jobs,
  jobApplications,
  inquiries,
};

export { sql };
